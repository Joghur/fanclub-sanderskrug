import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './pages/components/Layout';
import CardOrdering from './pages/CardOrdering';
import Home from './pages/Home';
import Info from './pages/Info';
import NoPage from './pages/NoPage';

function App() {
    return (
        <BrowserRouter>
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
