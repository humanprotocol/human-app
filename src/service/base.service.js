export const validatePassword = (password) => {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters'
    };
  }
  if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
    return {
      valid: false,
      message: 'Password must contain at least 1 letter and 1 number'
    }
  }

  return { valid: true, message: '' };
}