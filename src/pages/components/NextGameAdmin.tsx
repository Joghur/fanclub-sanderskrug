import styled from '@emotion/styled';
import { Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAuth } from 'firebase/auth';
import { useSnackbar } from 'notistack';
import React, { Dispatch, SetStateAction } from 'react';

import { editDocument, Result, saveData } from '../api/database';
import { NextMatch } from '../types/Game';

import FormInputSwitch from './inputform/InputSwitch';

const StyledButton = styled(Button)({
    marginBottom: 30,
});

const StyledTextField = styled(TextField)({
    marginRight: 10,
    marginBottom: 10,
});

interface Props {
    nextMatch: NextMatch;
    setNextMatch: Dispatch<SetStateAction<NextMatch>>;
    setShowSpieleDialog: Dispatch<SetStateAction<boolean>>;
}

const NextGameAdmin = ({ nextMatch, setNextMatch, setShowSpieleDialog }: Props) => {
    const snackbar = useSnackbar();
    const auth = getAuth();

    const handleChangeMatch = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { id, value } = event.target;

        if (!value || value.length === 0) {
            return;
        }

        const _value = value as string | number;

        setNextMatch((old: NextMatch) => ({ ...old, [id]: _value }));
    };

    const handleChangeDate = (newValue: Date | null) => {
        if (newValue) {
            setNextMatch((old: NextMatch) => ({ ...old, matchDate: newValue }));
        }
    };

    const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'active' && event.target.checked === false) {
            setNextMatch((old: NextMatch) => ({ ...old, busTour: false, [event.target.name]: event.target.checked }));
            return;
        }
        setNextMatch((old: NextMatch) => ({ ...old, [event.target.name]: event.target.checked }));
    };

    const handleSubmitNextGameInfo = async () => {
        let res: Result;
        if (nextMatch?.id) {
            res = await editDocument('match', nextMatch.id, {
                ...nextMatch,
            });
        } else {
            res = await saveData('match', {
                ...nextMatch,
            });
        }
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
                    <Stack spacing={1}>
                        <Stack>
                            <Typography variant="h6">Gegen</Typography>
                            <StyledTextField id="opponent" value={nextMatch.opponent} onChange={handleChangeMatch} />
                        </Stack>
                        <Stack>
                            <Typography variant="h6">Lokation</Typography>
                            <StyledTextField
                                id="location"
                                value={nextMatch.location}
                                onChange={handleChangeMatch}
                                sx={{ mb: 5 }}
                            />
                        </Stack>
                        <FormInputSwitch
                            name="active"
                            label="Extrakarte möglich"
                            value={nextMatch.active}
                            onChange={handleSwitch}
                        />
                        <FormInputSwitch
                            name="busTour"
                            label="Bus fahren"
                            value={nextMatch.busTour}
                            onChange={handleSwitch}
                        />
                        <Divider />
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
};

export default NextGameAdmin;
