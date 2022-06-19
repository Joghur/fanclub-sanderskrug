import {
  Button,
  Grid,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { Timestamp } from "firebase/firestore/lite";
import { Box } from "@mui/system";
import FolderIcon from "@mui/icons-material/Folder";
import React, { useEffect, useState } from "react";
import {
  fetchDocuments,
  queryDocuments,
  editDocument,
  saveData,
} from "../api/database";
import { useSnackbar } from "notistack";
import styled from "@emotion/styled";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { werderData } from "../../config/settings";
import { format } from "date-fns";
import { validateObj } from "../utils/validation";

const StyledTextField = styled(TextField)({
  marginBottom: 10,
  marginRight: 10,
});

const StyledButton = styled(Button)({
  marginBottom: 30,
  marginLeft: 19,
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type CardOrder = {
  id?: string;
  amount?: number;
  comment?: string;
  matchId?: string;
  name?: string;
};

type MatchInfo = {
  currentMatchId?: string;
  id: string;
  matchDate: Timestamp;
  homeAway: string;
  location: string;
  league: string;
};

type Props = {};

const CardOrdering = (props: Props) => {
  const snackbar = useSnackbar();
  const auth = getAuth();
  const [cardInfo, setCardInfo] = useState("");
  const [cardOrder, setCardOrder] = useState<CardOrder>({ amount: 0 });
  const [cards, setCards] = useState<CardOrder[]>([]);
  const [currentMatch, setCurrentMatch] = useState<MatchInfo | null>(null);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");

  const fetchingStartInfo = async () => {
    const info = await queryDocuments("info", "cardInfoText", "!=", "");
    const current = await queryDocuments("cards", "currentMatchId", "!=", "");

    if (info.success.length === 1) {
      setCardInfo(info.success[0].cardInfoText);
    }

    if (current.success.length === 1) {
      setCurrentMatch(current.success[0]);
    }
  };

  const fetchingCards = async () => {
    if (currentMatch?.currentMatchId) {
      const cards = await queryDocuments(
        "cards",
        "matchId",
        "==",
        currentMatch?.currentMatchId
      );

      if (cards.success.length > 0) {
        setCards(cards.success);
      }
    }
  };

  useEffect(() => {
    fetchingStartInfo();
  }, []);

  useEffect(() => {
    fetchingCards();
  }, [currentMatch?.currentMatchId]);

  const handleChangeOrder = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = event.target;

    if (!value || value.length === 0) {
      return;
    }

    let _value = value as string | number;

    setCardOrder((old) => ({ ...old, [id]: _value }));
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCardInfo(event.target.value);
  };

  const handleSubmitOrder = async () => {
    const validate = validateObj(cardOrder);

    if (validate.error) {
      setError(validate.error);
    }

    const res = await saveData("cards", {
      ...cardOrder,
      matchId: currentMatch?.currentMatchId,
    });
    if (res.error) {
      snackbar.enqueueSnackbar("Änderungen werden nicht gespeichert", {
        variant: "error",
      });
    } else {
      snackbar.enqueueSnackbar("Deine karte is bestellt", {
        variant: "success",
      });
      if (!cardOrder) {
        return;
      }
      setCards((old) => [
        ...old,
        {
          ...cardOrder,
          matchId: currentMatch?.currentMatchId,
        },
      ]);
    }
  };

  const handleSubmitInfo = async () => {
    const res = await editDocument("info", "cardInfo", {
      cardInfoText: cardInfo,
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

  console.log("cardOrder", cardOrder);
  console.log("validated", validated);

  return (
    <Box>
      <Grid container direction="column" spacing={3} sx={{ p: 5 }}>
        <Grid item>
          <Typography variant="h5">Kartenvorbestellung</Typography>
        </Grid>
        <Grid item>
          <Paper style={{ width: "75%", padding: 10 }}>
            <Typography>{cardInfo}</Typography>
          </Paper>
        </Grid>
        <Grid container direction="column" item>
          <Grid item>
            <Typography variant="h5">Nächste spiel:</Typography>
          </Grid>
          <Grid item sx={{ pb: 5 }}>
            <Typography>
              {currentMatch?.homeAway === "home" ? "Heim" : "Auswärts"}
            </Typography>
            <Typography>Location: {currentMatch?.location}</Typography>
            <Typography>
              {currentMatch?.matchDate &&
                `Am: ${format(
                  currentMatch.matchDate.seconds * 1000,
                  "dd/MM-yyyy"
                )}`}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" item sx={{ pb: 5 }}>
          <Grid item>
            <Typography>Nahme</Typography>
            <StyledTextField
              id="name"
              value={cardOrder?.name}
              onChange={handleChangeOrder}
              error={!!error}
              helperText={error && "Incorrect entry."}
            />
          </Grid>
          <Grid item>
            <Typography>Anzahl</Typography>
            <StyledTextField
              id="amount"
              type="number"
              value={cardOrder?.amount}
              onChange={handleChangeOrder}
              error={!!error}
              helperText={error && "Incorrect entry."}
            />
          </Grid>
          <Grid item>
            <Typography>Kommentar zur bestellung (Optional)</Typography>
            <StyledTextField
              id="comment"
              value={cardOrder?.comment}
              onChange={handleChangeOrder}
            />
          </Grid>
          <Grid item>
            <StyledButton
              variant="contained"
              onClick={handleSubmitOrder}
              disabled={!cardOrder || !validated}
              sx={{ marginTop: 3, height: 58 }}
            >
              Karte bestellen
            </StyledButton>
          </Grid>
        </Grid>
        {auth.currentUser && (
          <>
            <Divider variant="middle" />
            <Grid item>
              <Typography variant="h5">Admins abteilung</Typography>
            </Grid>
            <Grid item>
              <TableContainer component={Paper}>
                <Table aria-label="simple table" size="small">
                  <TableHead>
                    <StyledTableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Nahme</TableCell>
                      <TableCell>Anzahl</TableCell>
                      <TableCell>Kommentare</TableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {cards.map((row: CardOrder, index) => (
                      <>
                        <StyledTableRow key={row.name}>
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.amount}</TableCell>
                          <TableCell>{row.comment}</TableCell>
                        </StyledTableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid container direction="column" item>
              <Grid item>
                <StyledTextField
                  label="Kartenvorbestellung info text"
                  minRows={2}
                  multiline
                  style={{ width: "75%" }}
                  value={cardInfo}
                  onChange={handleChangeText}
                />
              </Grid>
              <Grid item>
                <StyledButton variant="contained" onClick={handleSubmitInfo}>
                  Info ändern
                </StyledButton>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default CardOrdering;
