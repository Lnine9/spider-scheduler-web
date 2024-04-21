import request from '@/utils/request'

export function getManageSpiderList(params) {
  return request({
    url: '/spider/getSpiderList',
    method: 'get',
    params
  })
}

export function uploadSpider(data) {
  return request({
    url: '/spider/upload',
    method: 'post',
    data
  })
}

export function getFileInfo() {
  return request({
    url: '/spider/getFileInfo',
    method: 'get'
  })
}

export function addManageSpider(data) {
  return request({
    url: '/spider/add',
    method: 'post',
    data
  })
}

export function deleteManageSpider(data) {
  return request({
    url: '/spider/delete',
    method: 'post',
    data
  })
}

export function updateManageSpider(data) {
  return request({
    url: '/spider/update',
    method: 'post',
    data
  })
}
