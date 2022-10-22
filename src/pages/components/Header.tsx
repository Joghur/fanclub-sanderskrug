import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import HomeRounded from '@mui/icons-material/HomeRounded';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Grid,
    IconButton,
    Menu,
    Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import { IKImage } from 'imagekitio-react';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMeasure } from 'react-use';

const Header = () => {
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [ref, { width }] = useMeasure<HTMLDivElement>();
    const [value, setValue] = useState('recents');

    const handleChange = useCallback(
        (event: React.SyntheticEvent, newValue: string) => {
            navigate(`/${newValue}`, { replace: true });
        },
        [navigate],
    );

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <>
            <Box
                ref={ref}
                sx={{
                    marginBottom: 2,
                    textAlign: 'center',
                }}
            >
                <IKImage
                    path="site/sanderskruglogo3_TOTHa4PN7.png"
                    transformation={[
                        {
                            width: width - 10 < 1000 ? width - 10 : 1000,
                        },
                    ]}
                    style={{
                        borderRadius: '50%',
                        borderWidth: 1,
                        border: '2px solid #73AD21',
                        boxShadow: '5px 10px 9px grey',
                    }}
                />
            </Box>
            <Box
                sx={{
                    marginBottom: 1,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5">Werder Bremen Fanclub</Typography>
            </Box>
            <BottomNavigation
                value={value}
                onChange={handleChange}
                showLabels={true}
                sx={{ display: { xs: 'flex', sm: 'none' } }}
            >
                <BottomNavigationAction label="Sander's Krug" value="" icon={<HomeRounded />} />
                <BottomNavigationAction label="Karten" value="kartenvorbestellung" icon={<AspectRatioIcon />} />
                <BottomNavigationAction label="Info" value="info" icon={<InfoIcon />} />
            </BottomNavigation>
            <AppBar position="static" style={{ backgroundColor: 'green' }} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            textAlign: 'center',
                        }}
                    >
                        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                            <Link to="/">
                                <img src="favicon.ico" alt="werder bremen" />
                            </Link>
                        </Box>
                        <Typography sx={{ minWidth: 100, display: { xs: 'none', sm: 'flex' } }}>
                            <Link to="kartenvorbestellung" style={{ color: 'white', textDecoration: 'none' }}>
                                Kartenvorbestellung
                            </Link>
                        </Typography>
                        <Typography sx={{ minWidth: 100, display: { xs: 'none', sm: 'flex' } }}>
                            <Link to="/info" style={{ color: 'white', textDecoration: 'none' }}>
                                Info
                            </Link>
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', sm: 'none' },
                            }}
                        ></Menu>
                    </Box>
                </Container>
            </AppBar>
        </>
    );
};

export default Header;
