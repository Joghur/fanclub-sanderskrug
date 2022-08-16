import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Paper,
  Stack,
  TextareaAutosize,
  TextField,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import styled from "@emotion/styled";
import { Timestamp } from "firebase/firestore/lite";

import Standings from "../components/Standings";
import { editDocument, queryDocuments } from "../api/database";
import Games from "../components/Games";
import CardInfo from "../components/NextGameCard";
import NextGameCard from "../components/NextGameCard";
import InfoCard from "../components/InfoCard";
import { thisSeason, thisYear } from "../utils/utilities";
import { getLeagueStatus } from "../utils/werder";

const StyledButton = styled(Button)({
  marginBottom: 30,
});

const StyledTextField = styled(TextField)({
  marginRight: 10,
});

type MatchInfo = {
  currentMatchId?: string;
  id: string;
  matchDate: Timestamp;
  homeAway: string;
  location: string;
  league: string;
};

type Props = {};

const Homes = (props: Props) => {
  const snackbar = useSnackbar();

  const [currentMatch, setCurrentMatch] = useState<MatchInfo | null>(null);
  const [year, setYear] = useState<string>(thisSeason);
  const [league, setLeague] = useState("");

  const fetchingStartInfo = async () => {
    const current = await queryDocuments("cards", "currentMatchId", "!=", "");

    if (current.success.length === 1) {
      setCurrentMatch(current.success[0]);
    }
  };

  useEffect(() => {
    fetchingStartInfo();

    (async function () {
      const _league = await getLeagueStatus();

      if (_league) {
        setLeague(_league);
      }
    })();
  }, []);

  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value);
  };

  const handleChangeLeague = (event: SelectChangeEvent) => {
    setLeague(event.target.value);
  };

  console.log("league", league);

  return (
    <>
      <Stack spacing={3} alignItems="center" sx={{ p: 5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          spacing={15}
        >
          <InfoCard />
          <NextGameCard />
        </Stack>

        <Games url="https://api.openligadb.de/getmatchdata/bl1/2022/2" />
        <Standings
          league={league}
          year={year}
          setLeague={handleChangeYear}
          setYear={handleChangeLeague}
        />
      </Stack>
    </>
  );
};

export default Homes;
