import { Stack, Typography } from '@mui/material';
import { format } from 'date-fns';

import { NextMatch } from '../types/Game';

interface Props {
    nextMatch: NextMatch;
}

function NextGameCard({ nextMatch }: Props) {
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
