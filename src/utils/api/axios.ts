import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

/** Deprecated */
export const useAxios = <T>(url: string) => {
    const [value, setValue] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState<boolean | undefined>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (url) {
            fetchAxios(url);
        }
    }, [url]);

    const fetchAxios = async (url: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let res: any;
        try {
            res = await (await fetch(url)).json();
            if (res) {
                setValue(() => res as T);
            }
        } catch (err) {
            // console.log('error', err);
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
