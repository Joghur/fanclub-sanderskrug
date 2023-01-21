import styled from '@emotion/styled';
import {
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { colours } from 'src/utils/colours';

import { StyledButton } from '../../../utils/styles';
import { CardOrder } from '../../../utils/types/Cards';
import { NextMatch } from '../../../utils/types/Game';

const StyledTableRow = styled(TableRow)(() => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

interface Props {
    cards: CardOrder[];
    nextMatch: NextMatch;
    handleEdit?: (order: CardOrder) => Promise<void>;
    handleDelete?: (order: CardOrder) => Promise<void>;
}

const CardTable = ({ cards, nextMatch, handleEdit, handleDelete }: Props) => {
    const handlePrintDocument = () => {
        const input = document.getElementById('divToPrint');
        if (input) {
            html2canvas(input).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'pt', 'a4', false);
                pdf.addImage(imgData, 'PNG', 0, 0, 600, 0);
                if (nextMatch.gameId && nextMatch.opponent) {
                    pdf.save(`${nextMatch.gameId}-${nextMatch.opponent}.pdf`);
                }
            });
        }
    };
    return (
        <div>
            <StyledButton variant="contained" className="mb5" onClick={handlePrintDocument} sx={{ pb: 1 }}>
                Print und Speicher
            </StyledButton>
            <Stack spacing={1} id="divToPrint" className="mt4">
                <Stack direction="row">
                    <Typography variant="body2">
                        {`Werder gegen ${nextMatch.opponent} - ${format(
                            new Date(nextMatch.matchDate),
                            'dd/MMM-yyyy',
                        )} am ${format(new Date(nextMatch.matchDate), 'HH:mm')} uhr - ${nextMatch.location || ''}`}
                    </Typography>
                </Stack>
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
                                        {handleEdit && (
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleEdit(row)}
                                                sx={{
                                                    color: colours.black,
                                                    borderColor: colours.werderGreen,
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
                                        )}
                                        {handleDelete && (
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleDelete(row)}
                                                sx={{ color: colours.red, ml: 1, py: 1, borderColor: colours.red }}
                                            >
                                                Löschen
                                            </Button>
                                        )}
                                    </TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </div>
    );
};

export default CardTable;
