import { ResponseType } from '../types/response';

export const validation = (type: string, value: any): ResponseType => {
    const response = { success: true, error: null };

    if (type === 'number') {
        if (value === 0 || value > 5) {
            return { success: null, error: 'Only 1 to 5 cards can be ordered' };
        }
        if (typeof value !== 'number') {
            return { success: null, error: 'Only 1 to 5 cards can be ordered' };
        }
    }

    if (type === 'string') {
        if (value.length === 0 || value === '') {
            return { success: null, error: 'You need to write text' };
        }
    }

    return response;
};

export const validateObj = (object: any) => {
    const response = { success: true, error: null };
    for (const key in object) {
        if (key === 'amount' || key === 'regularCardNumber') {
            const res = validation('number', object[key]);
            if (res.error) {
                return res;
            }
        }
        if (key === 'name') {
            const res = validation('string', object[key]);
            if (res.error) {
                return res;
            }
        }
    }
    return response;
};
