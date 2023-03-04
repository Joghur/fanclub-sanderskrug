import { css, Theme } from '@emotion/react';
import BookOnline from '@mui/icons-material/BookOnline';
import HomeRounded from '@mui/icons-material/HomeRounded';
import MenuIcon from '@mui/icons-material/Menu';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import {
    AppBar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    IconButton,
    Menu,
    Stack,
    Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import { getAuth } from 'firebase/auth';
import { IKImage } from 'imagekitio-react';
import { useCallback, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMeasure } from 'react-use';

import { colours } from 'src/utils/colours';

interface MenuPosition {
    position: 'belowImage' | 'top';
}

const menu = css`
    position: fixed;
    top: 0;
    z-index: 101;
    transition: top 0.3s ease-in-out;
`;

const menuBelowImage = css`
    top: 100%;
`;

const Header = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({ position: 'belowImage' });

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [ref, { width }] = useMeasure<HTMLDivElement>();
    const [value, setValue] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const threshold = 300;
            const newPosition = scrollPosition > threshold ? 'top' : 'belowImage';
            setMenuPosition({ position: newPosition });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const handleChange = useCallback(
        (event: React.SyntheticEvent, newValue: string) => {
            setValue(newValue);
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
                            width: width - 10 < 1000 ? `${width} - 10` : `1000`,
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
                <BottomNavigationAction
                    label="Vorbestellung"
                    value=""
                    icon={
                        <BookOnline
                            sx={{
                                '& .Mui-selected': {
                                    fontSize: '0.75rem',
                                },
                            }}
                        />
                    }
                />
                {auth.currentUser && (
                    <BottomNavigationAction
                        label="Carl Admin"
                        value="admin"
                        icon={
                            <BookOnline
                                sx={{
                                    '& .Mui-selected': {
                                        fontSize: '0.75rem',
                                    },
                                }}
                            />
                        }
                    />
                )}
                <BottomNavigationAction
                    label="Liga"
                    value="liga"
                    icon={
                        <SportsSoccerIcon
                            sx={{
                                '& .Mui-selected': {
                                    fontSize: '0.75rem',
                                },
                            }}
                        />
                    }
                />
                <BottomNavigationAction
                    label="Sander's Krug"
                    value="info"
                    icon={
                        <HomeRounded
                            sx={{
                                '& .Mui-selected': {
                                    fontSize: '0.75rem',
                                },
                            }}
                        />
                    }
                />
            </BottomNavigation>
            <AppBar
                position="static"
                style={{ backgroundColor: colours.werderGreen }}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
                css={menuPosition.position === 'top' ? menu : menuBelowImage}
            >
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
                            <NavLink
                                to="/"
                                style={({ isActive }) => ({
                                    color: isActive ? colours.greenyellow : colours.white,
                                    textDecoration: 'none',
                                    boxShadow: isActive ? '1px 2px 3px 4px rgba(20,20,20,0.4)' : '',
                                })}
                            >
                                <Box
                                    alignItems="center"
                                    sx={{
                                        p: 2,
                                    }}
                                >
                                    <BookOnline
                                        sx={{
                                            '& .Mui-selected': {
                                                fontSize: '0.75rem',
                                            },
                                        }}
                                    />
                                    <Typography>Kartenvorbestellung</Typography>
                                </Box>
                            </NavLink>
                        </Box>
                        {auth.currentUser && (
                            <Box sx={{ minWidth: 100, display: { xs: 'none', sm: 'flex' } }}>
                                <NavLink
                                    to="admin"
                                    style={({ isActive }) => ({
                                        color: isActive ? colours.greenyellow : colours.white,
                                        textDecoration: 'none',
                                        boxShadow: isActive ? '1px 2px 3px 4px rgba(20,20,20,0.4)' : '',
                                    })}
                                >
                                    <Box
                                        alignItems="center"
                                        sx={{
                                            p: 2,
                                        }}
                                    >
                                        <SportsSoccerIcon
                                            sx={{
                                                '& .Mui-selected': {
                                                    fontSize: '0.75rem',
                                                },
                                            }}
                                        />
                                        <Typography>Carl Administrator</Typography>
                                    </Box>
                                </NavLink>
                            </Box>
                        )}
                        <Box sx={{ minWidth: 100, display: { xs: 'none', sm: 'flex' } }}>
                            <NavLink
                                to="liga"
                                style={({ isActive }) => ({
                                    color: isActive ? colours.greenyellow : colours.white,
                                    textDecoration: 'none',
                                    boxShadow: isActive ? '1px 2px 3px 4px rgba(20,20,20,0.4)' : '',
                                })}
                            >
                                <Box
                                    alignItems="center"
                                    sx={{
                                        p: 2,
                                    }}
                                >
                                    <SportsSoccerIcon
                                        sx={{
                                            '& .Mui-selected': {
                                                fontSize: '0.75rem',
                                            },
                                        }}
                                    />
                                    <Typography>Bundesliga</Typography>
                                </Box>
                            </NavLink>
                        </Box>
                        <Box sx={{ minWidth: 100, display: { xs: 'none', sm: 'flex' } }}>
                            <NavLink
                                to="/info"
                                style={({ isActive }) => ({
                                    color: isActive ? colours.greenyellow : colours.white,
                                    textDecoration: 'none',
                                    boxShadow: isActive ? '1px 2px 3px 4px rgba(20,20,20,0.4)' : '',
                                })}
                            >
                                <Stack alignItems="center">
                                    <img src="favicon.ico" alt="werder bremen" />
                                    <Typography>Sander&apos;s Krug</Typography>
                                </Stack>
                            </NavLink>
                        </Box>
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
