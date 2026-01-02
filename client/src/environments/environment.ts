const DOMAIN = 'http://127.0.0.1:5000';

interface IEnvironment {
    production: boolean
    key: string;
    domain: string;
    apiUrl: string;
}

export const environment: IEnvironment = {
    production: false,
    key: '',
    domain: DOMAIN,
    apiUrl: DOMAIN,
};