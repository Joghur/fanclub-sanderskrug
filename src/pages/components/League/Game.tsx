import { Card, CardContent, Stack, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { format } from 'date-fns';

import { gamesStyle } from 'src/utils/styles';
import { getMatchStatus } from 'src/utils/utilities';

import { Game, MatchResult } from '../../../utils/types/Game';

const GameComponent: React.FunctionComponent<{ match: Game; matchDay: number; showGameStatusText?: boolean }> = ({
    match,
    matchDay,
    showGameStatusText = false,
}) => {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { team1, team2, matchResults, leagueName, matchDateTime, matchIsFinished } = match;

    const homeiconsrc = team1?.teamIconUrl;
    const guesticonsrc = team2?.teamIconUrl;
    const hometeamName = mobile ? team1?.shortName : team1?.teamName;
    const guestteamName = mobile ? team2?.shortName : team2?.teamName;
    const matchDate = matchDateTime && format(new Date(matchDateTime), 'dd/MM-yyyy');
    const matchHour = matchDateTime && format(new Date(matchDateTime), 'HH:mm');
    const matchResult = (matchResults && matchResults.length > 0 && matchResults[0]) as MatchResult;
    const matchStatus = getMatchStatus(matchDateTime, !!matchResult, !!matchIsFinished);
    const matchIsStarted = Boolean(matchResult);
    const team1IsWerder = team1?.teamName === 'Werder Bremen';

    let team1Goals = 0;

    const goals = match?.goals;

    return (
        <Card variant="outlined">
            <Stack alignItems="center">
                <CardContent>{leagueName}</CardContent>
                <CardContent>
                    <Stack alignItems="center">
                        <Typography variant="h6">{matchDay}. Spieltag</Typography>
                        <Typography variant="h4">{matchDate}</Typography>
                        <Typography variant="h5">{matchHour}</Typography>
                    </Stack>
                </CardContent>
                <CardContent>
                    <div style={gamesStyle.imgDiv}>
                        <img id="homeicon" src={homeiconsrc} style={gamesStyle.imgStyle} />
                        <img id="guesticon" src={guesticonsrc} style={gamesStyle.imgStyle} />
                    </div>
                    <div style={gamesStyle.imgDiv}>
                        <p id="hometeamname">{hometeamName}</p>
                        <p style={{ width: 25, textAlign: 'center' }}> : </p>
                        <p id="guestteamname">{guestteamName}</p>
                    </div>
                    <div style={gamesStyle.imgDiv}>
                        <Tooltip title={matchResult?.resultDescription}>
                            <Typography variant="h4">
                                {matchIsStarted && `${matchResult?.pointsTeam1} - ${matchResult?.pointsTeam2}`}
                            </Typography>
                        </Tooltip>
                    </div>
                    <div style={gamesStyle.imgDiv}>
                        <Typography
                            sx={{
                                py: 3,
                                color: matchStatus.colour,
                            }}
                            variant="h6"
                        >
                            {showGameStatusText && !matchStatus.status.includes('/') && matchStatus.status}
                        </Typography>
                    </div>
                    <Stack alignItems="center">
                        <Stack spacing={1}>
                            {goals &&
                                goals.map(o => {
                                    const team1Scored = o.scoreTeam1 !== team1Goals;

                                    if (team1Scored) {
                                        team1Goals++;
                                    }

                                    const werderScored =
                                        (team1Scored && team1IsWerder) || (!team1Scored && !team1IsWerder);

                                    return (
                                        <Typography key={o.goalID}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <span
                                                    style={{
                                                        backgroundColor: werderScored ? 'green' : 'red',
                                                        color: 'whitesmoke',
                                                        padding: '5px 4px 4px 5px',
                                                        borderRadius: 20,
                                                    }}
                                                >{`${o.scoreTeam1}-${o.scoreTeam2}`}</span>
                                                <span>{`${o.matchMinute}'`}</span>
                                                <span> {`${o.goalGetterName}`}</span>
                                                <span
                                                    style={{
                                                        color: 'red',
                                                    }}
                                                >
                                                    {`${o.isPenalty ? 'Elfmeter' : ''}`}
                                                </span>
                                                <span
                                                    style={{
                                                        color: 'red',
                                                    }}
                                                >{`${o.isOwnGoal ? 'Eigentor' : ''}`}</span>
                                                <span
                                                    style={{
                                                        color: 'red',
                                                    }}
                                                >{`${o.isOvertime ? 'Nachspielzeit' : ''}`}</span>
                                            </Stack>
                                        </Typography>
                                    );
                                })}
                        </Stack>
                    </Stack>
                </CardContent>
            </Stack>
        </Card>
    );
};

export default GameComponent;
