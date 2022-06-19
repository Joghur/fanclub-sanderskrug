import React, { useEffect } from "react";
import Game from "./Game.jsx";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import { apiFetch } from "../api/axios";
import { werderData } from "../../config/settings";

type Props = {
  url: string,
};

const Games = (props: Props) => {
  const [games, setGames] = React.useState([]);

  const fetchAllGames = () => {
    return apiFetch(props.url);
  };

  useEffect(() => {
    fetchAllGames()
      .then((result) => {
        setGames(result.data);
      })
      .catch((error) => {
        return error;
      });
  }, []);

  const werderGames = games.filter(
    (game) =>
      game.Team1.TeamName === werderData.TeamName ||
      game.Team2.TeamName === werderData.TeamName
  );
//   console.log("werderGames", werderGames);
  const listOfGames = werderGames.map((game, index) => {
    const props = {
      key: game.MatchID,
      homeiconsrc: game.Team1.TeamIconUrl,
      guesticonsrc: game.Team2.TeamIconUrl,
      hometeamname: game.Team1.TeamName,
      guestteamname: game.Team2.TeamName,
      isGameFinished: game.MatchIsFinished,
      hometeamgoals: game.MatchResults[1].PointsTeam1,
      guestteamgoals: game.MatchResults[1].PointsTeam2,
      leagueName: game.LeagueName,
      matchDateTime: game.MatchDateTime,
      matchResults: game.MatchResults,
    };
    //   console.log("MatchDateTime", game.MatchDateTime);
    //   console.log("LeagueName", game.LeagueName);
    //   console.log("game.Team2.TeamName", game.Team2.TeamName);
    //   console.log("TimeZoneID", game.TimeZoneID);
    //   console.log("MatchDateTimeUTC", game.MatchDateTimeUTC);
    //   console.log("MatchIsFinished", game.MatchIsFinished);
    // console.log("MatchResults", game.MatchResults);
    //   console.log("Goals", game.Goals);
    return <Game {...props} />;
  });

  return (
    <>
      <Box sx={{ alignItems: "center" }}>{listOfGames}</Box>
    </>
  );
};

export default Games;
