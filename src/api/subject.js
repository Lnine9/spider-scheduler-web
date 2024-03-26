import request from "@/utils/request";

export function getSubjectList(params) {
  return request({
    url: "/subject/list",
    method: "get",
    params
  });
}

export function addSubject(data) {
  return request({
    url: "/subject/add",
    method: "post",
    data
  });
}

export function updateSubject(data) {
  return request({
    url: "/subject/update",
    method: "post",
    data
  });
}

export function deleteSubject(data) {
  return request({
    url: "/subject/delete",
    method: "post",
    data
  });
}
