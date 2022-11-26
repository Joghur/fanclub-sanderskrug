import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CardOrdering from './pages/CardOrdering';
import Info from './pages/Info';
import League from './pages/League';
import NoPage from './pages/NoPage';
import Layout from './pages/components/Layout';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<CardOrdering />} />
                    <Route path="liga" element={<League />} />
                    <Route path="info" element={<Info />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
