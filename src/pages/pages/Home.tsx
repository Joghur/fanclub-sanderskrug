import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Paper,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { getAuth } from "firebase/auth";
import EditIcon from "@mui/icons-material/Edit";
import styled from "@emotion/styled";
import { Timestamp } from "firebase/firestore/lite";

import Standings from "../components/Standings";
import { editDocument, queryDocuments } from "../api/database";
import Games from "../components/Games";

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
  const auth = getAuth();

  const [showInformationDialog, setShowInformationDialog] = useState(false);
  const [showSpieleDialog, setShowSpieleDialog] = useState(false);
  const [info, setInfo] = useState("");
  const [spieleInfo, setSpieleInfo] = useState("");
  const [currentMatch, setCurrentMatch] = useState<MatchInfo | null>(null);

  useEffect(() => {
    fetchingStartInfo();
  }, []);

  const fetchingStartInfo = async () => {
    const info = await queryDocuments("info", "cardInfoText", "!=", "");
    const current = await queryDocuments("cards", "currentMatchId", "!=", "");

    if (info.success.length === 1) {
      setSpieleInfo(info.success[0].cardInfoText);
    }

    if (current.success.length === 1) {
      setCurrentMatch(current.success[0]);
    }
  };

  const fetching = async () => {
    const info = await queryDocuments("info", "infoText", "!=", "");

    if (info.success.length === 1) {
      setInfo(info.success[0].infoText);
    }
  };

  useEffect(() => {
    fetching();
  }, []);

  const handleSubmitInformation = async () => {
    const res = await editDocument("info", "info", {
      infoText: info,
    });
    setShowInformationDialog(false);

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

  const handleChangeInformationText = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInfo(event.target.value);
  };

  const handleChangeSpieleInformationText = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSpieleInfo(event.target.value);
  };

  const handleSubmitSpieleInfo = async () => {
    const res = await editDocument("info", "cardInfo", {
      cardInfoText: spieleInfo,
    });
    setShowSpieleDialog(false);

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

  return (
    <>
      <Stack spacing={3} alignItems="center" sx={{ p: 5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          spacing={15}
        >
          {info && (
            <Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5">Information</Typography>
                {auth.currentUser && (
                  <EditIcon onClick={() => setShowInformationDialog(true)} />
                )}
              </Stack>
              <Paper sx={{ p: 3 }}>
                <Typography variant="body1">{info}</Typography>
              </Paper>
            </Stack>
          )}
          {spieleInfo && (
            <Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5">Nächste spiel</Typography>
                {auth.currentUser && (
                  <EditIcon onClick={() => setShowSpieleDialog(true)} />
                )}
              </Stack>
              <Paper sx={{ p: 2 }}>
                <Typography>{spieleInfo}</Typography>
              </Paper>
            </Stack>
          )}
        </Stack>

        <Games url="https://api.openligadb.de/getmatchdata/bl1/2022/2" />
        {auth.currentUser && (
          <>
            <Dialog open={showInformationDialog}>
              <Paper sx={{ p: 5 }}>
                <Stack spacing={2}>
                  <TextareaAutosize
                    aria-label="empty textarea"
                    minRows={2}
                    value={info}
                    onChange={handleChangeInformationText}
                  />
                  <Button variant="contained" onClick={handleSubmitInformation}>
                    Info ändern
                  </Button>
                </Stack>
              </Paper>
            </Dialog>
            <Dialog open={showSpieleDialog}>
              <Paper sx={{ p: 5 }}>
                <Stack spacing={2}>
                  <StyledTextField
                    label="Kartenvorbestellung info text"
                    minRows={2}
                    multiline
                    style={{ width: "75%" }}
                    value={spieleInfo}
                    onChange={handleChangeSpieleInformationText}
                  />
                  <StyledButton
                    variant="contained"
                    onClick={handleSubmitSpieleInfo}
                  >
                    Info ändern
                  </StyledButton>
                </Stack>
              </Paper>
            </Dialog>
          </>
        )}
        <Standings />
      </Stack>
    </>
  );
};

export default Homes;
