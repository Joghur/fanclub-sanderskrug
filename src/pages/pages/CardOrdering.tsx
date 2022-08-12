import {
  Button,
  Grid,
  Divider,
  Paper,
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
  deleteDocument,
} from "../api/database";
import { useSnackbar } from "notistack";
import styled from "@emotion/styled";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";

import { storageKeyPrefix, werderData } from "../../config/settings";
import { validateObj } from "../utils/validation";
import AlertDialog from "../components/Confirmation";
import CardTable from "../components/CardTable";
import { CardOrder } from "../types/Cards";
import { setLocalStorage } from "../utils/storage";

const StyledTextField = styled(TextField)({
  marginRight: 10,
});

const StyledButton = styled(Button)({
  marginBottom: 30,
});

const storageKeyCardOrder = `${storageKeyPrefix}cardorder`;

type MatchInfo = {
  currentMatchId?: string;
  id: string;
  matchDate: Timestamp;
  homeAway: string;
  location: string;
  league: string;
};

type Props = {};

const initCardOrder: CardOrder = {
  id: "",
  comment: "",
  name: "",
  amount: 0,
  matchId: "",
};

const CardOrdering = (props: Props) => {
  const snackbar = useSnackbar();
  const auth = getAuth();
  const [cardInfo, setCardInfo] = useState("");
  const [cardOrder, setCardOrder] = useState<CardOrder>(initCardOrder);
  const [currentOrder, setCurrentOrder] = useState<CardOrder | null>(null);
  const [cards, setCards] = useState<CardOrder[]>([]);
  const [currentMatch, setCurrentMatch] = useState<MatchInfo | null>(null);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [editing, setEditing] = React.useState(false);

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

    let res;

    if (editing) {
      if (cardOrder.id) {
        res = await editDocument("cards", cardOrder.id, {
          ...cardOrder,
          matchId: currentMatch?.currentMatchId,
        });
      }
    } else {
      res = await saveData("cards", {
        ...cardOrder,
        matchId: currentMatch?.currentMatchId,
      });
    }

    if (res.error) {
      snackbar.enqueueSnackbar("Änderungen werden nicht gespeichert", {
        variant: "error",
      });
    } else {
      snackbar.enqueueSnackbar(
        editing ? "Deine karte is geändert" : "Deine karte is bestellt",
        {
          variant: "success",
        }
      );
      if (!cardOrder) {
        return;
      }

      setLocalStorage(storageKeyCardOrder, cardOrder);

      if (editing) {
        setCards((old) =>
          old.map((o) => {
            if (o.id === cardOrder.id) {
              return cardOrder;
            }
            return o;
          })
        );
      } else {
        setCards((old) => [
          ...old,
          {
            ...cardOrder,
            matchId: currentMatch?.currentMatchId,
          },
        ]);
      }
      setCardOrder(() => initCardOrder);
      setEditing(false);
      setCurrentOrder(null);
    }
  };

  const handleOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleEditOrder = async (order: CardOrder) => {
    setEditing(true);
    setCardOrder(order);
  };

  const handleDeleteOrder = async (order: CardOrder) => {
    setCurrentOrder(order);
    handleOpenAlert();
  };

  const deleteOrder = async (order: CardOrder) => {
    if (order?.id) {
      const res = await deleteDocument("cards", order.id);
      if (res.success) {
        setCards((old) => old.filter((o) => o.id !== order.id));
        snackbar.enqueueSnackbar("Bestellung is geløscht", {
          variant: "success",
        });
      }
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

  return (
    <Box>
      <Grid container direction="column" spacing={3} sx={{ p: 5 }}>
        <Grid item>
          <Typography variant="h5">Kartenvorbestellung</Typography>
        </Grid>
        <Grid
          container
          direction="column"
          item
          spacing={3}
          alignItems="center"
          justifyContent="center"
          sx={{ pb: 5 }}
        >
          <Grid item>
            <Typography variant="h5">Nächste spiel:</Typography>
          </Grid>
          <Grid item>
            <Paper>
              <Typography sx={{ p: 2 }}>{cardInfo}</Typography>
            </Paper>
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
          <Grid item>
            <Typography variant="h6">Nahme</Typography>
            <StyledTextField
              id="name"
              value={cardOrder?.name}
              onChange={handleChangeOrder}
              //   error={!!error}
              //   helperText={error && "Incorrect entry."}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6">Anzahl</Typography>
            <StyledTextField
              id="amount"
              type="number"
              value={cardOrder?.amount}
              onChange={handleChangeOrder}
              //   error={!!error}
              //   helperText={error && "Incorrect entry."}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6">Kommentar zur bestellung</Typography>
            <Typography>(Optional)</Typography>
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
              disabled={!cardOrder}
              sx={{ height: 58 }}
            >
              {editing ? "Karte ändern" : "Karte bestellen"}
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
              {
                <CardTable
                  cards={cards}
                  handleEdit={handleEditOrder}
                  handleDelete={handleDeleteOrder}
                />
              }
            </Grid>
            <Grid container direction="column" item sx={{ mt: 3 }}>
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
        {openAlert && (
          <AlertDialog
            header="Karte löschen"
            alertText="Möchten Sie diese Karte wirklich löschen? Daten können nicht
          wiederhergestellt werden"
            open={openAlert}
            onClose={handleCloseAlert}
            onAction={() => currentOrder && deleteOrder(currentOrder)}
          />
        )}
      </Grid>
    </Box>
  );
};

export default CardOrdering;
