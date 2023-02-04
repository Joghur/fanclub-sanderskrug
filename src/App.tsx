import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Admin from './pages/Admin';
import CardOrdering from './pages/CardOrdering';
import Info from './pages/Info';
import League from './pages/League';
import NoPage from './pages/NoPage';
import Layout from './pages/components/common/Layout';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<CardOrdering />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="liga" element={<League />} />
                    <Route path="info" element={<Info />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
