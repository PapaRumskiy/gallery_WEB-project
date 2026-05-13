import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import AdminInventory from './components/AdminInventory';
import Gallery from './pages/Gallery';
import Favorites from './pages/Favorites';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <div>
            <p className="site-brand">Інвентар</p>
            <h1>Галерея</h1>
          </div>
          <nav className="site-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `site-nav-link${isActive ? ' active' : ''}`
              }
            >
              Галерея
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `site-nav-link${isActive ? ' active' : ''}`
              }
            >
              Улюблені
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `site-nav-link${isActive ? ' active' : ''}`
              }
            >
              Адмін
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<AdminInventory />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
