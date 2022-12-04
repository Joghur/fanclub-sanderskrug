/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';

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

export const useAxios = <T>(url: string) => {
    const [value, setValue] = useState<T | undefined>();
    const [loading, setLoading] = useState<boolean | undefined>(true);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        if (url) {
            fetchState(url);
        }
    }, [url]);

    const fetchState = async <T>(url: string) => {
        let res: AxiosResponse<any, any>;
        try {
            res = await apiFetch(url);
            setValue(res.data);
        } catch (err) {
            console.log('error', err);
            if (axios.isAxiosError(err)) {
                const serverError = err as AxiosError<Error>;
                if (serverError && serverError.response) {
                    setError(serverError.response.data.message);
                }
            }
        }
        setLoading(false);
    };

    return [value, loading, error] as const;
};
