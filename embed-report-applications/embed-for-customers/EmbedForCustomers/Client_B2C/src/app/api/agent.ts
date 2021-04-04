import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';

import { IEmbedParams } from '../models/report';

axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT;

axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network error - make sure API is running!')
    }
    const {status, data, config} = error.response;
    if (status === 404) {
        console.log('404 error');
        history.push('/notfound')
    }
    if (status === 403) {
        console.log('403 error');
        history.push('/notfound')
    }
    if (status === 401) {
        console.log('401 error');
        history.push('/')
        toast.info('Your session has expired.')
    }
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        console.log('400 error');
        history.push('/notfound')
    }
    if (status === 500) {
        console.log('500 error');
        toast.error('Server error - check the terminal for more info!')
    }
    throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody) 
};

const Reports = {
    getReport: (id: string): Promise<IEmbedParams> => requests.get(`/EmbedReport/${id}`),
}

export default {
    Reports
}