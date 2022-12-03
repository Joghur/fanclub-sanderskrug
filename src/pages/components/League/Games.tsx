import { Box } from '@mui/material';
import React, { useEffect } from 'react';

import { werderData } from '../../../config/settings';
import { fetchState } from '../../api/axios';
import { Game } from '../../types/Game';

import GameComponent from './Game';

interface Props {
    url?: string;
}

const Games = (props: Props) => {
    const { url } = props;

    const [games, setGames] = React.useState<Game[]>([]);

    useEffect(() => {
        if (url) {
            fetchState(url, setGames);
        }
    }, []);

    const werderGames = games.filter(
        (game: Game) => game.team1?.teamName === werderData.teamName || game.team2?.teamName === werderData.teamName,
    );

    if (werderGames.length === 0) {
        return null;
    }

    return (
        <Box sx={{ alignItems: 'center' }}>
            <GameComponent match={werderGames[0]} />
        </Box>
    );
};

export default Games;
