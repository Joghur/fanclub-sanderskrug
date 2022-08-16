import React, { useEffect } from "react";
import GameComponent from "./Game";
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
import { Game } from "../types/Game";

interface Props {
  url?: string;
}

const fetchAllGames = (url: string) => {
  return apiFetch(url);
};

const Games = (props: Props) => {
  const { url } = props;

  const [games, setGames] = React.useState<Game[]>([]);

  useEffect(() => {
    if (url) {
      fetchAllGames(url)
        .then((result) => {
          setGames(result.data);
        })
        .catch((error) => {
          return error;
        });
    }
  }, []);

  const werderGames = games.filter(
    (game: any) =>
      game.team1.teamName === werderData.teamName ||
      game.team2.teamName === werderData.teamName
  );

  console.log("Games - url", url);

  if (werderGames.length === 0) {
    return null;
  }

  return (
    <>
      <Box sx={{ alignItems: "center" }}>
        <GameComponent match={werderGames[0]} />
      </Box>
    </>
  );
};

export default Games;
