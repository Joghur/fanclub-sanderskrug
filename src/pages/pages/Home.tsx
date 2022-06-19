import React from "react";
import { Box, Grid } from "@mui/material";

import AwayGames from "./AwayGames";
import HomeGames from "./HomeGames";
import News from "./News";
import Games from "../components/Games";
import TestApi from "../components/TestApi";
import Standings from "../components/Standings";

import { werderData } from "../../config/settings";

type Props = {};

const Homes = (props: Props) => {
  const blStr = werderData.currentLeagueString || werderData.lastLeagueString;
  const year = werderData.currentYear || werderData.lastYear;

  return (
    <>
      {/* <HomeGames />
      <AwayGames />
      <News /> */}
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Grid item>
          <Standings blString={blStr} currentYear={year} />
        </Grid>
      </Grid>
      {/* <TestApi /> */}
    </>
  );
};

export default Homes;
