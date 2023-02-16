import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, Grid, Paper, Stack } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { Dispatch, SetStateAction, useState } from 'react';

import { colours } from 'src/utils/colours';

import { NextMatch } from '../../../utils/types/Game';

import NextGameAdmin from './NextGameAdmin';
import NextGameCard from './NextGameCard';

interface Props {
    nextMatch: NextMatch;
    setNextMatch?: Dispatch<SetStateAction<NextMatch>>;
}

const NextGame = ({ nextMatch, setNextMatch }: Props) => {
    const auth = getAuth();

    const [showSpieleDialog, setShowSpieleDialog] = useState(false);

    return (
        <>
            <NextGameCard nextMatch={nextMatch} setNextMatch={setNextMatch} setShowSpieleDialog={setShowSpieleDialog} />
            {auth.currentUser && setNextMatch && (
                <Dialog open={showSpieleDialog}>
                    <Paper sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="flex-end">
                            <CancelIcon
                                fontSize="large"
                                sx={{ color: colours.red }}
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
};

export default NextGame;
