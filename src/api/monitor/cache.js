import request from '@/utils/request'

// 查詢緩存詳細
export function getCache() {
  return request({
    url: '/monitor/cache',
    method: 'get'
  })
}

// 查詢緩存名稱列表
export function listCacheName() {
  return request({
    url: '/monitor/cache/getNames',
    method: 'get'
  })
}

// 查詢緩存鍵名列表
export function listCacheKey(cacheName) {
  return request({
    url: '/monitor/cache/getKeys/' + cacheName,
    method: 'get'
  })
}

// 查詢緩存內容
export function getCacheValue(cacheName, cacheKey) {
  return request({
    url: '/monitor/cache/getValue/' + cacheName + '/' + cacheKey,
    method: 'get'
  })
}

// 清理指定名稱緩存
export function clearCacheName(cacheName) {
  return request({
    url: '/monitor/cache/clearCacheName/' + cacheName,
    method: 'delete'
  })
}

// 清理指定鍵名緩存
export function clearCacheKey(cacheKey) {
  return request({
    url: '/monitor/cache/clearCacheKey/' + cacheKey,
    method: 'delete'
  })
}

// 清理全部緩存
export function clearCacheAll() {
  return request({
    url: '/monitor/cache/clearCacheAll',
    method: 'delete'
  })
}
