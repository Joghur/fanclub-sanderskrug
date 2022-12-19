import { Stack, SelectChangeEvent, Box, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';

import { getMatchDataUrl } from 'src/utils/api/urls';
import { useBlMatchday, useleague } from 'src/utils/hooks';

import { thisSeason } from '../utils/utilities';

import Games from './components/League/Games';
import Standings from './components/League/Standings';

const League = () => {
    const theme = useTheme();
    const [year, setYear] = useState<string>(thisSeason);

    const mobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [league, setLeague] = useleague(year);
    const [blMatchDay] = useBlMatchday(league);

    const handleChangeYear = (event: SelectChangeEvent) => {
        setYear(event.target.value);
    };

    const handleChangeLeague = (event: SelectChangeEvent) => {
        setLeague(event.target.value);
    };

    return (
        <Stack spacing={3} alignItems="center" sx={{ py: 5, px: 5 }}>
            {league && year && (
                <>
                    <Standings league={league} year={year} setLeague={handleChangeLeague} setYear={handleChangeYear} />
                    {league.substring(0, 3) === 'bl1' && blMatchDay !== '0' && (
                        <Box sx={{ width: mobile ? '100%' : '45%' }}>
                            <Games url={getMatchDataUrl(league, year, blMatchDay)} />
                        </Box>
                    )}
                </>
            )}
        </Stack>
    );
};

export default League;
