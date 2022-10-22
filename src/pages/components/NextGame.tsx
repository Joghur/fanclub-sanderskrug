/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import styled from '@emotion/styled';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Dialog, Divider, Paper, Stack, TextareaAutosize, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { getAuth } from 'firebase/auth';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

import { editDocument, queryDocuments } from '../api/database';
import { NextMatch } from '../types/Game';

import NextGameAdmin from './NextGameAdmin';

const StyledButton = styled(Button)({
    marginBottom: 30,
});

const StyledTextField = styled(TextField)({
    marginRight: 10,
});

interface Props {
    nextMatch: NextMatch;
    setNextMatch: (NextMatch) => void;
}

function NextGame({ nextMatch, setNextMatch }: Props) {
    const snackbar = useSnackbar();
    const auth = getAuth();

    const [showSpieleDialog, setShowSpieleDialog] = useState(false);
    const [spieleInfo, setSpieleInfo] = useState('');

    const fetchingStartInfo = async () => {
        const spieleInfo = await queryDocuments('info', 'cardInfoText', '!=', '');

        if (spieleInfo.success.length === 1) {
            setSpieleInfo(spieleInfo.success[0].cardInfoText);
        }
    };

    useEffect(() => {
        fetchingStartInfo();
    }, []);

    const handleChangeSpieleInformationText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSpieleInfo(event.target.value);
    };

    const handleSubmitSpieleInfo = async () => {
        const res = await editDocument('info', 'cardInfo', {
            cardInfoText: spieleInfo,
        });
        setShowSpieleDialog(false);

        if (res.error) {
            snackbar.enqueueSnackbar('Änderungen werden nicht gespeichert', {
                variant: 'error',
            });
        } else {
            snackbar.enqueueSnackbar('Änderungen gespeichert', {
                variant: 'success',
            });
        }
    };

    const doBusTour = nextMatch && !nextMatch.busTour;
    const matchDate = format(nextMatch?.matchDate, 'dd/MM-yyyy HH:mm');

    return (
        <>
            {spieleInfo && (
                <Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h5">Nächste spiel</Typography>
                        {auth.currentUser && <EditIcon onClick={() => setShowSpieleDialog(true)} />}
                    </Stack>
                    <Paper sx={{ p: 2 }}>
                        <Typography>{spieleInfo}</Typography>
                    </Paper>
                    <Paper sx={{ p: 2 }}>
                        <Typography gutterBottom>
                            {nextMatch?.matchType === 'league' ? 'Bundesliga spiel' : 'Pokal spiel'}
                        </Typography>
                        <Typography variant="subtitle1">Am</Typography>
                        <Typography variant="body2" gutterBottom>
                            {matchDate && matchDate}
                        </Typography>
                        <Typography variant="subtitle1">Lokation</Typography>
                        <Typography variant="body2">{nextMatch?.location && nextMatch.location}</Typography>
                    </Paper>

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
            )}
            {auth.currentUser && (
                <Dialog open={showSpieleDialog}>
                    <Paper sx={{ p: 5 }}>
                        <Stack spacing={2}>
                            <Stack direction="row" justifyContent="flex-end">
                                <CancelIcon
                                    fontSize="large"
                                    sx={{ color: 'red' }}
                                    onClick={() => setShowSpieleDialog(false)}
                                />
                            </Stack>
                            <StyledTextField
                                label="Kartenvorbestellung info text"
                                minRows={2}
                                multiline
                                style={{ width: '75%' }}
                                value={spieleInfo}
                                onChange={handleChangeSpieleInformationText}
                            />
                            <StyledButton variant="contained" onClick={handleSubmitSpieleInfo}>
                                Info Text ändern
                            </StyledButton>
                            <Divider />
                            <NextGameAdmin
                                nextMatch={nextMatch}
                                setNextMatch={setNextMatch}
                                setShowSpieleDialog={setShowSpieleDialog}
                            />
                        </Stack>
                    </Paper>
                </Dialog>
            )}
        </>
    );
}

export default NextGame;
