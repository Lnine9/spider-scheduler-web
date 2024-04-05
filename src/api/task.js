import request from "@/utils/request";

export function queryProject(params) {
  return request({
    url: "/project/query",
    method: "get",
    params
  });
}

export function getProject(params) {
  return request({
    url: "/project/get",
    method: "get",
    params
  });
}

export function getTaskByProjectId(params) {
  return request({
    url: "/task/get_task_by_project_id",
    method: "get",
    params
  });
}
