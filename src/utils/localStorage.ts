import { useCallback, useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
    return useStorage(key, defaultValue, window.localStorage);
}

function useStorage<T>(key: string, defaultValue: T, storageObject: Storage) {
    const [value, setValue] = useState(() => {
        const jsonValue = storageObject.getItem(key);
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        }

        if (typeof defaultValue === 'function') {
            return defaultValue();
        } else {
            return defaultValue;
        }
    });

    useEffect(() => {
        if (value === undefined) {
            return storageObject.removeItem(key);
        }
        storageObject.setItem(key, JSON.stringify(value));
    }, [key, value, storageObject]);

    const remove = useCallback(() => {
        setValue(undefined);
    }, []);

    return [value, setValue, remove];
}

export const getLocalStorage = (key: string) => {
    const res = localStorage.getItem(key);

    try {
        if (res) {
            return JSON.parse(res);
        }
    } catch (error) {
        console.log('getStorage error: ', error);
    }
    return null;
};

export const setLocalStorage = (key: string, obj) => {
    if (key) {
        localStorage.setItem(key, JSON.stringify(obj));
        return obj;
    }
    return null;
};
