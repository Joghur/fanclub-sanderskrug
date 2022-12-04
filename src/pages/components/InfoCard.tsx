import EditIcon from '@mui/icons-material/Edit';
import { Button, Dialog, Paper, Stack, TextareaAutosize, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';

import { useStartInfo } from 'src/utils/hooks';

function InfoCard() {
    const auth = getAuth();

    const [showInformationDialog, setShowInformationDialog] = useState(false);
    const [info, submitInformation, changeInformationText] = useStartInfo();

    const handleSubmitInformation = async () => {
        await submitInformation();
        setShowInformationDialog(false);
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
                                onChange={changeInformationText}
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
