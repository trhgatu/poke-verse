import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HomePageNew } from './pages/HomePageNew';
import { PokemonDetailsPageNew } from './pages/PokemonDetailsPageNew';
import { FavoritesPage } from './pages/FavoritesPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePageNew />} />
          <Route path="pokemon/:name" element={<PokemonDetailsPageNew />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
