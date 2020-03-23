
export const URL_SERVER = 'http://localhost/gold-silver-backend';
//export const URL_SERVER = 'http://eletricagoldsilver.com.br';

export const getToken = () => {
    const token = localStorage.getItem("token") || null;
    return token;
}