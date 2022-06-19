import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useState } from "react";

type Props = {};

const Layout = (props: Props) => {
  return (
    <div>
      <Header />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
