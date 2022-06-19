import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import InfoIcon from "@mui/icons-material/Info";
import HomeRounded from "@mui/icons-material/HomeRounded";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const Footer = (props: Props) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("recents");

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      navigate(`/${newValue}`, { replace: true });
    },
    [navigate]
  );

  return (
    <div
      style={{
        marginTop: 8,
        padding: 8,
        position: "fixed",
        width: "100%",
        bottom: 0,
        left: 0,
      }}
    >
      {/* <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels={true}
        sx={{
          display: { xs: "flex", sm: "none" },
        }}
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
      </BottomNavigation> */}
    </div>
  );
};

export default Footer;
