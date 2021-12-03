import jwtDecode from 'jwt-decode';

export function getJwtPayload(token) {
  const { sub } = jwtDecode(token);

  return sub;
}
