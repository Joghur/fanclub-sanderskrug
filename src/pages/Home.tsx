import { Stack, SelectChangeEvent, Typography, Divider, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { fetchDocument } from './api/database';
import Games from './components/Games';
import InfoCard from './components/InfoCard';
import NextGame from './components/NextGame';
import Standings from './components/Standings';
import { NextMatch } from './types/Game';
import { thisSeason } from './utils/utilities';
import { getLeagueStatus } from './utils/werder';

export const initNextMatch: NextMatch = {
    gameId: '',
    matchDate: new Date(),
    location: '',
    matchDay: 0,
    matchType: 'other',
    opponent: '',
    nextMatch: false,
    active: false,
    busTour: false,
};

const Homes = () => {
    const [nextMatch, setNextMatch] = useState<NextMatch>(initNextMatch);
    const [year, setYear] = useState<string>(thisSeason);
    const [league, setLeague] = useState('');
    const [blMatchDay] = useState(0);

    const fetchingStartInfo = async () => {
        const nextMatch = await fetchDocument('info', 'nextMatch');

        if (nextMatch.success) {
            const _nextMatch = nextMatch.success;
            _nextMatch.matchDate = new Date(_nextMatch.matchDate.seconds * 1000);
            setNextMatch(_nextMatch);
            return;
        }
        console.log('Error in NextMatch: ', nextMatch.error);
    };

    useEffect(() => {
        fetchingStartInfo();

        (async function () {
            const _league = await getLeagueStatus();

            if (_league) {
                setLeague(_league);
            }
        })();
    }, []);

    const handleChangeYear = (event: SelectChangeEvent) => {
        setYear(event.target.value);
    };

    const handleChangeLeague = (event: SelectChangeEvent) => {
        setLeague(event.target.value);
    };

    const showOrderButton = nextMatch && nextMatch.active;

    // console.log("league", league);
    // console.log("year", year);
    // console.log('blMatchDay', blMatchDay);
    // console.log('nextMatch', nextMatch);
    // console.log('nextMatch.matchType', nextMatch.matchType);

    return (
        <Stack spacing={3} alignItems="center" sx={{ p: 5 }}>
            <InfoCard />
            <NextGame nextMatch={nextMatch} setNextMatch={setNextMatch} />
            {showOrderButton && (
                <Button size="large" variant="outlined" sx={{ boxShadow: 3, p: 5 }} onClick={() => {}}>
                    <NavLink to="kartenvorbestellung" style={{ color: 'green', textDecoration: 'none' }}>
                        Gästekartenvorbestellung
                    </NavLink>
                </Button>
            )}
            {!showOrderButton && (
                <Typography variant="h5" color="orange" sx={{ border: 1, padding: 3, boxShadow: 3, p: 5 }}>
                    Gästekartenvorbestellung noch nicht aktiv
                </Typography>
            )}
            <Divider />
            {league && year && (
                <>
                    {blMatchDay > 0 && (
                        <Games url={`https://api.openligadb.de/getmatchdata/${league}/${year}/${blMatchDay}`} />
                    )}
                    <Standings league={league} year={year} setLeague={handleChangeLeague} setYear={handleChangeYear} />
                </>
            )}
        </Stack>
    );
};

export default Homes;
