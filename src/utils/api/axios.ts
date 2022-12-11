/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

// export const apiFetch = <T>(url: string): Promise<AxiosResponse<any, any>> => {
//     return axios.get<T | undefined>(url);
// };

// export const fetchState = async <T>(url: string, setState: (T) => void) => {
//     let res: AxiosResponse<any, any>;
//     try {
//         res = await apiFetch<T>(url);
//         setState(res.data);
//     } catch (error) {
//         console.log('error', error);
//     }
// };

export const useAxios = <T>(url: string) => {
    const [value, setValue] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState<boolean | undefined>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (url) {
            fetchAxios(url);
        }
    }, [url]);

    const fetchAxios = async <T>(url: string) => {
        let res: AxiosResponse<any, any>;
        try {
            res = await axios.get<T | undefined>(url);
            if (res.data) {
                setValue(() => res.data);
            }
        } catch (err) {
            console.log('error', err);
            if (axios.isAxiosError(err)) {
                const serverError = err as AxiosError<Error>;
                if (serverError && serverError.response) {
                    setError(serverError.response.data.message);
                }
            }
        }
        setLoading(() => false);
    };

    return [value, loading, error] as const;
};
