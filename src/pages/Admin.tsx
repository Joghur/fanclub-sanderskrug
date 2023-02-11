import { Divider, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { deleteDocument, editDocument } from 'src/utils/api/database';
import { useExtraCardsOrder, useNextMatch } from 'src/utils/hooks';
import { CardOrder } from 'src/utils/types/Cards';

import CardTable from './components/admin/CardTable';
import CardownerPart from './components/admin/CartownerPart';

const Admin = () => {
    const theme = useTheme();
    const auth = getAuth();
    const [nextMatch] = useNextMatch();

    // const [currentOrder, setCurrentOrder] = useState<CardOrder | null>(null);
    // const [openAlert, setOpenAlert] = useState(false);

    const [cards] = useExtraCardsOrder(nextMatch.gameId);

    const mobile = useMediaQuery(theme.breakpoints.down('sm'));
    console.log('nextMatch', nextMatch);

    // const handleOpenAlert = () => {
    //     setOpenAlert(true);
    // };

    // const handleCloseAlert = () => {
    //     setOpenAlert(false);
    // };

    // const handleEditOrder = async (order: CardOrder) => {
    //     if (order?.id) {
    //         await editDocument('cards', order.id, order);
    //     }
    // };

    // const handleDeleteOrder = async (order: CardOrder) => {
    //     setCurrentOrder(order);
    //     // handleOpenAlert();
    // };

    // const deleteOrder = async (order: CardOrder) => {
    //     if (order?.id) {
    //         const res = await deleteDocument('cards', order.id);
    //         if (res.success) {
    //             setCards(old => old.filter(o => o.id !== order.id));
    //             snackbar.enqueueSnackbar('Bestellung is geløscht', {
    //                 variant: 'success',
    //             });
    //         }
    //     }
    // };

    return (
        <Stack alignItems="center" spacing={3} sx={{ py: 5, px: mobile ? 5 : 0, alignItems: 'center' }}>
            {auth.currentUser && (
                <>
                    <Typography variant="h5">Bestellungen für die nächste spiel</Typography>
                    {(!nextMatch.gameId || !nextMatch.active) && (
                        <Stack>
                            {auth.currentUser && (
                                <Typography variant="h6">Karteninhaber können keine Zusatzkarten bestellen</Typography>
                            )}
                        </Stack>
                    )}
                    {/* {nextMatch.active && ( */}
                    <>
                        {nextMatch.gameId && <CardownerPart gameId={nextMatch.gameId} />}
                        <Divider variant="middle" />
                        {cards.length > 0 && <CardTable cards={cards} nextMatch={nextMatch} />}
                        {cards.length === 0 && <Typography variant="h5">Keine bestellungen</Typography>}
                    </>
                    {/* )} */}
                </>
            )}
        </Stack>
    );
};

export default Admin;
