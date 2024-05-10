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
