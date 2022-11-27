import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, Paper, Stack } from '@mui/material';
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

    return (
        <>
            <Stack alignItems="center" justifyContent="center">
                <NextGameCard
                    nextMatch={nextMatch}
                    setNextMatch={setNextMatch}
                    setShowSpieleDialog={setShowSpieleDialog}
                />
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
