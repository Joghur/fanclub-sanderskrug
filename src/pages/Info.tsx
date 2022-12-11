import { Box, Button, Container, Grid, Paper } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { useMeasure } from 'react-use';

import { krugImages } from 'src/config/imageKit';
import { useFirebaseAuth } from 'src/utils/hooks';

import { carlData } from '../config/settings';

import CarouselItems from './components/Info/CarouselItems';

const Info = () => {
    const [ref, { width }] = useMeasure<HTMLDivElement>();
    const [authUser, handleLogin, initializing] = useFirebaseAuth();

    if (initializing) {
        return null;
    }

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
                    <Box ref={ref} sx={{ p: 5 }}>
                        <Carousel fullHeightHover={true}>
                            {krugImages.map((item, i) => (
                                <CarouselItems key={i} item={item} containerWidth={width} />
                            ))}
                        </Carousel>
                    </Box>
                </Container>
            </Box>
        </div>
    );
};

export default Info;
