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
