import axios, { AxiosResponse } from 'axios';

export const apiFetch = (url: string): Promise<AxiosResponse<any, any>> => {
    return axios.get(url);
};

export const fetchState = async <T>(url: string, setState: React.Dispatch<React.SetStateAction<T>>) => {
    let res: AxiosResponse<any, any>;
    try {
        res = await apiFetch(url);
        setState(res.data as T);
    } catch (error) {
        console.log('error', error);
    }
};
