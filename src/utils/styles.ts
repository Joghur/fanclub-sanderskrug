import { Button, TextField } from '@mui/material';
import { styled } from '@mui/system';

export const StyledButton = styled(Button)({
    marginBottom: 30,
});

export const StyledTextField = styled(TextField)({
    marginRight: 10,
    marginBottom: 10,
});

export const gamesStyle = {
    imgStyle: {
        height: '55px',
        padding: '5px',
    },
    imgDiv: {
        display: 'flex',
        justifyContent: 'center',
    },
    nameDiv: {
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
    },
};
