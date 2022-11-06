import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Dialog, Paper, Stack, TextareaAutosize, TextField, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

import { editDocument, queryDocuments } from '../api/database';

const StyledButton = styled(Button)({
    marginBottom: 30,
});

const StyledTextField = styled(TextField)({
    marginRight: 10,
});

function InfoCard() {
    const snackbar = useSnackbar();
    const auth = getAuth();

    const [showInformationDialog, setShowInformationDialog] = useState(false);
    const [info, setInfo] = useState('');

    const fetchingStartInfo = async () => {
        const info = await queryDocuments('info', 'infoText', '!=', '');

        if (info.success.length === 1) {
            setInfo(info.success[0].infoText);
        }
    };

    useEffect(() => {
        fetchingStartInfo();
    }, []);

    const handleSubmitInformation = async () => {
        const res = await editDocument('info', 'info', {
            infoText: info,
        });
        setShowInformationDialog(false);

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

    const handleChangeInformationText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInfo(event.target.value);
    };

    return (
        <>
            {info && (
                <Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h5">Information</Typography>
                        {auth.currentUser && <EditIcon onClick={() => setShowInformationDialog(true)} />}
                    </Stack>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="body1">{info}</Typography>
                    </Paper>
                </Stack>
            )}
            {auth.currentUser && (
                <Dialog open={showInformationDialog}>
                    <Paper sx={{ p: 5 }}>
                        <Stack spacing={2}>
                            <TextareaAutosize
                                aria-label="empty textarea"
                                minRows={2}
                                value={info}
                                onChange={handleChangeInformationText}
                            />
                            <Button variant="contained" onClick={handleSubmitInformation}>
                                Info ändern
                            </Button>
                        </Stack>
                    </Paper>
                </Dialog>
            )}
        </>
    );
}

export default InfoCard;
