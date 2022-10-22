import { Card, CardContent, Stack, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";

import { Game, MatchResult } from "../types/Game";

//https://github.com/OpenLigaDB/OpenLigaDB-Samples/blob/master/react/app/components/Game.jsx

const GameComponent: React.FunctionComponent<{ match: Game }> = ({ match }) => {
  const {
    matchID,
    team1,
    team2,
    matchResults,
    leagueName,
    matchDateTime,
  } = match;

  const key = matchID;
  const homeiconsrc = team1?.teamIconUrl;
  const guesticonsrc = team2?.teamIconUrl;
  const hometeamName = team1?.teamName;
  const guestteamName = team2?.teamName;
  const hometeamgoals = matchResults && matchResults[0]?.pointsTeam1;
  const guestteamgoals = matchResults && matchResults[0]?.pointsTeam2;

  const matchDay =
    matchDateTime && format(new Date(matchDateTime), "dd/MM-yyyy");
  const matchStatus = (matchResults &&
    matchResults.length > 0 &&
    matchResults[0]) as MatchResult;

  const style = {
    imgStyle: {
      height: "75px",
      padding: "10px",
    },
    imgDiv: {
      display: "flex",
      justifyContent: "center",
    },
    nameDiv: {
      display: "flex",
      justifyContent: "center",
      padding: "20px",
    },
  };

  //   if()
  return (
    <div style={{ width: 400 }}>
      <Card>
        <Stack alignItems="center">
          <CardContent>{leagueName}</CardContent>
          <CardContent>{matchDay}</CardContent>
          <CardContent>
            <div style={style.imgDiv}>
              <img id="homeicon" src={homeiconsrc} style={style.imgStyle} />
              <img id="guesticon" src={guesticonsrc} style={style.imgStyle} />
            </div>
            <div style={style.imgDiv}>
              <p id="hometeamname">{hometeamName}</p>
              <p style={{ width: 25, textAlign: "center" }}> : </p>
              <p id="guestteamname">{guestteamName}</p>
            </div>
            <div style={style.imgDiv}>
              <Tooltip title={matchStatus?.resultDescription}>
                <Typography variant="h4">
                  {`${matchStatus?.pointsTeam1} - ${matchStatus?.pointsTeam2}`}
                </Typography>
              </Tooltip>
            </div>
            <div style={style.imgDiv}>
              <Typography
                sx={{
                  py: 3,
                  color: "gray",
                }}
                variant="h6"
              >{`${matchStatus?.resultName}`}</Typography>
            </div>
          </CardContent>
        </Stack>
      </Card>
    </div>
  );
};

export default GameComponent;
