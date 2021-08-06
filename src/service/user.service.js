export const authHeader = () => {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
      return { 'Authorization': 'Bearer ' + user.token };
  } else {
      return {};
  }
}

export const register = async (user) => {
  localStorage.setItem('user', JSON.stringify(user));  
  return user;
}

export const signIn = async ({email, password}) => {
  localStorage.setItem("token", 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3QudXNlckBnbWFpbC5jb20iLCJ1c2VyTmFtZSI6InN0YXJEdXN0IiwiZmlyc3ROYW1lIjoiSmFtZXMiLCJsYXN0TmFtZSI6IkFsZXgiLCJwYXNzd29yZCI6IlFXRTEyMyFAIyJ9.7f7ATho1Qd0e-IO3OhoE-oiCGSPYaKGuKHQgf3bJ7Oo');
  localStorage.setItem('user', JSON.stringify({ email, password }));
  return true;
}

export const update = async (user) => {
  localStorage.setItem('user', JSON.stringify(user));  
  return user;
}

export const logOut = async () => {
  localStorage.removeItem('user');
  return true;
}