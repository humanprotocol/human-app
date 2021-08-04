import { createBrowserHistory } from 'history';

export const Routes = {
    // pages
    Home: { path: '/' },
    Login: { path: '/login' },
    Register: { path: '/register' },
    ForgotPassword: { path: '/changePassword'},
    LinkWallet: { path: '/linkWallet' },
    Earning: { path: '/earning' },
    Profile: { path: '/profile' },
};

export const history = createBrowserHistory();