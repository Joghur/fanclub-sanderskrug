import { Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';

import { colours } from 'src/utils/colours';
import { gamesStyle } from 'src/utils/styles';

import { Game, MatchResult } from '../../../utils/types/Game';

//https://github.com/OpenLigaDB/OpenLigaDB-Samples/blob/master/react/app/components/Game.jsx

const GameComponent: React.FunctionComponent<{ match: Game; matchDay: number; showGameStatusText?: boolean }> = ({
    match,
    matchDay,
    showGameStatusText = false,
}) => {
    const { Team1, Team2, MatchResults, LeagueName, MatchDateTime } = match;

    const homeiconsrc = Team1?.TeamIconUrl;
    const guesticonsrc = Team2?.TeamIconUrl;
    const hometeamName = Team1?.TeamName;
    const guestteamName = Team2?.TeamName;

    const matchDate = MatchDateTime && format(new Date(MatchDateTime), 'dd/MM-yyyy');
    const matchHour = MatchDateTime && format(new Date(MatchDateTime), 'HH:mm');
    const matchStatus = (MatchResults && MatchResults.length > 0 && MatchResults[0]) as MatchResult;

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
                        <Tooltip title={matchStatus?.ResultDescription}>
                            <Typography variant="h4">
                                {!!matchStatus?.PointsTeam1 &&
                                    !!matchStatus?.PointsTeam2 &&
                                    `${matchStatus?.PointsTeam1} - ${matchStatus?.PointsTeam2}`}
                            </Typography>
                        </Tooltip>
                    </div>
                    <div style={gamesStyle.imgDiv}>
                        <Typography
                            sx={{
                                py: 3,
                                color: match.MatchIsFinished ? colours.grey : colours.werderGreen,
                            }}
                            variant="h6"
                        >
                            {showGameStatusText && !!matchStatus?.ResultName && `${matchStatus?.ResultName}`}
                        </Typography>
                    </div>
                </CardContent>
            </Stack>
        </Card>
    );
};

export default GameComponent;
