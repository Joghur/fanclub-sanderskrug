import { Stack, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';

import Games from './components/League/Games';
import Standings from './components/League/Standings';
import { thisSeason } from './utils/utilities';
import { getLeagueStatus } from './utils/werder';

const League = () => {
    const [year, setYear] = useState<string>(thisSeason);
    const [blMatchDay] = useState(0);
    const [league, setLeague] = useState('');

    useEffect(() => {
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

    return (
        <Stack spacing={3} alignItems="center" sx={{ p: 5 }}>
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

export default League;
