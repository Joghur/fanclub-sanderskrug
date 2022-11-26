import { Grid, Typography, Skeleton, Stack, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { getAuth } from 'firebase/auth';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

import { storageKeyPrefix } from '../config/settings';

import { fetchDocument, deleteDocument, editDocument, saveData } from './api/database';
import CardTable from './components/CardTable';
import AlertDialog from './components/Confirmation';
import InfoCard from './components/InfoCard';
import NextGame from './components/NextGame';
import { CardOrder } from './types/Cards';
import { NextMatch } from './types/Game';
import { setLocalStorage } from './utils/localStorage';
import EditIcon from '@mui/icons-material/Edit';
import { validateObj } from './utils/validation';

const storageKeyCardOrder = `${storageKeyPrefix}cardorder`;

const initCardOrder: CardOrder = {
    id: '',
    comment: '',
    name: '',
    amount: 0,
    matchId: '',
    regularCardNumber: undefined,
};

export const initNextMatch: NextMatch = {
    gameId: '',
    matchDate: new Date(),
    location: '',
    matchDay: 0,
    matchType: 'other',
    opponent: '',
    nextMatch: false,
    active: false,
    busTour: false,
};

const CardOrdering = () => {
    const snackbar = useSnackbar();
    const auth = getAuth();
    const [cardOrder, setCardOrder] = useState<CardOrder>(initCardOrder);
    const [currentOrder, setCurrentOrder] = useState<CardOrder | null>(null);
    const [cards, setCards] = useState<CardOrder[]>([]);
    const [error, setError] = useState('');
    const [openAlert, setOpenAlert] = React.useState(false);
    const [editing, setEditing] = React.useState(false);
    const [nextMatch, setNextMatch] = useState<NextMatch>(initNextMatch);

    const fetchingStartInfo = async () => {
        const nextMatch = await fetchDocument('info', 'nextMatch');

        if (nextMatch.success) {
            const _nextMatch = nextMatch.success;
            _nextMatch.matchDate = new Date(_nextMatch.matchDate.seconds * 1000);
            setNextMatch(_nextMatch);
            return;
        }
        console.log('Error in NextMatch: ', nextMatch.error);
    };

    useEffect(() => {
        fetchingStartInfo();
    }, []);

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
        <Stack direction="column" spacing={3} sx={{ p: 5 }}>
            <NextGame nextMatch={nextMatch} setNextMatch={setNextMatch} />
            <InfoCard />
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
        </Stack>
    );
};

export default CardOrdering;
