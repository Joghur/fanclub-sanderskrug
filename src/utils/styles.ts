import { Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';

import { colours } from './colours';

export const StyledButton = styled(Button)({
    marginBottom: 30,
});

export const StyledTextField = styled(TextField)({
    marginRight: 10,
    marginBottom: 10,
});

export const getStyledText = (color: string, size?: number | string) => {
    return styled(Typography)({
        fontFamily: 'sans-serif',
        fontSize: size || '',
        color: color || colours.black,
    });
};

export const gamesStyle = {
    imgStyle: {
        height: '55px',
        padding: '5px',
    },
    thumpStyle: {
        height: '25px',
        padding: '2px',
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
