export const Routes = {
  Home: { path: '/' },
  Login: { path: '/login' },
  Register: { path: '/register' },
  ForgotPassword: { path: '/reset-password' },
  VerifyEmail: { path: '/verify-email' },
  Introduction: { path: '/introduction' },
  Workspace: {
    path: '/workspace',
    Labeling: {
      path: '/workspace/labeling',
      HCaptcha: '/workspace/labeling/hcaptcha',
    },
    Questionnaire: {
      path: '/workspace/questionnaire',
    },
    Profile: {
      path: '/workspace/profile',
    },
    Referral: {
      path: '/workspace/referral',
    },
    AdminPanel: {
      path: '/workspace/admin-panel',
    },
    Withdrawals: {
      path: '/workspace/withdrawals',
    },
  },
};
