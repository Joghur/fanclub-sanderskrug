import { Box, Stack, Tooltip, Typography } from '@mui/material';

import { useGames } from 'src/utils/hooks';
import { gamesStyle } from 'src/utils/styles';

import { werderData } from '../../../config/settings';
import { Game, MatchResult } from '../../../utils/types/Game';

import GameComponent from './Game';

interface Props {
    url?: string;
}

const Games = ({ url }: Props) => {
    const [games, loading, error] = useGames(url || '');

    const werderGames = games?.filter(
        (game: Game) => game.Team1?.TeamName === werderData.teamName || game.Team2?.TeamName === werderData.teamName,
    );
    const otherGames = games?.filter(
        (game: Game) => game.Team1?.TeamName !== werderData.teamName && game.Team2?.TeamName !== werderData.teamName,
    );

    if (loading) {
        return <Typography>Lade Daten...</Typography>;
    }
    if (error || !games) {
        return <Typography>Keine Fußballspiele gefunden</Typography>;
    }

    return (
        <Box sx={{ alignItems: 'center' }}>
            {werderGames?.length > 0 && <GameComponent match={werderGames[0]} />}
            {otherGames?.length > 0 && <GameComponents matches={otherGames} />}
        </Box>
    );
};

export default Games;

const GameComponents: React.FunctionComponent<{ matches: Game[] }> = ({ matches }) => {
    return (
        <div>
            {matches.map((match, i) => {
                const matchStatus = (match.MatchResults &&
                    match.MatchResults.length > 0 &&
                    match.MatchResults[0]) as MatchResult;

                return (
                    <Stack key={i} alignItems="center" justifyContent="center" spacing={-1}>
                        <Tooltip title={matchStatus?.ResultDescription}>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                <img id="homeicon" src={match.Team1?.TeamIconUrl} style={gamesStyle.imgStyle} />
                                <Typography>{match.Team1?.TeamName}</Typography>
                                <Typography>{matchStatus.PointsTeam1}</Typography>
                                <Typography variant="h4">-</Typography>
                                <Typography>{matchStatus.PointsTeam2}</Typography>
                                <Typography>{match.Team2?.TeamName}</Typography>
                                <img id="homeicon" src={match.Team2?.TeamIconUrl} style={gamesStyle.imgStyle} />
                            </Stack>
                        </Tooltip>
                        {/* <Typography>{matchStatus.ResultName}</Typography> */}
                    </Stack>
                );
            })}
        </div>
    );
};
