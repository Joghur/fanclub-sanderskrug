import EditIcon from '@mui/icons-material/Edit';
import { Stack, Typography } from '@mui/material';
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
    const auth = getAuth();
    return (
        <>
            <Stack
                alignItems="center"
                style={{
                    borderRadius: '50%',
                    borderWidth: 1,
                    border: '2px solid #73AD21',
                    boxShadow: '5px 10px 9px grey',
                    padding: 30,
                }}
            >
                <Stack direction="row" alignItems="center">
                    <Typography variant="h4">Nächste spiel</Typography>
                    {auth.currentUser && setNextMatch && setShowSpieleDialog && (
                        <EditIcon onClick={() => setShowSpieleDialog(true)} />
                    )}
                </Stack>
                <Typography variant="subtitle1">Werder gegen {nextMatch.opponent}</Typography>
                {nextMatch?.matchDate && (
                    <>
                        <Typography variant="body2">Am {format(new Date(nextMatch.matchDate), 'HH:mm')} uhr</Typography>
                        <Typography variant="body2">{format(new Date(nextMatch.matchDate), 'dd/MMM-yyyy')}</Typography>
                        <Typography variant="body1">{nextMatch.location}</Typography>
                    </>
                )}
            </Stack>{' '}
        </>
    );
}

export default NextGameCard;
