import Cookies from 'js-cookie'
import defaultConfig from '@/settings'

const TokenKey = defaultConfig.authorizationName

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
