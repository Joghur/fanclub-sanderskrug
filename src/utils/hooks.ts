import { useEffect, useState } from 'react';

import { initNextMatch } from 'src/pages/CardOrdering';

import { fetchDocument } from './api/database';

export const useStartInfo = second => {
    const [value, setValue] = useState<string>(initNextMatch);

    const fetchingStartInfo = async () => {
        const nextMatch = await fetchDocument('info', 'nextMatch');

        if (nextMatch.success) {
            const _nextMatch = nextMatch.success;
            _nextMatch.matchDate = new Date(_nextMatch.matchDate.seconds * 1000);
            setValue(_nextMatch);
            return;
        }
        console.log('Error in NextMatch: ', nextMatch.error);
    };

    useEffect(() => {
        fetchingStartInfo();
    }, []);
};
