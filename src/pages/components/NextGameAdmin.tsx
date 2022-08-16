import {
  Button,
  Dialog,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Switch,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import { getAuth } from "firebase/auth";
import styled from "@emotion/styled";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";

import { NextMatch } from "../types/Game";
import { editDocument, queryDocuments, saveData } from "../api/database";

const StyledButton = styled(Button)({
  marginBottom: 30,
});

const StyledTextField = styled(TextField)({
  marginRight: 10,
});

type Props = {
  nextMatch: NextMatch;
  setNextMatch: (NextMatch) => void;
  setShowSpieleDialog: (boolean) => void;
};

function NextGameAdmin({
  nextMatch,
  setNextMatch,
  setShowSpieleDialog,
}: Props) {
  const snackbar = useSnackbar();
  const auth = getAuth();

  const handleChangeMatch = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = event.target;

    if (!value || value.length === 0) {
      return;
    }

    let _value = value as string | number;

    setNextMatch((old) => ({ ...old, [id]: _value }));
  };

  const handleChangeDate = (newValue: Date | null) => {
    setNextMatch((old) => ({ ...old, matchDate: newValue }));
  };

  const handleSubmitNextGameInfo = async () => {
    let res;
    if (nextMatch?.id) {
      res = await editDocument("match", nextMatch.id, {
        ...nextMatch,
      });
    } else {
      res = saveData("match", {
        ...nextMatch,
      });
    }
    console.log("res", res);
    if (res.error) {
      snackbar.enqueueSnackbar("Änderungen werden nicht gespeichert", {
        variant: "error",
      });
    } else {
      snackbar.enqueueSnackbar("Spiele Info is geändert", {
        variant: "success",
      });
    }
    setShowSpieleDialog(false);
  };

  return (
    <>
      {auth.currentUser && (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack>
              <Typography variant="h6">Gegen</Typography>
              <StyledTextField
                id="opponent"
                value={nextMatch.opponent}
                onChange={handleChangeMatch}
              />
              <FormGroup>
                <FormControlLabel
                  control={<Switch />}
                  label="Extrakarte möglich"
                />
                <FormControlLabel control={<Switch />} label="Bus fahren" />
              </FormGroup>
              <Typography variant="h6">Lokation</Typography>
              <StyledTextField
                id="location"
                value={nextMatch.location}
                onChange={handleChangeMatch}
                sx={{ mb: 5 }}
              />
              <DateTimePicker
                label="Spielzeit"
                inputFormat="dd/MM/yyyy"
                value={nextMatch.matchDate}
                ampm={false}
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
            <Stack spacing={2}>
              <StyledButton
                variant="contained"
                onClick={handleSubmitNextGameInfo}
              >
                Informationen zum nächsten Spiel ändern
              </StyledButton>
            </Stack>
          </LocalizationProvider>
        </>
      )}
    </>
  );
}

export default NextGameAdmin;
