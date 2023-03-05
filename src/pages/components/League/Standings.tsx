import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useEffect } from 'react';

import { useStandings } from 'src/utils/hooks';
import { Standing } from 'src/utils/types/Standing';
import { thisYear } from 'src/utils/utilities';

const MobileTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        fontSize: 14,
        padding: 1,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        padding: 3,
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

interface Props {
    league: string;
    year: string;
    setLeague: (event: SelectChangeEvent) => void;
    setYear: (event: SelectChangeEvent) => void;
    setAmountOfTeams: (arg: number) => void;
}

const Standings = ({ year, league, setLeague, setYear, setAmountOfTeams }: Props) => {
    const theme = useTheme();

    const [standings, loading] = useStandings(league, year);

    const mobile = useMediaQuery(theme.breakpoints.down('sm'));
    const pc = !mobile;

    useEffect(() => {
        if (standings.length > 0) {
            setAmountOfTeams(standings.length);
        }
    }, [standings.length]);

    if (loading) {
        return null;
    }

    return (
        <Grid container direction="column" justifyContent="center">
            <Grid container direction="row" justifyContent="center">
                <Grid item sx={{ marginTop: 2 }}>
                    <FormControl>
                        <InputLabel>Saison</InputLabel>
                        <Select
                            id="select-year"
                            value={year}
                            label="Saison"
                            onChange={setYear}
                            autoWidth
                            variant="outlined"
                        >
                            {[...Array(12)].map((_, i) => (
                                <MenuItem value={`${thisYear - i}`} key={`${thisYear}${i}`}>
                                    {`${thisYear - i}`}/{`${thisYear - i + 1}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sx={{ marginTop: 2 }}>
                    <FormControl>
                        <InputLabel>Liga</InputLabel>
                        <Select
                            id="select-league"
                            value={league}
                            label="Liga"
                            onChange={setLeague}
                            autoWidth
                            variant="outlined"
                        >
                            <MenuItem value="bl1">1. Bundesliga</MenuItem>
                            <MenuItem value="bl2">2. Bundesliga</MenuItem>
                            <MenuItem value="bl3">3. Bundesliga</MenuItem>
                            <MenuItem value="dfb">DFB-Pokal</MenuItem>
                            <MenuItem value="uefacl">Champions League</MenuItem>
                            <MenuItem value="wm">WM Katar</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            {standings.length === 0 && (
                <Grid item sx={{ marginTop: 2 }}>
                    <Typography variant="h5">Keine Daten für dieses Jahr / diese Liga</Typography>
                </Grid>
            )}
            {standings.length > 0 && (
                <Grid item sx={{ marginTop: 2 }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" size="small">
                            <TableHead>
                                <StyledTableRow>
                                    {pc && (
                                        <>
                                            <TableCell align="center">Platz</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell align="center">Club</TableCell>
                                            <TableCell align="center">Spiele</TableCell>
                                            <TableCell align="center">Punkte</TableCell>
                                            <TableCell align="center">Siege</TableCell>
                                            <TableCell align="center">Unentschieden</TableCell>
                                            <TableCell align="center">Niederlagen</TableCell>
                                            <TableCell align="center">Tore (Diff)</TableCell>
                                        </>
                                    )}
                                    {mobile && (
                                        <>
                                            <MobileTableCell align="center">Platz</MobileTableCell>
                                            <MobileTableCell align="center">Club</MobileTableCell>
                                            <MobileTableCell align="center">Punkte</MobileTableCell>
                                            <MobileTableCell align="center">S/U/N</MobileTableCell>
                                            <MobileTableCell align="center">Tore</MobileTableCell>
                                        </>
                                    )}
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {standings.map((row: Standing, index: number) => {
                                    const isWerder = row.teamName === 'Werder Bremen';

                                    return (
                                        <StyledTableRow
                                            sx={{
                                                ...(isWerder && {
                                                    boxShadow: '1px 2px 9px gray',
                                                    backgroundColor: 'lightgreen',
                                                }),
                                            }}
                                            key={row.teamInfoId}
                                        >
                                            {pc && (
                                                <>
                                                    <TableCell component="th" scope="row" align="center">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <img src={row.teamIconUrl} height="35" alt="" />
                                                    </TableCell>
                                                    <TableCell align="center">{row.teamName}</TableCell>
                                                    <TableCell align="center">{row.matches}</TableCell>
                                                    <TableCell align="center">{row.points}</TableCell>
                                                    <TableCell align="center">{row.won}</TableCell>
                                                    <TableCell align="center">{row.draw}</TableCell>
                                                    <TableCell align="center">{row.lost}</TableCell>
                                                    <TableCell align="center">
                                                        {`${row.goals} - ${row.opponentGoals} (${row.goalDiff})`}
                                                    </TableCell>
                                                </>
                                            )}
                                            {mobile && (
                                                <>
                                                    <MobileTableCell component="th" scope="row" align="center">
                                                        {index + 1}
                                                    </MobileTableCell>
                                                    <MobileTableCell align="center">
                                                        {row.shortName ? row.shortName : row.teamName}
                                                    </MobileTableCell>
                                                    <MobileTableCell align="center">{row.points}</MobileTableCell>
                                                    <MobileTableCell align="center">{`${row.won}/${row.draw}/${row.lost}`}</MobileTableCell>
                                                    <MobileTableCell align="center">
                                                        {`${row.goals}-${row.opponentGoals}`}
                                                    </MobileTableCell>
                                                </>
                                            )}
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            )}
        </Grid>
    );
};

export default Standings;
