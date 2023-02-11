import { Divider, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getAuth } from 'firebase/auth';

import { useExtraCardsOrder, useNextMatch } from 'src/utils/hooks';

import CardTable from './components/admin/CardTable';

const Admin = () => {
    const theme = useTheme();
    const auth = getAuth();
    const [nextMatch, setNextMatch, loading] = useNextMatch();

    const [cards] = useExtraCardsOrder(nextMatch.gameId);

    const mobile = useMediaQuery(theme.breakpoints.down('sm'));
    console.log('nextMatch', nextMatch);
    console.log('cards', cards);
    return (
        <Stack alignItems="center" spacing={3} sx={{ py: 5, px: mobile ? 5 : 0, alignItems: 'center' }}>
            {auth.currentUser && (
                <>
                    <Typography variant="h5">Bestellungen für die nächste spiel</Typography>
                    {(!nextMatch.gameId || !nextMatch.active) && (
                        <Stack>
                            {auth.currentUser && (
                                <Typography variant="h6">Karteninhaber können keine Zusatzkarten bestellen</Typography>
                            )}
                        </Stack>
                    )}
                    {nextMatch.active && (
                        <>
                            {cards.length > 0 && <CardTable cards={cards} nextMatch={nextMatch} />}
                            {cards.length === 0 && <Typography variant="h5">Keine bestellungen</Typography>}
                        </>
                    )}
                    {nextMatch.active && (
                        <>
                            <Divider variant="middle" />
                            {cards.length > 0 && <CardTable cards={cards} nextMatch={nextMatch} />}
                            {cards.length === 0 && <Typography variant="h5">Keine bestellungen</Typography>}
                        </>
                    )}
                </>
            )}
        </Stack>
    );
};

export default Admin;
