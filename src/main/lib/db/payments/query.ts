import { PaymentTypes, SortOrder } from '@shared/constants'
import { GetPaymentsDbParams, Payment } from '@shared/types'
import { FilterQuery, PipelineStage } from 'mongoose'

export const getPaymentsQuery = (params: GetPaymentsDbParams) => {
  const sort: Record<string, SortOrder> = params.sort
    ? {
        [params.sort.field]: params.sort.sortOrder
      }
    : {
        createdAt: -1
      }
  const andQuery: FilterQuery<Payment>[] = []
  if (params.filter?.studentIds && params.filter.studentIds.length) {
    andQuery.push({
      studentId: {
        $in: params.filter.studentIds
      }
    })
  }
  if (params.filter?.types && params.filter.types.length) {
    andQuery.push({
      type: { $in: params.filter.types }
    })
  }
  const query: PipelineStage[] = [
    {
      $match: andQuery.length
        ? {
            $and: andQuery
          }
        : {}
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
        totalMiscPaid: {
          $sum: {
            $cond: [{ $eq: ['$type', PaymentTypes.misc] }, '$amount', 0]
          }
        },
        totalFeesPaid: {
          $sum: {
            $cond: [{ $eq: ['$type', PaymentTypes.fees] }, '$amount', 0]
          }
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
    }
  ]
  if (params.studentDetails) {
    query.push(
      {
        $lookup: {
          from: 'students',
          as: 'student',
          let: {
            studentId: '$list.studentId'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$studentId']
                }
              }
            },
            {
              $project: {
                name: 1,
                class: 1,
                section: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$student'
        }
      }
    )
  }
  query.push({
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
      },
      totalMiscPaid: {
        $first: '$totalMiscPaid'
      },
      totalFeesPaid: {
        $first: '$totalFeesPaid'
      }
    }
  })
  return query
}
