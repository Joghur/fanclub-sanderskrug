import { Divider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { queryDocuments } from 'src/utils/api/database';

import { CardOrder } from '../../../utils/types/Cards';
import { NextMatch } from '../../../utils/types/Game';

import CardTable from './CardTable';

interface Props {
    gameId: string;
    nextMatch: NextMatch;
}

function AdminPart({ gameId, nextMatch }: Props) {
    const [cards, setCards] = useState<CardOrder[]>([]);

    const fetchingCards = async () => {
        const dbCards = await queryDocuments('cards', 'gameId', '==', gameId);

        if (dbCards.success) {
            const _cards = dbCards.success;
            setCards(_cards);
            return;
        }
        console.log('Error in Cards: ', dbCards.error);
    };

    useEffect(() => {
        fetchingCards();
    }, []);

    return (
        <>
            <Divider variant="middle" />
            <Typography variant="h5">Admins abteilung</Typography>
            <CardTable cards={cards} nextMatch={nextMatch} />
        </>
    );
}

export default AdminPart;
