import request from "@/utils/request";

export function scheduleStatistic(params){
  return request({
    url: '/statistic/schedule_statistic',
    method: 'get',
    params
  })
}

export function runningProjects(params){
  return request({
    url: '/statistic/running_projects',
    method: 'get',
    params
  })
}

export function last24hTaskCount(params){
  return request({
    url: '/statistic/last_24h_task_count',
    method: 'get',
    params
  })
}
