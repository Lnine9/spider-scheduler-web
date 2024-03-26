import request from "@/utils/request";

export function getScheduleList(params) {
  return request({
    url: "/schedule/list",
    method: "get",
    params
  });
}

export function addSchedule(data) {
  return request({
    url: "/schedule/add",
    method: "post",
    data
  });
}

export function updateSchedule(data) {
  return request({
    url: "/schedule/update",
    method: "post",
    data
  });
}

export function deleteSchedule(data) {
  return request({
    url: "/schedule/delete",
    method: "post",
    data
  });
}

export function changeStatus(data) {
  return request({
    url: "/schedule/changeStatus",
    method: "post",
    data
  });
}
