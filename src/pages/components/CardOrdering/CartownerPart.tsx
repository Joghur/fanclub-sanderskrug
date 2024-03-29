/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Alert, Skeleton, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { storageKeyPrefix } from 'src/config/settings';
import { editDocument, saveData } from 'src/utils/api/database';
import { getLocalStorage, setLocalStorage } from 'src/utils/localStorage';
import { StyledTextField, StyledButton } from 'src/utils/styles';
import { CardOrder } from 'src/utils/types/Cards';

const storageKeyCardOrder = `${storageKeyPrefix}cardorder`;
const storageKeyCardOwner = `${storageKeyPrefix}cardOwner`;

interface Props {
    gameId: string;
}

const CardownerPart = ({ gameId }: Props) => {
    const snackbar = useSnackbar();

    const [cardOrder, setCardOrder] = useState<CardOrder | null>({ ...getLocalStorage(storageKeyCardOwner) } || null);
    const [submittedCardOrder, setSubmittedCardOrder] = useState<CardOrder | null>(
        getLocalStorage(storageKeyCardOrder) || null,
    );
    const [loading, setLoading] = useState(false);

    const handleSubmitOrder = async () => {
        let res;
        if (cardOrder?.id) {
            res = await editDocument('cards', cardOrder.id, {
                gameId: gameId,
                ...cardOrder,
            });
        } else {
            res = await saveData<CardOrder>('cards', {
                gameId: gameId,
                ...cardOrder,
            });
        }
        setLoading(() => true);
        if (res.error) {
            snackbar.enqueueSnackbar('Änderungen werden nicht gespeichert', {
                variant: 'error',
            });
        } else {
            snackbar.enqueueSnackbar('Deine karte is bestellt', {
                variant: 'success',
            });
            if (!cardOrder) {
                return;
            }

            setLocalStorage(storageKeyCardOrder, {
                ...cardOrder,
                gameId: gameId,
            });
            setLocalStorage(storageKeyCardOwner, {
                name: cardOrder.name,
                regularCardNumber: cardOrder.regularCardNumber,
            });
            setSubmittedCardOrder(() => ({ ...cardOrder, gameId: gameId }));
        }
        setLoading(() => false);
    };

    const handleChangeOrder = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { id, value } = event.target;
        if (!value || value.length === 0) {
            return;
        }

        const _value = value as string | number;

        setCardOrder(old => ({ ...old, [id]: _value }));
    };

    if (loading) {
        return <Skeleton variant="text" />;
    }

    return (
        <>
            {submittedCardOrder && submittedCardOrder?.gameId === gameId && (
                <Stack>
                    <Typography>Sie haben für dieses Spiel Folgendes extrakarte bestellt</Typography>
                    <Typography>
                        <b>Name</b>: {submittedCardOrder.name!} (Stammkartennummer:{' '}
                        {submittedCardOrder.regularCardNumber!})
                    </Typography>
                    <Typography></Typography>
                    <Typography>
                        <b>Anzahl</b>: {submittedCardOrder.amount!}
                    </Typography>
                    <Typography>
                        <b>Kommentar</b>: {submittedCardOrder.comment!}
                    </Typography>
                    <Alert color="info">Es ist noch nicht möglich, diese Bestellung zu ändern oder löschen</Alert>
                </Stack>
            )}
            {(!submittedCardOrder || submittedCardOrder?.gameId !== gameId) && (
                <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ pb: 5 }}>
                    <Stack>
                        <Typography variant="h6">Name</Typography>
                        <StyledTextField id="name" value={cardOrder?.name || ''} onChange={handleChangeOrder} />
                    </Stack>
                    <Stack>
                        <Typography variant="h6">Werder Stammkartennummer</Typography>
                        <StyledTextField
                            id="regularCardNumber"
                            type="number"
                            value={cardOrder?.regularCardNumber || 0}
                            onChange={handleChangeOrder}
                        />
                    </Stack>
                    <Stack>
                        <Typography variant="h6">Anzahl</Typography>
                        <StyledTextField
                            id="amount"
                            type="number"
                            value={cardOrder?.amount || 0}
                            onChange={handleChangeOrder}
                        />
                    </Stack>
                    <Stack>
                        <Typography variant="h6">Kommentar zur bestellung</Typography>
                        <Typography>(Optional)</Typography>
                        <StyledTextField id="comment" value={cardOrder?.comment || ''} onChange={handleChangeOrder} />
                    </Stack>
                    <StyledButton
                        variant="contained"
                        onClick={handleSubmitOrder}
                        disabled={
                            !cardOrder ||
                            cardOrder.name === '' ||
                            cardOrder.amount === 0 ||
                            cardOrder.regularCardNumber === undefined
                        }
                        sx={{ height: 58 }}
                    >
                        Karte bestellen
                    </StyledButton>
                    <Alert color="info">Es ist noch nicht möglich, diese Bestellung zu ändern oder löschen</Alert>
                </Stack>
            )}
        </>
    );
};

export default CardownerPart;
