import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { editDocument, queryDocuments } from "../api/database";
import { logIn, logOut } from "../api/auth";
import { auth } from "../../config/firebase";
import { carlData } from "../../config/settings";

type cardInfo = {
  infoText;
};

type Props = {};

const Info = (props: Props) => {
  const snackbar = useSnackbar();
  const [info, setInfo] = useState("");
  const [initializing, setInitializing] = useState(true);
  const [authUser, setAuthUser] = useState<any>(null);

  const fetching = async () => {
    const info = await queryDocuments("info", "infoText", "!=", "");

    if (info.success.length === 1) {
      setInfo(info.success[0].infoText);
    }
  };

  useEffect(() => {
    fetching();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, (userObj) => {
      if (userObj) {
        setAuthUser(() => userObj);
      } else {
        setAuthUser(null);
      }
      setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  const handleChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInfo(event.target.value);
  };

  const handleSubmit = async () => {
    const res = await editDocument("info", "info", {
      infoText: info,
    });
    if (res.error) {
      snackbar.enqueueSnackbar("Änderungen werden nicht gespeichert", {
        variant: "error",
      });
    } else {
      snackbar.enqueueSnackbar("Änderungen gespeichert", {
        variant: "success",
      });
    }
  };

  const handleLogin = async () => {
    if (authUser) {
      await logOut();
    } else {
      await logIn(auth);
    }
  };

  return (
    <div
      style={{
        marginTop: 8,
        padding: 8,
        bottom: 60,
        left: 0,
        width: "100%",
      }}
    >
      <Box>
        <Container maxWidth="lg">
          <Grid container direction="column" spacing={3} sx={{ p: 5 }}>
            <Grid item>
              <Typography variant="h5">Information</Typography>
            </Grid>
            <Grid item>
              <Paper>
                <Typography>{info}</Typography>
              </Paper>
            </Grid>
            {authUser && (
              <Grid item>
                <TextareaAutosize
                  aria-label="empty textarea"
                  minRows={2}
                  style={{ width: "100%" }}
                  value={info}
                  onChange={handleChangeText}
                />
                <Button variant="contained" onClick={handleSubmit}>
                  Info ändern
                </Button>
              </Grid>
            )}
          </Grid>
          <Grid container spacing={5} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Paper elevation={1} style={{ padding: 10 }}>
                <Box borderBottom={1}>Kontakt</Box>
                <Box>{carlData.name}</Box>
                <Box>Mobil {carlData.mobile}</Box>
                <Box>Email {carlData.email}</Box>
              </Paper>
            </Grid>
            <Grid item>
              {authUser ? (
                <Button variant="outlined" onClick={handleLogin}>
                  Ausloggen
                </Button>
              ) : (
                <Button variant="outlined" onClick={handleLogin}>
                  Einloggen
                </Button>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Info;
