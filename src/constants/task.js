const PROJECT_STATUS_COLOR_MAP = {
  0: 'warning',
  1: 'success',
}

const PROJECT_STATUS_MAP = {
  0: '未完成',
  1: '已完成',
}

export const projectStatusColorFilter = status => PROJECT_STATUS_COLOR_MAP[status]
export const projectStatusFilter = status => PROJECT_STATUS_MAP[status]

const TASK_STATUS_COLOR_MAP = {
  0: 'info',
  1: 'warning',
  2: 'success',
}

const TASK_STATUS_MAP = {
  0: '等待中',
  1: '进行中',
  2: '已完成',
}

export const taskStatusColorFilter = status => TASK_STATUS_COLOR_MAP[status]
export const taskStatusFilter = status => TASK_STATUS_MAP[status]
