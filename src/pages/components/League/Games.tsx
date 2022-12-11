import { Box, Typography } from '@mui/material';

import { useAxios } from 'src/utils/api/axios';

import { werderData } from '../../../config/settings';
import { Game } from '../../../utils/types/Game';

import GameComponent from './Game';

interface Props {
    url?: string;
}

const Games = ({ url }: Props) => {
    const [data, loading, error] = useAxios<Game[]>(url || '');

    const werderGames = data?.filter(
        (game: Game) => game.team1?.teamName === werderData.teamName || game.team2?.teamName === werderData.teamName,
    );

    if (loading) {
        return <Typography>Lade Daten...</Typography>;
    }
    if (error) {
        return <Typography>Keine Fußballspiele gefunden</Typography>;
    }

    console.log('!werderGames || werderGames?.length === 0', !werderGames || werderGames?.length === 0);

    if (!werderGames || werderGames?.length === 0) {
        return null;
    }

    return (
        <Box sx={{ alignItems: 'center' }}>
            <GameComponent match={werderGames[0]} />
        </Box>
    );
};

export default Games;
