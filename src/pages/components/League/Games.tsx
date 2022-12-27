import { Box, Stack, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';

import { colours } from 'src/utils/colours';
import { useGames } from 'src/utils/hooks';
import { gamesStyle, getStyledText } from 'src/utils/styles';

import { werderData } from '../../../config/settings';
import { Game, MatchResult } from '../../../utils/types/Game';

import GameComponent from './Game';

interface Props {
    url?: string;
    matchDay?: number;
}

const Games = ({ url, matchDay }: Props) => {
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
        <Box>
            <Stack spacing={2}>
                <Box justifyContent="center">
                    {werderGames?.length > 0 && matchDay && (
                        <GameComponent match={werderGames[0]} matchDay={matchDay} showGameStatusText />
                    )}
                </Box>
                <Box justifyContent="center">{otherGames?.length > 0 && <GameComponents matches={otherGames} />}</Box>
            </Stack>
        </Box>
    );
};

export default Games;

const GameComponents: React.FunctionComponent<{ matches: Game[]; showGameEndText?: boolean }> = ({
    matches,
    showGameEndText,
}) => {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box>
            {matches.map((match, i) => {
                const matchStatus = (match.MatchResults &&
                    match.MatchResults.length > 0 &&
                    match.MatchResults[0]) as MatchResult;

                const GoalText = getStyledText(colours.black, mobile ? 12 : '');
                const TeamText = getStyledText(colours.black, mobile ? 12 : '');
                const SmallText = getStyledText(match.MatchIsFinished ? colours.grey : colours.green, mobile ? 8 : 10);

                return (
                    <Box key={i}>
                        <Stack>
                            <Tooltip title={matchStatus?.ResultDescription}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ height: 50 }}>
                                    <Box sx={{ width: '10%' }}>
                                        <img
                                            id="homeicon"
                                            src={match.Team1?.TeamIconUrl}
                                            style={gamesStyle.thumpStyle}
                                        />
                                    </Box>
                                    <Box alignItems="flex-end" sx={{ width: '40%' }}>
                                        <TeamText sx={{ wordWrap: 'break-word' }}>{match.Team1?.TeamName}</TeamText>
                                    </Box>
                                    <Box sx={{ width: '10%', flexWrap: 'nowrap' }}>
                                        <Stack alignItems="center" spacing={-1}>
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <GoalText>{matchStatus.PointsTeam1}</GoalText>
                                                <Typography variant="h5">-</Typography>
                                                <GoalText>{matchStatus.PointsTeam2}</GoalText>
                                            </Stack>
                                            {showGameEndText && <SmallText>{matchStatus.ResultName}</SmallText>}
                                        </Stack>
                                    </Box>
                                    <Box sx={{ width: '40%' }}>
                                        <TeamText>{match.Team2?.TeamName}</TeamText>
                                    </Box>
                                    <Box sx={{ width: '10%' }}>
                                        <img
                                            id="homeicon"
                                            src={match.Team2?.TeamIconUrl}
                                            style={gamesStyle.thumpStyle}
                                        />
                                    </Box>
                                </Stack>
                            </Tooltip>
                        </Stack>
                    </Box>
                );
            })}
        </Box>
    );
};
