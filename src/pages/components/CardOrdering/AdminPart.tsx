import { Divider, Typography } from '@mui/material';

import { useExtraCardsOrder } from 'src/utils/hooks';

import { NextMatch } from '../../../utils/types/Game';

import CardTable from './CardTable';

interface Props {
    gameId: string;
    nextMatch: NextMatch;
}

function AdminPart({ gameId, nextMatch }: Props) {
    const [cards] = useExtraCardsOrder(gameId);

    return (
        <>
            <Divider variant="middle" />
            <Typography variant="h5">Admins abteilung</Typography>
            <CardTable cards={cards} nextMatch={nextMatch} />
        </>
    );
}

export default AdminPart;
