import { Skeleton, Stack, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';

import { useNextMatch } from 'src/utils/hooks';

import AdminPart from './components/CardOrdering/AdminPart';
import CardownerPart from './components/CardOrdering/CartownerPart';
import NextGame from './components/CardOrdering/NextGame';
import InfoCard from './components/InfoCard';

const CardOrdering = () => {
    const auth = getAuth();
    const [nextMatch, setNextMatch, loading] = useNextMatch();

    if (!nextMatch || loading) {
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
