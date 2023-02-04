import EditIcon from '@mui/icons-material/Edit';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { getAuth } from 'firebase/auth';

import { colours } from 'src/utils/colours';

import { NextMatch } from '../../../utils/types/Game';

interface Props {
    nextMatch: NextMatch;
    setNextMatch?: (arg: NextMatch) => void;
    setShowSpieleDialog?: (arg: boolean) => void;
}

const NextGameCard = ({ nextMatch, setNextMatch, setShowSpieleDialog }: Props) => {
    const theme = useTheme();
    const auth = getAuth();

    const mobile = useMediaQuery(theme.breakpoints.down('md'));
    const smMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Stack
            alignItems="center"
            style={{
                borderRadius: '50%',
                border: '2px solid',
                borderColor:
                    nextMatch.opponent && nextMatch.busTour && nextMatch.active ? colours.werderGreen : colours.red,
                boxShadow: `5px 10px 9px ${colours.grey}`,
            }}
            sx={{
                py: 2,
                px: mobile ? (smMobile ? 5 : 7) : 10,
            }}
        >
            {auth.currentUser && setNextMatch && setShowSpieleDialog && (
                <EditIcon onClick={() => setShowSpieleDialog(true)} />
            )}
            {nextMatch.opponent && nextMatch.matchDate && nextMatch.location && (
                <>
                    <Typography variant={mobile ? 'h6' : 'h4'}>
                        {format(new Date(nextMatch.matchDate), 'dd/MMM-yyyy')}
                    </Typography>
                    <Typography variant={mobile ? 'body1' : 'h5'}>
                        am {format(new Date(nextMatch.matchDate), 'HH:mm')} uhr
                    </Typography>
                    <Typography variant="body2" paragraph>
                        {nextMatch.location}
                    </Typography>
                    <Typography variant={mobile ? (smMobile ? 'body2' : 'body1') : 'h4'} noWrap paragraph>
                        <Box component="span" fontWeight="fontWeightBold">
                            {`Werder `}
                        </Box>
                        gegen
                        <Box component="span" fontWeight="fontWeightBold">
                            {` ${nextMatch.opponent}`}
                        </Box>
                    </Typography>
                </>
            )}
            {!nextMatch.matchDate && <Typography variant="body2">Kein spiel dato</Typography>}
            {nextMatch.opponent && nextMatch.active && nextMatch.matchDate && (
                <Typography variant={mobile ? 'body1' : 'h5'} color={colours.werderGreen}>
                    Extrakarte möglich
                </Typography>
            )}
            {nextMatch.opponent && !nextMatch.active && nextMatch.matchDate && (
                <Typography variant={mobile ? 'body1' : 'h5'} color={colours.red}>
                    Extrakarte nicht möglich
                </Typography>
            )}
            {nextMatch.opponent && nextMatch.busTour && nextMatch.matchDate && (
                <Typography variant={mobile ? 'body1' : 'h5'} color={colours.werderGreen}>
                    Bus fährt
                </Typography>
            )}
            {nextMatch.opponent && !nextMatch.busTour && nextMatch.matchDate && (
                <Typography variant={mobile ? 'body1' : 'h5'} color={colours.red}>
                    Kein bus fahrt
                </Typography>
            )}
        </Stack>
    );
};

export default NextGameCard;
