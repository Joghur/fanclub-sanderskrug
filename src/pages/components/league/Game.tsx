import { Card, CardContent, Stack, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { format } from 'date-fns';

import { colours } from 'src/utils/colours';
import { gamesStyle } from 'src/utils/styles';
import { getMatchStatus } from 'src/utils/utilities';

import { Game, MatchResult } from '../../../utils/types/Game';

//https://github.com/OpenLigaDB/OpenLigaDB-Samples/blob/master/react/app/components/Game.jsx

// for matchinfo https://www.openligadb.de/api/getmatchdata/39738

const GameComponent: React.FunctionComponent<{ match: Game; matchDay: number; showGameStatusText?: boolean }> = ({
    match,
    matchDay,
    showGameStatusText = false,
}) => {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { Team1, Team2, MatchResults, LeagueName, MatchDateTime, MatchIsFinished } = match;

    const homeiconsrc = Team1?.TeamIconUrl;
    const guesticonsrc = Team2?.TeamIconUrl;
    const hometeamName = mobile ? Team1?.ShortName : Team1?.TeamName;
    const guestteamName = mobile ? Team2?.ShortName : Team2?.TeamName;

    // useEffect(() => {
    //     setTimeout(() => {

    //     }, 5000);

    //     return () => {
    //         second;
    //     };
    // }, []);

    const matchDate = MatchDateTime && format(new Date(MatchDateTime), 'dd/MM-yyyy');
    const matchHour = MatchDateTime && format(new Date(MatchDateTime), 'HH:mm');
    const matchResult = (MatchResults && MatchResults.length > 0 && MatchResults[0]) as MatchResult;
    const matchStatus = getMatchStatus(MatchDateTime, !!matchResult, !!MatchIsFinished);
    // const matchIsStarted = Boolean(MatchDateTime && differenceInMinutes(new Date(), new Date(MatchDateTime)) > 0);
    const matchIsStarted = Boolean(matchResult);
    const team1IsWerder = Team1?.TeamName === 'Werder Bremen';

    let team1Goals = 0;

    const goals = match?.Goals;

    return (
        <Card variant="outlined">
            <Stack alignItems="center">
                <CardContent>{LeagueName}</CardContent>
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
                        <Tooltip title={matchResult?.ResultDescription}>
                            <Typography variant="h4">
                                {matchIsStarted && `${matchResult?.PointsTeam1} - ${matchResult?.PointsTeam2}`}
                            </Typography>
                        </Tooltip>
                    </div>
                    <div style={gamesStyle.imgDiv}>
                        <Typography
                            sx={{
                                py: 3,
                                color: MatchIsFinished ? colours.grey : colours.werderGreen,
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
                                    const team1Scored = o.ScoreTeam1 !== team1Goals;

                                    if (team1Scored) {
                                        team1Goals++;
                                    }

                                    const werderScored =
                                        (team1Scored && team1IsWerder) || (!team1Scored && !team1IsWerder);

                                    return (
                                        <Typography key={o.GoalID}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <span
                                                    style={{
                                                        backgroundColor: werderScored ? 'green' : 'red',
                                                        color: 'whitesmoke',
                                                        padding: '5px 4px 4px 5px',
                                                        borderRadius: 20,
                                                    }}
                                                >{`${o.ScoreTeam1}-${o.ScoreTeam2}`}</span>
                                                <span>{`${o.MatchMinute}'`}</span>
                                                <span> {`${o.GoalGetterName}`}</span>
                                                <span
                                                    style={{
                                                        color: 'red',
                                                    }}
                                                >
                                                    {`${o.IsPenalty ? 'Elfmeter' : ''}`}
                                                </span>
                                                <span
                                                    style={{
                                                        color: 'red',
                                                    }}
                                                >{`${o.IsOwnGoal ? 'Eigentor' : ''}`}</span>
                                                <span
                                                    style={{
                                                        color: 'red',
                                                    }}
                                                >{`${o.IsOvertime ? 'Nachspielzeit' : ''}`}</span>
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
