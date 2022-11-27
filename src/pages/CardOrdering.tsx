import { Skeleton, Stack, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';

import { fetchDocument } from './api/database';
import AdminPart from './components/CardOrderingPages/AdminPart';
import CardownerPart from './components/CardOrderingPages/CartownerPart';
import NextGame from './components/CardOrderingPages/NextGame';
import InfoCard from './components/InfoCard';
import { NextMatch } from './types/Game';

export const initNextMatch: NextMatch = {
    gameId: '',
    matchDate: new Date(),
    location: '',
    matchDay: 0,
    matchType: 'other',
    opponent: '',
    nextMatch: false,
    active: false,
    busTour: false,
};

const CardOrdering = () => {
    const auth = getAuth();
    const [nextMatch, setNextMatch] = useState<NextMatch>(initNextMatch);

    const fetchingStartInfo = async () => {
        const nextMatch = await fetchDocument('info', 'nextMatch');

        if (nextMatch.success) {
            const _nextMatch = nextMatch.success;
            _nextMatch.matchDate = new Date(_nextMatch.matchDate.seconds * 1000);
            setNextMatch(_nextMatch);
            return;
        }
        console.log('Error in NextMatch: ', nextMatch.error);
    };

    useEffect(() => {
        fetchingStartInfo();
    }, []);

    if (!nextMatch) {
        return <Skeleton variant="text" />;
    }

    return (
        <Stack spacing={3} sx={{ p: 5 }}>
            {((nextMatch.gameId && nextMatch.active) || auth.currentUser) && (
                <NextGame nextMatch={nextMatch} setNextMatch={setNextMatch} />
            )}
            <InfoCard />
            {nextMatch.gameId && nextMatch.active && (
                <>
                    {!auth.currentUser && <CardownerPart gameId={nextMatch.gameId} />}
                    {auth.currentUser && <AdminPart gameId={nextMatch.gameId} nextMatch={nextMatch} />}
                </>
            )}
            {(!nextMatch.gameId || !nextMatch.active) && (
                <Stack alignItems="center">
                    {auth.currentUser && (
                        <Typography variant="h5">Das nächste Spiel wurde noch nicht fortgesetzt</Typography>
                    )}
                    {!auth.currentUser && (
                        <Typography variant="h5">Es ist noch nicht möglich, zusätzliche Karten zu bestellen</Typography>
                    )}
                </Stack>
            )}
        </Stack>
    );
};

export default CardOrdering;
