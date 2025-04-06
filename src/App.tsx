import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { PokemonDetailsPage } from './pages/PokemonDetailsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { RegionsPage } from './pages/RegionsPage';
import { RegionDetailPage } from './pages/RegionDetailPage';
import { LocationDetailPage } from './pages/LocationDetailPage';
import { EvolutionSimulatorPage } from './pages/EvolutionSimulatorPage';
import './App.css';
import './assets/pokemon-colors.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="pokemon/:name" element={<PokemonDetailsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="regions" element={<RegionsPage />} />
          <Route path="regions/:name" element={<RegionDetailPage />} />
          <Route path="locations/:name" element={<LocationDetailPage />} />
          <Route path="evolution-simulator" element={<EvolutionSimulatorPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
