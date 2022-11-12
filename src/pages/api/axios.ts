import axios, { AxiosResponse } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiFetch = (url: string): Promise<AxiosResponse<any, any>> => {
    return axios.get(url);
};

export const fetchState = async <T>(url: string, setState: React.Dispatch<React.SetStateAction<T>>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let res: AxiosResponse<any, any>;
    try {
        res = await apiFetch(url);
        setState(res.data as T);
    } catch (error) {
        console.log('error', error);
    }
};
