import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Paper,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { getAuth } from "firebase/auth";

import Standings from "../components/Standings";
import { editDocument, queryDocuments } from "../api/database";

type cardInfo = {
  infoText: string;
};

type Props = {};

const Homes = (props: Props) => {
  const snackbar = useSnackbar();
  const auth = getAuth();

  const [info, setInfo] = useState("");

  const fetching = async () => {
    const info = await queryDocuments("info", "infoText", "!=", "");

    if (info.success.length === 1) {
      setInfo(info.success[0].infoText);
    }
  };

  useEffect(() => {
    fetching();
  }, []);

  const handleSubmit = async () => {
    const res = await editDocument("info", "info", {
      infoText: info,
    });
    if (res.error) {
      snackbar.enqueueSnackbar("Änderungen werden nicht gespeichert", {
        variant: "error",
      });
    } else {
      snackbar.enqueueSnackbar("Änderungen gespeichert", {
        variant: "success",
      });
    }
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInfo(event.target.value);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Stack spacing={3} sx={{ p: 5 }}>
          <Typography variant="h5">Information</Typography>
          <Paper>
            <Typography>{info}</Typography>
          </Paper>
          {auth.currentUser && (
            <>
              <TextareaAutosize
                aria-label="empty textarea"
                minRows={2}
                style={{ width: "100%" }}
                value={info}
                onChange={handleChangeText}
              />
              <Button variant="contained" onClick={handleSubmit}>
                Info ändern
              </Button>
            </>
          )}
        </Stack>
        <Grid item>
          <Standings />
        </Grid>
      </Grid>
    </>
  );
};

export default Homes;
