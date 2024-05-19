import request from "@/utils/request";

export function getNodeList(params) {
  return request({
    url: "/scrapyd/list",
    method: "get",
    params,
    timeout: 60 * 1000
  });
}

export function getNodeDetail(params) {
  return request({
    url: "/scrapyd/detail",
    method: "get",
    params
  });
}

export function addNode(data) {
  return request({
    url: "/scrapyd/add",
    method: "post",
    data
  });
}

export function deleteNode(data) {
  return request({
    url: "/scrapyd/delete",
    method: "post",
    data
  });
}

export function updateEgg(data) {
  return request({
    url: "/scrapyd/update_egg",
    method: "post",
    data,
    timeout: 60 * 1000
  });
}
