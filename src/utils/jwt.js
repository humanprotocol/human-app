import jwtDecode from 'jwt-decode';

export function getJwtPayload(token) {
  const { sub } = jwtDecode(token);
  return sub;
}

export function isJwtExpired(token) {
  const { exp } = jwtDecode(token);
  return Date.now() >= exp * 1000;
}
