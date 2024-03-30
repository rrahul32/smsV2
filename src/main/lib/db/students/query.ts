import { Classes, PaymentTypes } from '@shared/constants'
import { GetDueListDbParams, GetStudentsDbParams, Student } from '@shared/types'
import { FilterQuery, PipelineStage } from 'mongoose'

const sortPriority = Object.values(Classes).map((eachClass, index) => {
  return {
    case: {
      $eq: ['$class', eachClass]
    },
    then: index + 1
  }
})

export const getStudentsQuery = (params: GetStudentsDbParams) => {
  const andQuery: FilterQuery<Student>[] = []
  andQuery.push({
    academicYear: params.filter.academicYear
  })
  if (params.filter.classes && params.filter.classes.length) {
    andQuery.push({
      class: {
        $in: params.filter.classes
      }
    })
  }
  if (params.filter.sections && params.filter.sections.length) {
    andQuery.push({
      section: {
        $in: params.filter.sections
      }
    })
  }
  if (params.filter.searchText && params.filter.searchText.length) {
    andQuery.push({
      name: {
        $regex: params.filter.searchText,
        $options: 'i'
      }
    })
  }
  const query: PipelineStage[] = [
    {
      $match: {
        $and: andQuery
      }
    },
    {
      $addFields: {
        sortPriority: {
          $switch: {
            branches: sortPriority,
            default: 0
          }
        }
      }
    },
    {
      $sort: {
        sortPriority: 1
      }
    },
    {
      $group: {
        _id: null,
        totalCount: {
          $sum: 1
        },
        list: {
          $push: '$$ROOT'
        }
      }
    },
    {
      $unwind: {
        path: '$list'
      }
    },
    {
      $skip: params.skip ?? 0
    },
    {
      $limit: params.limit ?? 10
    },
    {
      $group: {
        _id: null,
        totalCount: {
          $first: '$totalCount'
        },
        count: {
          $sum: 1
        },
        list: {
          $push: '$list'
        }
      }
    },
    {
      $project: {
        _id: 0,
        'list.sortPriority': 0
      }
    }
  ]
  return query
}

export const getDueListQuery = (params: GetDueListDbParams) => {
  const currentMonth = new Date().getMonth() + 1
  const andQuery: FilterQuery<Student>[] = []
  andQuery.push({
    academicYear: params.filter.academicYear
  })
  if (params.filter.classes && params.filter.classes.length) {
    andQuery.push({
      class: {
        $in: params.filter.classes
      }
    })
  }
  if (params.filter.sections && params.filter.sections.length) {
    andQuery.push({
      section: {
        $in: params.filter.sections
      }
    })
  }
  const sort: PipelineStage.Sort['$sort'] = {}
  if (params.sort && params.sort.sortField === 'due') {
    sort['totalDue'] = params.sort.sortOrder
  } else {
    sort['sortPriority'] = params.sort?.sortOrder ?? 1
  }
  const query: PipelineStage[] = [
    {
      $match: {
        $and: andQuery
      }
    },
    {
      $lookup: {
        from: 'payments',
        let: {
          studentId: '$_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$studentId', '$$studentId']
              }
            }
          },
          {
            $group: {
              _id: null,
              totalFeesPaid: {
                $sum: {
                  $cond: [{ $eq: ['$type', PaymentTypes.fees] }, '$amount', 0]
                }
              },
              totalMiscPaid: {
                $sum: {
                  $cond: [{ $eq: ['$type', PaymentTypes.misc] }, '$amount', 0]
                }
              }
            }
          }
        ],
        as: 'payments'
      }
    },
    {
      $unwind: {
        path: '$payments',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        name: 1,
        class: 1,
        section: 1,
        totalFeesDue: {
          $subtract: [
            {
              $add: [
                '$admissionFee',
                {
                  $multiply: [
                    { $add: ['$tuitionFee', '$conveyanceFee'] },
                    {
                      $cond: [
                        { $lt: ['$joinedFrom', currentMonth] },
                        { $subtract: [currentMonth, '$joinedFrom'] },
                        {
                          $subtract: [12 + currentMonth, 'joinedFrom']
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              $ifNull: ['$payments.totalFeesPaid', 0]
            }
          ]
        },
        totalMiscDue: {
          $subtract: [
            { $add: ['$booksTotal', '$uniformTotal'] },
            { $ifNull: ['$payments.totalMiscPaid', 0] }
          ]
        },
        sortPriority: {
          $switch: {
            branches: sortPriority,
            default: 0
          }
        }
      }
    },
    {
      $addFields: {
        totalFeesDue: {
          $cond: [{ $lt: ['$totalFeesDue', 0] }, 0, '$totalFeesDue']
        },
        totalDue: {
          $sum: ['$totalFeesDue', '$totalMiscDue']
        }
      }
    },
    {
      $sort: sort
    },
    {
      $group: {
        _id: null,
        totalCount: {
          $sum: 1
        },
        list: {
          $push: '$$ROOT'
        }
      }
    },
    {
      $unwind: {
        path: '$list'
      }
    },
    {
      $skip: params.skip ?? 0
    },
    {
      $limit: params.limit ?? 10
    },
    {
      $group: {
        _id: null,
        totalCount: {
          $first: '$totalCount'
        },
        count: {
          $sum: 1
        },
        list: {
          $push: '$list'
        }
      }
    }
  ]
  return query
}
