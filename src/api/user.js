import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/sign/login',
    method: 'get',
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/sign',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/sign/logout',
    method: 'get'
  })
}
