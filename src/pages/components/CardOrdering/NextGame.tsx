import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Dialog, Paper, Stack, useMediaQuery, useTheme } from '@mui/material';
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
    const theme = useTheme();

    const [showSpieleDialog, setShowSpieleDialog] = useState(false);
    const smalldesktop = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Box sx={{ width: smalldesktop ? '95%' : '50%', justifyItems: 'center' }}>
                <NextGameCard
                    nextMatch={nextMatch}
                    setNextMatch={setNextMatch}
                    setShowSpieleDialog={setShowSpieleDialog}
                />
            </Box>
            {auth.currentUser && setNextMatch && (
                <Dialog open={showSpieleDialog}>
                    <Paper sx={{ p: 5 }}>
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
