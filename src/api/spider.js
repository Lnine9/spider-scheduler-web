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

export function getResolverList() {
  return request({
    url: '/spider/resolver_list',
    method: 'get'
  })
}

export function addResolver(data) {
  return request({
    url: '/spider/add_resolver',
    method: 'post',
    data
  })
}

export function deleteResolver(data) {
  return request({
    url: '/spider/delete_resolver',
    method: 'post',
    data
  })
}
