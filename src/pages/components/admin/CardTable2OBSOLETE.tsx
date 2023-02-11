/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Typography } from '@mui/material';
import { getFirestore, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { app } from 'src/utils/api/firebase';
import { useExtraCardsOrder } from 'src/utils/hooks';
import { CardOrder } from 'src/utils/types/Cards';

interface Props {
    nextGameId: string;
}

export const CardTable2 = ({ nextGameId }: Props) => {
    const [editingId, setEditingId] = useState('');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [comment, setComment] = useState('');
    const [gameId, setGameId] = useState('');
    const [regularCardNumber, setRegularCardNumber] = useState(0);

    const [cards] = useExtraCardsOrder(nextGameId);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(e.target.value));
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const handleGameIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameId(e.target.value);
    };

    const handletRegularCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegularCardNumber(Number(e.target.value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // if (editingId) {
        //   firebase
        //     .firestore()
        //     .collection('myCollection')
        //     .doc(editingId)
        //     .update({ name, date });
        //   setEditingId('');
        // } else {
        //   firebase.firestore().collection('myCollection').add({ name, date });
        // }
        // setName('');
        // setDate(new Date());
    };

    const handleEdit = (id: string) => {
        const data = cards.find(data => data.id === id);
        if (data) {
            setEditingId(id);
            setName(() => (data.name ? data.name : ''));
            setAmount(() => (data.amount ? data.amount : 0));
            setComment(() => (data.comment ? data.comment : ''));
            setGameId(() => (data.gameId ? data.gameId : ''));
            setRegularCardNumber(() => (data.regularCardNumber ? data.regularCardNumber : 0));
        }
    };

    const handleDelete = (id: string) => {
        // firebase
        //   .firestore()
        //   .collection('myCollection')
        //   .doc(id)
        //   .delete();
    };

    if (cards.length === 0) {
        return <div>Laden...</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={handleNameChange} />
                <input type="number" value={amount} onChange={handleAmountChange} />
                <input type="text" value={comment} onChange={handleCommentChange} />
                <input type="text" value={gameId} onChange={handleGameIdChange} />
                <input type="number" value={regularCardNumber} onChange={handletRegularCardNumberChange} />
                <button type="submit">Save</button>
            </form>
            <Typography>gameId: {gameId}</Typography>
            <ul>
                {cards?.map(data => (
                    <>
                        {data?.id && (
                            <li key={data.id}>
                                {data.name} - {data.amount?.toString()} - {data.comment} -{' '}
                                {data.regularCardNumber?.toString()}
                                <button type="button" onClick={() => handleEdit(data.id!)}>
                                    Edit
                                </button>
                                {/* <button type="button" onClick={() => handleDelete(data.id)}>
                                    Delete
                                </button> */}
                            </li>
                        )}
                    </>
                ))}
            </ul>
        </>
    );
};
