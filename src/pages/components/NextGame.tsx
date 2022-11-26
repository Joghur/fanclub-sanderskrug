/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, Paper, Stack, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { Dispatch, SetStateAction, useState } from 'react';

import { NextMatch } from '../types/Game';

import NextGameAdmin from './NextGameAdmin';
import NextGameCard from './NextGameCard';

interface Props {
    nextMatch: NextMatch;
    setNextMatch?: Dispatch<SetStateAction<NextMatch>>;
}

function NextGame({ nextMatch, setNextMatch }: Props) {
    const auth = getAuth();

    const [showSpieleDialog, setShowSpieleDialog] = useState(false);

    const doBusTour = nextMatch && nextMatch.busTour;

    return (
        <>
            <Stack>
                {nextMatch.active && (
                    <NextGameCard
                        nextMatch={nextMatch}
                        setNextMatch={setNextMatch}
                        setShowSpieleDialog={setShowSpieleDialog}
                    />
                )}
                {!nextMatch.active && (
                    <Typography variant="body2" gutterBottom>
                        Kein spiel
                    </Typography>
                )}

                {nextMatch.active && (
                    <Typography
                        variant="h5"
                        sx={{
                            color: doBusTour ? 'green' : 'red',
                            my: 2,
                            border: 1,
                            padding: 3,
                            boxShadow: 3,
                        }}
                    >{`Wir fahren ${doBusTour ? '' : 'nicht'}`}</Typography>
                )}
            </Stack>
            {auth.currentUser && setNextMatch && (
                <Dialog open={showSpieleDialog}>
                    <Paper sx={{ p: 5 }}>
                        <Stack direction="row" justifyContent="flex-end">
                            <CancelIcon
                                fontSize="large"
                                sx={{ color: 'red' }}
                                onClick={() => setShowSpieleDialog(false)}
                            />
                        </Stack>
                        <NextGameAdmin
                            nextMatch={nextMatch}
                            setNextMatch={setNextMatch}
                            setShowSpieleDialog={setShowSpieleDialog}
                        />
                    </Paper>
                </Dialog>
            )}
        </>
    );
}

export default NextGame;
