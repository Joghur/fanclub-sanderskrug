import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Grid,
  IconButton,
  Menu,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import InfoIcon from "@mui/icons-material/Info";
import HomeRounded from "@mui/icons-material/HomeRounded";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Container } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { IKImage } from "imagekitio-react";
import { useMeasure } from "react-use";

type Props = {};

const Header = (props: Props) => {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const [value, setValue] = useState("recents");

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      navigate(`/${newValue}`, { replace: true });
    },
    [navigate]
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      {/* <div ref={ref}>
        <IKImage
          path="site/sanderskrug_2INxFun7Z.png"
          transformation={[
            {
              width: width,
            },
          ]}
        />
      </div> */}
      {/* <div> */}
      <Box
        ref={ref}
        sx={{
          marginBottom: 2,
          textAlign: "center",
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
            borderRadius: "50%",
            borderWidth: 1,
            border: "2px solid #73AD21",
            boxShadow: "5px 10px 9px grey",
            // position: "fixed",
            // left: 0,
            // top: 0,
          }}
        />
      </Box>
      <Box
        sx={{
          marginBottom: 1,
          textAlign: "center",
        }}
      >
        <Typography variant="h5">Werder Bremen Fanclub</Typography>
      </Box>
      {/* </div> */}
      {/* <Box borderBottom={1} sx={{ display: { xs: "flex", sm: "none" } }}> */}
      {/* <div
          style={{
            marginTop: 8,
            padding: 8,
            position: "fixed",
            width: "100%",
            //   top: 0,
            left: 0,
          }}
        > */}
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels={true}
        sx={{ display: { xs: "flex", sm: "none" } }}
      >
        <BottomNavigationAction
          label="Sander's Krug"
          value=""
          icon={<HomeRounded />}
        />
        <BottomNavigationAction
          label="Karten"
          value="kartenvorbestellung"
          icon={<AspectRatioIcon />}
        />
        <BottomNavigationAction
          label="Zeiten"
          value="abfahrtzeiten"
          icon={<ScheduleIcon />}
        />
        <BottomNavigationAction label="Info" value="info" icon={<InfoIcon />} />
      </BottomNavigation>
      {/* </div> */}
      {/* </Box> */}
      <AppBar
        position="static"
        style={{ backgroundColor: "green" }}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              textAlign: "center",
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "flex" } }}>
              <Link to="/">
                <img src="favicon.ico" alt="werder bremen" />
              </Link>
            </Box>
            <Typography
              sx={{ minWidth: 100, display: { xs: "none", sm: "flex" } }}
            >
              <Link
                to="kartenvorbestellung"
                style={{ color: "white", textDecoration: "none" }}
              >
                Kartenvorbestellung
              </Link>
            </Typography>
            <Typography
              sx={{ minWidth: 100, display: { xs: "none", sm: "flex" } }}
            >
              <Link
                to="/abfahrtzeiten"
                style={{ color: "white", textDecoration: "none" }}
              >
                Abfahrtzeiten
              </Link>
            </Typography>
            <Typography
              sx={{ minWidth: 100, display: { xs: "none", sm: "flex" } }}
            >
              <Link
                to="/info"
                style={{ color: "white", textDecoration: "none" }}
              >
                Info
              </Link>
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}>
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
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            ></Menu>
          </Box>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
