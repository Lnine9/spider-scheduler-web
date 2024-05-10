const PROJECT_STATUS_COLOR_MAP = {
  0: 'info',
  1: 'primary',
  2: 'warning',
}

const PROJECT_STATUS_MAP = {
  0: '未完成',
  1: '已完成',
  2: '子任务异常',
}

export const projectStatusColorFilter = status => PROJECT_STATUS_COLOR_MAP[status]
export const projectStatusFilter = status => PROJECT_STATUS_MAP[status]

const TASK_STATUS_COLOR_MAP = {
  0: 'info',
  1: 'info',
  2: 'warning',
  3: 'primary',
  4: 'danger',
}

const TASK_STATUS_MAP = {
  0: '未开始',
  1: '等待中',
  2: '进行中',
  3: '已完成',
  4: '执行异常',
}

export const taskStatusColorFilter = status => TASK_STATUS_COLOR_MAP[status]
export const taskStatusFilter = status => TASK_STATUS_MAP[status]
