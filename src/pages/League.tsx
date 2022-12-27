import { Stack, SelectChangeEvent, Box, useTheme, useMediaQuery, Dialog, Typography, Button } from '@mui/material';
import { useState } from 'react';

import { getMatchDataUrl } from 'src/utils/api/urls';
import { useBlMatchday, useleague } from 'src/utils/hooks';

import { thisSeason } from '../utils/utilities';

import Games from './components/League/Games';
import Standings from './components/League/Standings';

const League = () => {
    const theme = useTheme();
    const [year, setYear] = useState<string>(thisSeason);
    const [showMatchdayResultsDialog, setShowMatchdayResultsDialog] = useState(false);
    const [selectedMatchDay, setSelectedMatchDay] = useState(1);
    const [amountOfTeams, setAmountOfTeams] = useState(0);

    const [league, setLeague] = useleague(year);
    const [blMatchDay] = useBlMatchday(league);
    // console.log('blMatchDay', blMatchDay);

    const largeDesktopDown = useMediaQuery(theme.breakpoints.down('lg'));
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
    const futurePlayDays = Array.from({ length: amountOfMatchDays - blMatchDay + 1 }, (_, i) => i + blMatchDay);
    const largestArray = playedDays.length > futurePlayDays.length ? playedDays : futurePlayDays;
    return (
        <Stack spacing={3} alignItems="center" sx={{ py: 5, px: 5 }}>
            {league && year && (
                <>
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
                                            <Stack key={index} direction="row" justifyContent="space-between">
                                                <Box>
                                                    {playedDays[i] && (
                                                        <Button
                                                            variant="outlined"
                                                            color="info"
                                                            onClick={() => handleChangeMatchDay(playedDays[i])}
                                                            sx={{ width: 220 }}
                                                        >
                                                            <Typography>{playedDays[i]}. Spieltag</Typography>
                                                        </Button>
                                                    )}
                                                </Box>
                                                <Box>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => handleChangeMatchDay(futurePlayDays[i])}
                                                        sx={{ width: 220 }}
                                                    >
                                                        <Typography>{futurePlayDays[i]}. Spieltag</Typography>
                                                    </Button>
                                                </Box>
                                            </Stack>
                                        );
                                    })}
                            </Box>
                        </>
                    )}
                </>
            )}
            <Dialog open={showMatchdayResultsDialog} onClose={() => setShowMatchdayResultsDialog(false)}>
                <Box sx={{ p: 5 }}>
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
