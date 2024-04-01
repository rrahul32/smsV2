export enum Classes {
  nursery = 'NUR',
  lkg = 'LKG',
  ukg = 'UKG',
  one = 'I',
  two = 'II',
  three = 'III',
  four = 'IV',
  five = 'V',
  six = 'VI',
  seven = 'VII',
  eight = 'VIII',
  nine = 'IX',
  ten = 'X'
}

export enum Sections {
  a = 'A',
  b = 'B'
}

export enum GetStudentsSortFields {
  class = 'sortPriority',
  section = 'section',
  name = 'name'
}

export enum GetDueListSortFields {
  studentName = 'name',
  studentClass = 'sortPriority',
  totalFeesDue = 'totalFeesDue',
  totalMiscDue = 'totalMiscDue',
  totalDue = 'totalDue'
}
