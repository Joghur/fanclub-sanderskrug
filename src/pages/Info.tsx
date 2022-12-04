import { Box, Button, Container, Grid, Paper } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { useMeasure } from 'react-use';

import { krugImages } from 'src/config/imageKit';

import { auth } from '../config/firebase';
import { carlData } from '../config/settings';

import { logIn, logOut } from './api/auth';
import CarouselItems from './components/Info/CarouselItems';

const Info = () => {
    const [ref, { width }] = useMeasure<HTMLDivElement>();
    const [initializing, setInitializing] = useState(true);
    const [authUser, setAuthUser] = useState<any>(null);

    useEffect(() => {
        const auth = getAuth();
        const subscriber = onAuthStateChanged(auth, userObj => {
            if (userObj) {
                setAuthUser(() => userObj);
            } else {
                setAuthUser(null);
            }
            setInitializing(false);
        });
        return subscriber; // unsubscribe on unmount
    }, []);

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
                width: '100%',
            }}
        >
            <Box>
                <Container maxWidth="lg">
                    <Box ref={ref}>
                        <Carousel fullHeightHover={true}>
                            {krugImages.map((item, i) => (
                                <CarouselItems key={i} item={item} containerWidth={width} />
                            ))}
                        </Carousel>
                    </Box>
                    <Grid container spacing={5} justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <Paper elevation={1} style={{ padding: 10 }}>
                                <Box borderBottom={1}>Kontakt</Box>
                                <Box>{carlData.name}</Box>
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
