import styled from '@emotion/styled';
import { Button, FormControlLabel, FormGroup, Stack, Switch, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAuth } from 'firebase/auth';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import { editDocument, queryDocuments, saveData } from '../api/database';
import { NextMatch } from '../types/Game';

const StyledButton = styled(Button)({
    marginBottom: 30,
});

const StyledTextField = styled(TextField)({
    marginRight: 10,
    marginBottom: 10,
});

interface Props {
    nextMatch: NextMatch;
    setNextMatch: (NextMatch) => void;
    setShowSpieleDialog: (boolean) => void;
}

function NextGameAdmin({ nextMatch, setNextMatch, setShowSpieleDialog }: Props) {
    const snackbar = useSnackbar();
    const auth = getAuth();

    const [extraCardPossible, setExtraCardPossible] = useState<boolean>(nextMatch.active);
    const [busTour, setBusTour] = useState<boolean>(nextMatch.busTour);

    // TODO handle submit with switches

    const handleChangeMatch = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { id, value } = event.target;

        if (!value || value.length === 0) {
            return;
        }

        const _value = value as string | number;

        setNextMatch(old => ({ ...old, [id]: _value }));
    };

    const handleChangeDate = (newValue: Date | null) => {
        setNextMatch(old => ({ ...old, matchDate: newValue }));
    };

    const handleSubmitNextGameInfo = async () => {
        let res;
        if (nextMatch?.id) {
            res = await editDocument('match', nextMatch.id, {
                ...nextMatch,
            });
        } else {
            res = await saveData('match', {
                ...nextMatch,
            });
        }
        console.log('res', res);
        if (res.error) {
            snackbar.enqueueSnackbar('Änderungen werden nicht gespeichert', {
                variant: 'error',
            });
        } else {
            snackbar.enqueueSnackbar('Spiele Info is geändert', {
                variant: 'success',
            });
        }
        setShowSpieleDialog(false);
    };

    const isMidnight =
        new Date(nextMatch.matchDate).getHours() === 0 && new Date(nextMatch.matchDate).getMinutes() === 0;

    return (
        <>
            {auth.currentUser && (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack>
                        <Typography variant="h6">Gegen</Typography>
                        <StyledTextField id="opponent" value={nextMatch.opponent} onChange={handleChangeMatch} />
                        <Typography variant="h6">Lokation</Typography>
                        <StyledTextField
                            id="location"
                            value={nextMatch.location}
                            onChange={handleChangeMatch}
                            sx={{ mb: 5 }}
                        />
                        <FormGroup sx={{ mb: 3 }}>
                            <FormControlLabel
                                value={extraCardPossible}
                                control={<Switch />}
                                label="Extrakarte möglich"
                                onChange={old => setExtraCardPossible(!old)}
                            />
                            <FormControlLabel
                                value={busTour}
                                control={<Switch />}
                                label="Bus fahren"
                                onChange={old => setBusTour(!old)}
                            />
                        </FormGroup>
                        <DateTimePicker
                            label="Spielzeit"
                            inputFormat={isMidnight ? 'dd/MM-yyyy' : 'dd/MM-yyyy HH:mm'}
                            value={nextMatch.matchDate}
                            ampm={false}
                            ampmInClock={false}
                            onChange={handleChangeDate}
                            renderInput={params => <TextField {...params} />}
                        />
                    </Stack>
                    <Stack spacing={2}>
                        <StyledButton variant="contained" onClick={handleSubmitNextGameInfo}>
                            Informationen zum nächsten Spiel ändern
                        </StyledButton>
                    </Stack>
                </LocalizationProvider>
            )}
        </>
    );
}

export default NextGameAdmin;
