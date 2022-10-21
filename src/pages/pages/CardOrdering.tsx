import { Button, Grid, Divider, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { deleteDocument } from "../api/database";
import { useSnackbar } from "notistack";
import styled from "@emotion/styled";
import { getAuth } from "firebase/auth";

import { storageKeyPrefix } from "../../config/settings";
import { validateObj } from "../utils/validation";
import AlertDialog from "../components/Confirmation";
import CardTable from "../components/CardTable";
import { CardOrder } from "../types/Cards";
import { setLocalStorage } from "../utils/storage";

const StyledButton = styled(Button)({
  marginBottom: 30,
});

const StyledTextField = styled(TextField)({
  marginRight: 10,
});

const storageKeyCardOrder = `${storageKeyPrefix}cardorder`;

const initCardOrder: CardOrder = {
  id: "",
  comment: "",
  name: "",
  amount: 0,
  matchId: "",
  regularCardNumber: "",
};

type Props = {};

const CardOrdering = (props: Props) => {
  const snackbar = useSnackbar();
  const auth = getAuth();
  const [cardOrder, setCardOrder] = useState<CardOrder>(initCardOrder);
  const [currentOrder, setCurrentOrder] = useState<CardOrder | null>(null);
  const [cards, setCards] = useState<CardOrder[]>([]);
  const [error, setError] = useState("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [editing, setEditing] = React.useState(false);

  const handleChangeOrder = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = event.target;

    if (!value || value.length === 0) {
      return;
    }

    let _value = value as string | number;

    setCardOrder((old) => ({ ...old, [id]: _value }));
  };

  const handleSubmitOrder = async () => {
    const validate = validateObj(cardOrder);
    if (validate.error) {
      setError(validate.error);
    }

    let res;

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
            // matchId: currentMatch?.currentMatchId,
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
            <Typography variant="h6">Name</Typography>
            <StyledTextField
              id="name"
              value={cardOrder?.name}
              onChange={handleChangeOrder}
              //   error={!!error}
              //   helperText={error && "Incorrect entry."}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6">Werder Stammkartnummer</Typography>
            <StyledTextField
              id="name"
              value={cardOrder?.regularCardNumber}
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
