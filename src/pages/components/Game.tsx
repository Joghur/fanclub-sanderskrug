import { Card, CardContent, Stack, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";

//https://github.com/OpenLigaDB/OpenLigaDB-Samples/blob/master/react/app/components/Game.jsx

const Game = (props) => {
  const {
    homeiconsrc,
    guesticonsrc,
    hometeamName,
    guestteamName,
    isGameFinished,
    hometeamgoals,
    guestteamgoals,
    leagueName,
    matchDateTime,
    matchResults,
  } = props;

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

  const matchDay = format(new Date(matchDateTime), "dd/MM-yyyy");
  const matchStatus = matchResults[0].resultName;
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
              <Tooltip title={matchResults[0].resultDescription}>
                <Typography variant="h4">
                  {`${matchResults[0].pointsTeam1} - ${matchResults[0].pointsTeam2}`}
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
              >{`${matchStatus}`}</Typography>
            </div>
          </CardContent>
        </Stack>
      </Card>
    </div>
  );
};

export default Game;
