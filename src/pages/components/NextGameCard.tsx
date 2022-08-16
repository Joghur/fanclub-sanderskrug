import { Button, Dialog, Paper, Stack, TextareaAutosize, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import { getAuth } from "firebase/auth";
import styled from "@emotion/styled";

import { editDocument, queryDocuments } from "../api/database";

const StyledButton = styled(Button)({
    marginBottom: 30,
  });
  
  const StyledTextField = styled(TextField)({
    marginRight: 10,
  });

type Props = {};

function NextGameCard({}: Props) {
  const snackbar = useSnackbar();
  const auth = getAuth();

  const [showSpieleDialog, setShowSpieleDialog] = useState(false);
  const [spieleInfo, setSpieleInfo] = useState("");

  const fetchingStartInfo = async () => {
    const spieleInfo = await queryDocuments("info", "cardInfoText", "!=", "");

    if (spieleInfo.success.length === 1) {
      setSpieleInfo(spieleInfo.success[0].cardInfoText);
    }
  };

  useEffect(() => {
    fetchingStartInfo();
  }, []);

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
      {auth.currentUser && (
          <>
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
    </>
  );
}

export default NextGameCard;
