import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/components/Layout";
import Home from "./pages/pages/Home";
import CardOrdering from "./pages/pages/CardOrdering";
import Info from "./pages/pages/Info";
import NoPage from "./pages/pages/NoPage";

function App() {
  return (
    <BrowserRouter basename="/sk/">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="kartenvorbestellung" element={<CardOrdering />} />
          <Route path="info" element={<Info />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
