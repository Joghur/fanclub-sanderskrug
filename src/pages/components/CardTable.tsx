import styled from '@emotion/styled';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { CardOrder } from '../types/Cards';

const StyledTableRow = styled(TableRow)(() => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

interface Props {
    cards: CardOrder[];
    handleEdit: (order: CardOrder) => Promise<void>;
    handleDelete: (order: CardOrder) => Promise<void>;
}

const CardTable = (props: Props) => {
    const { cards, handleEdit, handleDelete } = props;

    return (
        <TableContainer component={Paper}>
            <Table aria-label="league table" size="small">
                <TableHead>
                    <StyledTableRow>
                        <TableCell></TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Anzahl</TableCell>
                        <TableCell>Stammkart nummer</TableCell>
                        <TableCell>Kommentare</TableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {cards.map((row: CardOrder, index) => (
                        <StyledTableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.amount}</TableCell>
                            <TableCell>{row.regularCardNumber}</TableCell>
                            <TableCell>{row.comment}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleEdit(row)}
                                    sx={{
                                        color: 'black',
                                        borderColor: 'blue',
                                        pl: 6,
                                        pr: 5,
                                        py: {
                                            xs: 2,
                                            md: 1,
                                        },
                                    }}
                                >
                                    Ändern
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleDelete(row)}
                                    sx={{ color: 'red', ml: 1, py: 1, borderColor: 'red' }}
                                >
                                    Löschen
                                </Button>
                            </TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CardTable;
