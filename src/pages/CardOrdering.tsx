import styled from '@emotion/styled';
import { Button, Grid, TextField, Typography, Skeleton, Stack, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { format } from 'date-fns';
import { getAuth } from 'firebase/auth';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import { storageKeyPrefix } from '../config/settings';

import { deleteDocument, editDocument, saveData } from './api/database';
import CardTable from './components/CardTable';
import AlertDialog from './components/Confirmation';
import { storageKeyNextMatch } from './components/NextGameAdmin';
import { CardOrder } from './types/Cards';
import { NextMatch } from './types/Game';
import { getLocalStorage, setLocalStorage } from './utils/localStorage';
import { validateObj } from './utils/validation';

const StyledButton = styled(Button)({
    marginBottom: 30,
});

const StyledTextField = styled(TextField)({
    marginRight: 10,
});

const storageKeyCardOrder = `${storageKeyPrefix}cardorder`;

const initCardOrder: CardOrder = {
    id: '',
    comment: '',
    name: '',
    amount: 0,
    matchId: '',
    regularCardNumber: undefined,
};

const CardOrdering = () => {
    const snackbar = useSnackbar();
    const auth = getAuth();
    const [cardOrder, setCardOrder] = useState<CardOrder>(initCardOrder);
    const [nextMatch] = useState<NextMatch>(getLocalStorage(storageKeyNextMatch)?.nextMatch);
    const [currentOrder, setCurrentOrder] = useState<CardOrder | null>(null);
    const [cards, setCards] = useState<CardOrder[]>([]);
    const [error, setError] = useState('');
    const [openAlert, setOpenAlert] = React.useState(false);
    const [editing, setEditing] = React.useState(false);

    const handleChangeOrder = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { id, value } = event.target;
        console.log('id', id);
        console.log('value', value);
        if (!value || value.length === 0) {
            return;
        }

        const _value = value as string | number;

        setCardOrder(old => ({ ...old, [id]: _value }));
    };

    console.log('error', error);
    console.log('nextMatch', nextMatch);

    const handleSubmitOrder = async () => {
        const validate = validateObj(cardOrder);
        if (validate.error) {
            setError(validate.error);
        }

        let res;
        if (cardOrder?.id) {
            res = await editDocument('cards', cardOrder.id, {
                ...cardOrder,
            });
        } else {
            res = await saveData('cards', {
                ...cardOrder,
            });
        }
        if (res.error) {
            snackbar.enqueueSnackbar('Änderungen werden nicht gespeichert', {
                variant: 'error',
            });
        } else {
            snackbar.enqueueSnackbar(editing ? 'Deine karte is geändert' : 'Deine karte is bestellt', {
                variant: 'success',
            });
            if (!cardOrder) {
                return;
            }

            setLocalStorage(storageKeyCardOrder, cardOrder);

            if (editing) {
                setCards(old =>
                    old.map(o => {
                        if (o.id === cardOrder.id) {
                            return cardOrder;
                        }
                        return o;
                    }),
                );
            } else {
                setCards(old => [
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
            const res = await deleteDocument('cards', order.id);
            if (res.success) {
                setCards(old => old.filter(o => o.id !== order.id));
                snackbar.enqueueSnackbar('Bestellung is geløscht', {
                    variant: 'success',
                });
                setLocalStorage(storageKeyCardOrder, initCardOrder);
            }
        }
    };

    if (!nextMatch) {
        return <Skeleton variant="text" />;
    }

    return (
        <Box>
            <Grid container direction="column" spacing={3} sx={{ p: 5 }}>
                <Stack
                    alignItems="center"
                    style={{
                        borderRadius: '50%',
                        borderWidth: 1,
                        border: '2px solid #73AD21',
                        boxShadow: '5px 10px 9px grey',
                        padding: 20,
                    }}
                >
                    <Typography variant="subtitle1">Werder gegen {nextMatch.opponent}</Typography>
                    {nextMatch?.matchDate && (
                        <>
                            <Typography variant="body2">
                                Am {format(new Date(nextMatch.matchDate), 'hh:mm')} uhr
                            </Typography>
                            <Typography variant="body2">
                                {format(new Date(nextMatch.matchDate), 'dd/MMM-yyyy')}
                            </Typography>
                            <Typography variant="body1">{nextMatch.location}</Typography>
                        </>
                    )}
                </Stack>
                <Grid item>
                    <Typography variant="h5">Kartenvorbestellung</Typography>
                </Grid>
                {!nextMatch.active && (
                    <Grid item>
                        <Typography variant="h6">Kein spiel</Typography>
                    </Grid>
                )}
                {nextMatch.active && (
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
                                // error={!!error}
                                // helperText={error && 'Incorrect entry.'}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">Werder Stammkartnummer</Typography>
                            <Typography>info kommt hier</Typography>
                            <StyledTextField
                                id="regularCardNumber"
                                type="number"
                                value={cardOrder?.regularCardNumber}
                                onChange={handleChangeOrder}
                                // error={!!error}
                                // helperText={error && 'Incorrect entry.'}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">Anzahl</Typography>
                            <StyledTextField
                                id="amount"
                                type="number"
                                value={cardOrder?.amount}
                                onChange={handleChangeOrder}
                                // error={!!error}
                                // helperText={error && 'Incorrect entry.'}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">Kommentar zur bestellung</Typography>
                            <Typography>(Optional)</Typography>
                            <StyledTextField id="comment" value={cardOrder?.comment} onChange={handleChangeOrder} />
                        </Grid>
                        <Grid item>
                            <StyledButton
                                variant="contained"
                                onClick={handleSubmitOrder}
                                disabled={!cardOrder}
                                sx={{ height: 58 }}
                            >
                                {editing ? 'Karte ändern' : 'Karte bestellen'}
                            </StyledButton>
                        </Grid>
                    </Grid>
                )}
                {auth.currentUser && nextMatch.active && (
                    <>
                        <Divider variant="middle" />
                        <Grid item>
                            <Typography variant="h5">Admins abteilung</Typography>
                        </Grid>
                        <Grid item>
                            <CardTable cards={cards} handleEdit={handleEditOrder} handleDelete={handleDeleteOrder} />
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
