import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getAuth } from 'firebase/auth';

import { useNextMatch } from 'src/utils/hooks';

import AdminPart from './components/CardOrdering/AdminPart';
import CardownerPart from './components/CardOrdering/CartownerPart';
import NextGame from './components/CardOrdering/NextGame';
import InfoCard from './components/InfoCard';
import SkeletonComponent from './components/SkeletonComponent';

const CardOrdering = () => {
    const theme = useTheme();
    const auth = getAuth();
    const [nextMatch, setNextMatch, loading] = useNextMatch();

    const mobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!nextMatch || loading) {
        return <SkeletonComponent />;
    }

    return (
        <Stack alignItems="center" spacing={3} sx={{ py: 5, px: mobile ? 5 : 0, alignItems: 'center' }}>
            {(auth.currentUser || nextMatch.gameId) && <NextGame nextMatch={nextMatch} setNextMatch={setNextMatch} />}
            <InfoCard />
            {nextMatch.gameId && nextMatch.active && (
                <>
                    {!auth.currentUser && <CardownerPart gameId={nextMatch.gameId} />}
                    {auth.currentUser && <AdminPart gameId={nextMatch.gameId} nextMatch={nextMatch} />}
                </>
            )}
            {(!nextMatch.gameId || !nextMatch.active) && (
                <Stack>
                    {auth.currentUser && (
                        <Typography variant="h5">Karteninhaber können keine Zusatzkarten bestellen</Typography>
                    )}
                </Stack>
            )}
        </Stack>
    );
};

export default CardOrdering;
