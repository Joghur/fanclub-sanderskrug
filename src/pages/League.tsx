import { Stack, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

import { getMatchDataUrl } from 'src/utils/api/urls';
import { useBlMatchday, useleague } from 'src/utils/hooks';

import { thisSeason } from '../utils/utilities';

import Games from './components/League/Games';
import Standings from './components/League/Standings';

const League = () => {
    const [year, setYear] = useState<string>(thisSeason);

    const [league, setLeague] = useleague(year);
    const [blMatchDay] = useBlMatchday(league);

    const handleChangeYear = (event: SelectChangeEvent) => {
        setYear(event.target.value);
    };

    const handleChangeLeague = (event: SelectChangeEvent) => {
        setLeague(event.target.value);
    };

    return (
        <Stack spacing={3} alignItems="center" sx={{ py: 5 }}>
            {league && year && (
                <>
                    <Standings league={league} year={year} setLeague={handleChangeLeague} setYear={handleChangeYear} />
                    {league.substring(0, 3) === 'bl1' && blMatchDay !== '0' && (
                        <Games url={getMatchDataUrl(league, year, blMatchDay)} />
                    )}
                </>
            )}
        </Stack>
    );
};

export default League;
