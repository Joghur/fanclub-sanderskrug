import { Card, CardContent, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";

//https://github.com/OpenLigaDB/OpenLigaDB-Samples/blob/master/react/app/components/Game.jsx

const Game = (props) => {
  const {
    homeiconsrc,
    guesticonsrc,
    hometeamname,
    guestteamname,
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

  let homeGoals = isGameFinished ? hometeamgoals : "-";
  let guestGoals = isGameFinished ? guestteamgoals : "-";

  const matchDay = format(new Date(matchDateTime), "dd/MM-yyyy");

  return (
    <div style={{ width: 400 }}>
      <Card>
        <CardContent>{leagueName}</CardContent>
        <CardContent>{matchDay}</CardContent>
        <CardContent>
          <div style={style.imgDiv}>
            <img id="homeicon" src={homeiconsrc} style={style.imgStyle} />
            <img id="guesticon" src={guesticonsrc} style={style.imgStyle} />
          </div>
          <div style={style.imgDiv}>
            <p id="hometeamname">{hometeamname}</p>
            <p style={{ width: 25, textAlign: "center" }}> : </p>
            <p id="guestteamname">{guestteamname}</p>
          </div>
          <div style={style.imgDiv}>
            <h1 id="hometeamgoals">{homeGoals}</h1>
            <p style={{ width: 75 }}></p>
            <h1 id="guestteamgoals">{guestGoals}</h1>
          </div>
          <Tooltip title="Halbzeitergebnis">
            <Typography>
              {`${matchResults[1].PointsTeam1} - ${matchResults[1].PointsTeam2}`}
            </Typography>
          </Tooltip>
        </CardContent>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default Game;
