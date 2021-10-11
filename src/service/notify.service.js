import { toast } from 'react-toastify';

const toastConfig = {
  position: toast.POSITION.TOP_CENTER,
};
export default {
  success: (message) => toast.success(message, toastConfig),
  warning: (message) => toast.warn(message, toastConfig),
  error: (message) => toast.error(message, toastConfig),
};
