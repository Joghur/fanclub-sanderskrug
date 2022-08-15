import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  tableCellClasses,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Typography,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

import { apiFetch } from "../api/axios";
import { bundesligaData } from "../../config/settings";
import { thisSeason, thisYear } from "../utils/utilities";
import { Standing } from "../types/Standing";
import { getLeagueStatus } from "../utils/werder";

const MobileTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
    padding: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 3,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type Props = {
  blString?: string;
  useYear?: string;
};

const Standings = ({ blString, useYear }: Props) => {
  const theme = useTheme();

  const [year, setYear] = useState<string>(useYear || thisSeason);
  const [league, setLeague] = useState("");
  const [standings, setStandings] = useState<Standing[]>([]);

  useEffect(() => {
    (async function () {
      const _league = await getLeagueStatus();

      if (_league) {
        setLeague(_league);
      }
    })();
  }, []);

  useEffect(() => {
    if (league) {
      let standingsUrl = `${bundesligaData.endpoint}/getbltable/${league}/${year}`;
      if (league === "dfb") {
        standingsUrl = `${bundesligaData.endpoint}/getbltable/${league}${year}/${year}`;
      }

      apiFetch(standingsUrl)
        .then((result) => {
          setStandings(result.data);
        })
        .catch((error) => {
          return error;
        });
    }
  }, [year, league]);

  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value);
  };

  const handleChangeLeague = (event: SelectChangeEvent) => {
    setLeague(event.target.value);
  };

  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pc = !mobile;

  console.log("league", league);

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item sx={{ marginTop: 2 }}>
            <FormControl>
              <InputLabel>Saison</InputLabel>
              <Select
                id="select-year"
                value={year}
                label="Saison"
                onChange={handleChangeYear}
                autoWidth
                variant="outlined"
              >
                {[...Array(12)].map((_, i) => (
                  <MenuItem value={thisYear - i}>
                    {thisYear - i}/{thisYear - i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item sx={{ marginTop: 2 }}>
            <FormControl>
              <InputLabel>Liga</InputLabel>
              <Select
                id="select-year"
                value={league}
                label="Liga"
                onChange={handleChangeLeague}
                autoWidth
                variant="outlined"
              >
                <MenuItem value="bl1">1. Bundesliga</MenuItem>
                <MenuItem value="bl2">2. Bundesliga</MenuItem>
                <MenuItem value="bl3">3. Bundesliga</MenuItem>
                <MenuItem value="dfb">DFB-Pokal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {standings.length === 0 && (
          <>
            <Grid item sx={{ marginTop: 2 }}>
              <Typography variant="h5">
                Keine Daten für dieses Jahr / diese Liga
              </Typography>
            </Grid>
          </>
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
                  {standings.map((row: Standing, index) => {
                    const isWerder = row.TeamName === "Werder Bremen";

                    return (
                      <StyledTableRow
                        sx={{
                          ...(isWerder && {
                            boxShadow: "1px 2px 9px gray",
                            backgroundColor: "lightgreen",
                          }),
                        }}
                        key={row.TeamInfoId}
                      >
                        {pc && (
                          <>
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell align="center">
                              <img src={row.TeamIconUrl} height="35" alt="" />
                            </TableCell>
                            <TableCell align="center">{row.TeamName}</TableCell>
                            <TableCell align="center">{row.Matches}</TableCell>
                            <TableCell align="center">{row.Points}</TableCell>
                            <TableCell align="center">{row.Won}</TableCell>
                            <TableCell align="center">{row.Draw}</TableCell>
                            <TableCell align="center">{row.Lost}</TableCell>
                            <TableCell align="center">
                              {`${row.Goals} - ${row.OpponentGoals} (${row.GoalDiff})`}
                            </TableCell>
                          </>
                        )}
                        {mobile && (
                          <>
                            <MobileTableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {index + 1}
                            </MobileTableCell>
                            <MobileTableCell align="center">
                              {row.ShortName ? row.ShortName : row.TeamName}
                            </MobileTableCell>
                            <MobileTableCell align="center">
                              {row.Points}
                            </MobileTableCell>
                            <MobileTableCell align="center">{`${row.Won}/${row.Draw}/${row.Lost}`}</MobileTableCell>
                            <MobileTableCell align="center">
                              {`${row.Goals}-${row.OpponentGoals}`}
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
    </>
  );
};

export default Standings;
