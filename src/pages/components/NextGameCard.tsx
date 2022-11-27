import EditIcon from '@mui/icons-material/Edit';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { getAuth } from 'firebase/auth';
import { Dispatch, SetStateAction } from 'react';

import { NextMatch } from '../types/Game';

interface Props {
    nextMatch: NextMatch;
    setNextMatch?: Dispatch<SetStateAction<NextMatch>>;
    setShowSpieleDialog?: Dispatch<SetStateAction<boolean>>;
}

function NextGameCard({ nextMatch, setNextMatch, setShowSpieleDialog }: Props) {
    const theme = useTheme();
    const auth = getAuth();

    const mobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Stack
            alignItems="center"
            style={{
                borderRadius: '50%',
                border: '2px solid #73AD21',
                boxShadow: '5px 10px 9px grey',
                padding: 30,
                width: mobile ? '100%' : '65%',
            }}
        >
            <Stack direction="row" alignItems="center">
                {nextMatch.active && (
                    <Typography variant={mobile ? 'h6' : 'h4'} color="green" paragraph>
                        Extrakarte für
                    </Typography>
                )}
                {!nextMatch.active && (
                    <Typography variant={mobile ? 'h6' : 'h4'} color="red" paragraph>
                        Keine extrakarte
                    </Typography>
                )}
                {auth.currentUser && setNextMatch && setShowSpieleDialog && (
                    <EditIcon onClick={() => setShowSpieleDialog(true)} />
                )}
            </Stack>
            {nextMatch.opponent && nextMatch.matchDate && nextMatch.location && (
                <>
                    <Typography variant="h5">
                        <Box component="span" fontWeight="fontWeightBold">
                            {`Werder `}
                        </Box>
                        gegen
                        <Box component="span" fontWeight="fontWeightBold">
                            {` ${nextMatch.opponent}`}
                        </Box>
                    </Typography>
                    <Typography variant="body2">{format(new Date(nextMatch.matchDate), 'dd/MMM-yyyy')}</Typography>
                    <Typography variant="body2">am {format(new Date(nextMatch.matchDate), 'HH:mm')} uhr</Typography>
                    <Typography variant="body1" paragraph>
                        {nextMatch.location}
                    </Typography>
                </>
            )}
            {!nextMatch.matchDate && <Typography variant="body2">Kein spiel dato</Typography>}
            {nextMatch.busTour && (
                <Typography variant={mobile ? 'h6' : 'h4'} color="green">
                    Wir fahren
                </Typography>
            )}
            {!nextMatch.busTour && nextMatch.opponent && (
                <Typography variant={mobile ? 'h6' : 'h4'} color="red">
                    Wir fahren nicht
                </Typography>
            )}
        </Stack>
    );
}

export default NextGameCard;
