import React, { useEffect } from "react";
import Game from "./Game";
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
  url: string;
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
    (game: any) =>
      game.team1.teamName === werderData.teamName ||
      game.team2.teamName === werderData.teamName
  );
  //   console.log("werderGames", werderGames);
  const listOfGames = werderGames.map((game: any) => {
    const props = {
      key: game.matchID,
      homeiconsrc: game.team1.teamIconUrl,
      guesticonsrc: game.team2.teamIconUrl,
      hometeamName: game.team1.teamName,
      guestteamName: game.team2.teamName,
      isGameFinished: game.matchIsFinished,
      hometeamgoals: game.matchResults[0].pointsteam1,
      guestteamgoals: game.matchResults[0].pointsteam2,
      leagueName: game.leagueName,
      matchDateTime: game.matchDateTime,
      matchResults: game.matchResults,
    };
    // console.log("MatchDateTime", game.matchDateTime);
    // console.log("LeagueName", game.leagueName);
    // console.log("game.team2.teamName", game.team2.teamName);
    // console.log("TimeZoneID", game.timeZoneID);
    // console.log("MatchDateTimeUTC", game.matchDateTimeUTC);
    // console.log("MatchIsFinished", game.matchIsFinished);
    // console.log("MatchResults", game.matchResults);
    // console.log("Goals", game.goals);
    return <Game {...props} />;
  });

  return (
    <>
      <Box sx={{ alignItems: "center" }}>{listOfGames}</Box>
    </>
  );
};

export default Games;
