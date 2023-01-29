import { Stack, SelectChangeEvent, Box, useTheme, useMediaQuery, Dialog, Typography, Button } from '@mui/material';
import { useState } from 'react';

import { getMatchDataUrl } from 'src/utils/api/urls';
import { useBlMatchday, useleague } from 'src/utils/hooks';

import { thisSeason } from '../utils/utilities';

import Games from './components/League/Games';
import Standings from './components/League/Standings';
import SkeletonComponent from './components/SkeletonComponent';

const League = () => {
    const theme = useTheme();
    const [year, setYear] = useState<string>(thisSeason);
    const [showMatchdayResultsDialog, setShowMatchdayResultsDialog] = useState(false);
    const [selectedMatchDay, setSelectedMatchDay] = useState(1);
    const [amountOfTeams, setAmountOfTeams] = useState(0);

    const [league, setLeague] = useleague(year);
    const [blMatchDay] = useBlMatchday(league);

    const largeDesktopDown = useMediaQuery(theme.breakpoints.down('lg'));
    const smallDesktopDown = useMediaQuery(theme.breakpoints.down('sm'));
    const amountOfMatchDays = (amountOfTeams - 1) * 2;

    const handleChangeYear = (event: SelectChangeEvent) => {
        setYear(event.target.value);
    };

    const handleChangeLeague = (event: SelectChangeEvent) => {
        setLeague(event.target.value);
    };

    const handleChangeMatchDay = (index: number) => {
        setSelectedMatchDay(index);
        setShowMatchdayResultsDialog(true);
    };

    const playedDays = Array.from({ length: blMatchDay - 1 }, (_, i) => i + 1).reverse();
    const futurePlayDays = Array.from({ length: amountOfMatchDays - blMatchDay }, (_, i) => i + blMatchDay + 1);
    const largestArray = playedDays.length > futurePlayDays.length ? [...playedDays] : [...futurePlayDays];

    if (!league || !year) {
        return <SkeletonComponent />;
    }

    return (
        <Stack spacing={3} alignItems="center" sx={{ py: 5, px: 1 }}>
            <Standings
                league={league}
                year={year}
                setLeague={handleChangeLeague}
                setYear={handleChangeYear}
                setAmountOfTeams={setAmountOfTeams}
            />
            {league.substring(0, 2) === 'bl' && blMatchDay > 0 && (
                <>
                    <Box sx={{ width: largeDesktopDown ? '100%' : '45%' }}>
                        <Games url={getMatchDataUrl(league, year, blMatchDay)} matchDay={blMatchDay} />
                    </Box>
                    <Box sx={{ width: largeDesktopDown ? '100%' : '45%' }}>
                        {blMatchDay > 1 &&
                            largestArray.map((index: number, i) => {
                                return (
                                    <Stack
                                        key={index}
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Box>
                                            {playedDays[i] && (
                                                <Button
                                                    variant="outlined"
                                                    color="info"
                                                    onClick={() => handleChangeMatchDay(playedDays[i])}
                                                    size={smallDesktopDown ? 'small' : 'medium'}
                                                >
                                                    <Typography variant={smallDesktopDown ? 'caption' : 'body1'}>
                                                        {playedDays[i]}. Spieltag
                                                    </Typography>
                                                </Button>
                                            )}
                                        </Box>
                                        <Box>
                                            {futurePlayDays[i] && (
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => handleChangeMatchDay(futurePlayDays[i])}
                                                    size={smallDesktopDown ? 'small' : 'medium'}
                                                >
                                                    <Typography variant={smallDesktopDown ? 'caption' : 'body1'}>
                                                        {futurePlayDays[i]}. Spieltag
                                                    </Typography>
                                                </Button>
                                            )}
                                        </Box>
                                    </Stack>
                                );
                            })}
                    </Box>
                </>
            )}
            <Dialog open={showMatchdayResultsDialog} onClose={() => setShowMatchdayResultsDialog(false)}>
                <Box sx={{ py: 5, px: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                        {selectedMatchDay > 1 && (
                            <Button onClick={() => setSelectedMatchDay(selectedMatchDay - 1)}>
                                {selectedMatchDay - 1}. Spieltag
                            </Button>
                        )}
                        {selectedMatchDay < 34 && (
                            <Button onClick={() => setSelectedMatchDay(selectedMatchDay + 1)}>
                                {selectedMatchDay + 1}. Spieltag
                            </Button>
                        )}
                        <Button onClick={() => setShowMatchdayResultsDialog(false)}>Close</Button>
                    </Stack>
                    <Games url={getMatchDataUrl(league, year, selectedMatchDay)} matchDay={selectedMatchDay} />
                </Box>
            </Dialog>
        </Stack>
    );
};

export default League;
