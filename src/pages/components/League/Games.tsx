import { Box, Stack, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { format } from 'date-fns';

import { colours } from 'src/utils/colours';
import { useGames } from 'src/utils/hooks';
import { gamesStyle, getStyledText } from 'src/utils/styles';
import { getMatchStatus } from 'src/utils/utilities';

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
        (game: Game) => game.team1?.teamName === werderData.teamName || game.team2?.teamName === werderData.teamName,
    );
    const otherGames = games?.filter(
        (game: Game) => game.team1?.teamName !== werderData.teamName && game.team2?.teamName !== werderData.teamName,
    );

    if (loading) {
        return <Typography>Lade Daten...</Typography>;
    }
    if (error || games.length === 0) {
        return <Typography> Keine Fußballspiele gefunden</Typography>;
    }

    return (
        <Box>
            <Stack spacing={2}>
                <Box justifyContent="center">
                    {werderGames?.length > 0 && matchDay && (
                        <GameComponent match={werderGames[0]} matchDay={matchDay} showGameStatusText />
                    )}
                </Box>
                <Box justifyContent="center">
                    {otherGames?.length > 0 && <GameComponents matches={otherGames} showGameEndText />}
                </Box>
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
        <Box sx={{ width: '100%' }}>
            {matches.map((match, i) => {
                const matchResult = (match.matchResults &&
                    match.matchResults.length > 0 &&
                    match.matchResults[0]) as MatchResult;

                const matchStatus = getMatchStatus(match?.matchDateTime, !!matchResult, match?.matchIsFinished);

                const GoalText = getStyledText(colours.black, mobile ? 12 : undefined);
                const TeamText = getStyledText(colours.black, mobile ? 12 : undefined);
                const SmallText = getStyledText(matchStatus.colour, mobile ? 8 : 10);

                const team1Name = mobile ? match.team1?.shortName : match.team1?.teamName;
                const team2Name = mobile ? match.team2?.shortName : match.team2?.teamName;

                return (
                    <Box key={i}>
                        <Stack>
                            <Tooltip
                                title={
                                    matchResult && matchResult.resultDescription
                                        ? matchResult.resultDescription
                                        : match?.matchDateTime &&
                                          format(new Date(match?.matchDateTime), 'dd/MM - HH:mm')
                                }
                            >
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ height: 50 }}>
                                    <Box sx={{ width: '10%' }}>
                                        <img
                                            id="homeicon"
                                            src={match.team1?.teamIconUrl}
                                            style={gamesStyle.thumpStyle}
                                        />
                                    </Box>
                                    <Box alignItems="flex-end" sx={{ width: '40%' }}>
                                        <TeamText sx={{ wordWrap: 'break-word' }}>{team1Name}</TeamText>
                                    </Box>
                                    <Box sx={{ width: '10%', flexWrap: 'nowrap' }}>
                                        <Stack alignItems="center" spacing={-1}>
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <GoalText>{matchResult?.pointsTeam1}</GoalText>
                                                <Typography variant="h5">-</Typography>
                                                <GoalText>{matchResult?.pointsTeam2}</GoalText>
                                            </Stack>
                                            {showGameEndText && <SmallText>{matchStatus?.status}</SmallText>}
                                        </Stack>
                                    </Box>
                                    <Box sx={{ width: '40%' }}>
                                        <TeamText sx={{ wordWrap: 'break-word' }}>{team2Name}</TeamText>
                                    </Box>
                                    <Box sx={{ width: '10%' }}>
                                        <img
                                            id="homeicon"
                                            src={match.team2?.teamIconUrl}
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
