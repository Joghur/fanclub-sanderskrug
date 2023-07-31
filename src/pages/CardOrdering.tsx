import { getAuth } from 'firebase/auth';
import { useNextMatch } from 'src/utils/hooks';

import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

import AdminPart from './components/CardOrdering/AdminPart';
import CardownerPart from './components/CardOrdering/CartownerPart';
import InfoCard from './components/CardOrdering/InfoCard';
import NextGameCard from './components/CardOrdering/NextGameCard';
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
        <Stack alignItems={mobile ? 'inherit' : 'center'} spacing={3} sx={{ py: 5, px: mobile ? 1 : 0 }}>
            {(auth.currentUser || nextMatch.gameId) && (
                <NextGameCard nextMatch={nextMatch} setNextMatch={setNextMatch} />
            )}
            <InfoCard />
            {nextMatch.gameId && nextMatch.active && (
                <>
                    {!auth.currentUser && <CardownerPart gameId={nextMatch.gameId} />}
                    {auth.currentUser && <AdminPart gameId={nextMatch.gameId} nextMatch={nextMatch} />}
                </>
            )}
            {/* {(!nextMatch.gameId || !nextMatch.active) && (
                <Stack>
                    {auth.currentUser && (
                        <Typography variant="h5">Karteninhaber können keine Zusatzkarten bestellen</Typography>
                    )}
                </Stack>
            )} */}
        </Stack>
    );
};

export default CardOrdering;
