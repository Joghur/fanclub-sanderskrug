import { Alert, Button, Dialog, Paper, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { getAuth } from 'firebase/auth';
import { useSnackbar } from 'notistack';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { storageKeyPrefix } from 'src/config/settings';
import { editDocument, Result } from 'src/utils/api/database';
import { initNextMatch } from 'src/utils/hooks';
import { setLocalStorage } from 'src/utils/localStorage';

import { StyledButton, StyledTextField } from '../../../utils/styles';
import { GameType, NextMatch } from '../../../utils/types/Game';
import FormInputSelect from '../inputform/FormInputSelect';
import FormInputSwitch from '../inputform/FormInputSwitch';

interface Props {
    nextMatch: NextMatch;
    setNextMatch: Dispatch<SetStateAction<NextMatch>>;
    setShowSpieleDialog: Dispatch<SetStateAction<boolean>>;
}

export const storageKeyNextMatch = `${storageKeyPrefix}next_match`;

const NextGameAdmin = ({ nextMatch, setNextMatch, setShowSpieleDialog }: Props) => {
    const snackbar = useSnackbar();
    const auth = getAuth();
    const [showNewGameNag, setShowChangeNag] = useState(false);
    const [showValidateNag, setShowValidateNag] = useState(false);

    const handleChangeMatch = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { id, value } = event.target;
        const _value = value as string | number;

        setNextMatch((old: NextMatch) => ({
            ...old,
            [id]: _value,
        }));
    };

    const handleChangeDate = (newValue: Date | null) => {
        if (newValue) {
            setNextMatch((old: NextMatch) => ({
                ...old,
                matchDate: newValue,
                gameId: `${format(newValue, 'yyyyMMdd')}`,
            }));
        }
    };

    const handleSelect = (event: SelectChangeEvent<HTMLInputElement>) => {
        setNextMatch((old: NextMatch) => ({ ...old, matchType: event.target.value as GameType }));
    };

    const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'active' && event.target.checked === false) {
            setNextMatch((old: NextMatch) => ({ ...old, busTour: false, [event.target.name]: event.target.checked }));
            return;
        }
        setNextMatch((old: NextMatch) => ({ ...old, [event.target.name]: event.target.checked }));
    };

    const handleNewMatch = () => {
        setNextMatch(() => ({ ...initNextMatch }));
        setShowChangeNag(false);
    };

    const handleValidateSubmit = async () => {
        const ignoreKeys = ['matchDay', 'nextMatch', 'busTour'];
        const ignoreValues = { active: 'notActive', gameId: 'Neues dato', location: 'Lokation', opponent: 'Gegner' };
        const notValidated = Object.keys(nextMatch)
            .filter(n => !ignoreKeys.includes(n) && !nextMatch[n])
            .map(e => ignoreValues[e])
            .filter(Boolean);
        if (notValidated.length > 0 && !notValidated.includes('notActive')) {
            snackbar.enqueueSnackbar(`Fehlen: ${notValidated.join(', ')} `, {
                variant: 'error',
            });
            return;
        }
        await handleSubmitNextGameInfo();
    };

    const handleSubmitNextGameInfo = async () => {
        const res: Result<string> = await editDocument('info', 'nextMatch', {
            ...nextMatch,
        });
        if (res.error) {
            snackbar.enqueueSnackbar('Änderungen werden nicht gespeichert', {
                variant: 'error',
            });
        } else {
            setLocalStorage(storageKeyNextMatch, {
                nextMatch: nextMatch,
            });
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
                    <Stack spacing={2}>
                        <Stack>
                            <Typography variant="h3">Nächste spiel</Typography>
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
                        <FormInputSelect
                            value={nextMatch.matchType}
                            label="Spiel type"
                            onChange={handleSelect}
                            menuItems={[
                                { menuItemvalue: 'league', menuItemLabel: 'Bundesliga' },
                                { menuItemvalue: 'cup', menuItemLabel: 'Pokal' },
                                { menuItemvalue: 'other', menuItemLabel: 'Andere' },
                            ]}
                        />
                        <FormInputSwitch
                            name="active"
                            label="Extrakarte möglich"
                            value={nextMatch.active}
                            onChange={handleSwitch}
                            disabled={false}
                        />
                        <FormInputSwitch
                            name="busTour"
                            label="Bus fahren"
                            value={nextMatch.busTour}
                            onChange={handleSwitch}
                            disabled={!nextMatch.location || !nextMatch.opponent || !nextMatch.gameId}
                        />
                        <DateTimePicker
                            label="Spielzeit"
                            inputFormat={isMidnight ? 'dd/MM-yyyy' : 'dd/MM-yyyy HH:mm'}
                            value={nextMatch.matchDate}
                            ampm={false}
                            ampmInClock={false}
                            onChange={handleChangeDate}
                            renderInput={params => <TextField {...params} />}
                        />
                        <Alert color="error">
                            Ändern Sie das Datum nur, wenn niemand eine Karte bestellt hat, z.B. direkt nach einem Spiel
                        </Alert>
                        <StyledButton variant="contained" onClick={handleValidateSubmit}>
                            Speichern
                        </StyledButton>
                        <StyledButton
                            variant="outlined"
                            color="error"
                            onClick={() => setShowChangeNag(!showNewGameNag)}
                        >
                            Nächstes Spiel machen
                        </StyledButton>
                    </Stack>
                    <Dialog open={showValidateNag}>
                        <Paper sx={{ p: 5 }}>
                            <Typography paragraph>nicht alles ist ausgefüllt</Typography>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setShowValidateNag(!showValidateNag)}
                                >
                                    Zurück
                                </Button>
                            </Stack>
                        </Paper>
                    </Dialog>
                    <Dialog open={showNewGameNag}>
                        <Paper sx={{ p: 5 }}>
                            <Typography paragraph>Neu spiele- Bist du sicher!</Typography>
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" color="primary" onClick={handleNewMatch}>
                                    Ja
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setShowChangeNag(!showNewGameNag)}
                                >
                                    Nein
                                </Button>
                            </Stack>
                        </Paper>
                    </Dialog>
                </LocalizationProvider>
            )}
        </>
    );
};

export default NextGameAdmin;
