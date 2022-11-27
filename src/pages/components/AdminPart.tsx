import { Divider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { queryDocuments } from '../api/database';
import { CardOrder } from '../types/Cards';
import { NextMatch } from '../types/Game';

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

    console.log('cards', cards);
    return (
        <>
            <Divider variant="middle" />
            <Typography variant="h5">Admins abteilung</Typography>
            <CardTable cards={cards} nextMatch={nextMatch} />
        </>
    );
}

export default AdminPart;
