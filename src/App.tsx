import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import LocationPage from './pages/LocationPage';
import LocationCategoryPage from './pages/LocationCategoryPage';
import ListingPage from './pages/ListingPage';
import ClaimPage from './pages/ClaimPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="trades/:category" element={<CategoryPage />} />
            <Route path="location/:state" element={<LocationPage />} />
            <Route path="location/:state/:category" element={<LocationCategoryPage />} />
            <Route path="location/:state/:suburb/:category" element={<LocationCategoryPage />} />
            <Route path="listing/:id/:slug" element={<ListingPage />} />
            <Route path="claim" element={<ClaimPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
