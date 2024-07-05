import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import ForgotPassword from './components/ForgotPassword';
import Header from './components/Header';
import Login from './components/Login';
import PaginaPrincipal from './components/PaginaPrincipal';
import RecipeCard from './components/Recipes_component/RecipeCard';
import Recipes from './components/Recipes_component/Recipes';
import Register from './components/Registro';
import ResetPassword from './components/ResetPassword';
import backgroundImage from './images/paginap_image.jpg';

const Home = () => (
  <div className="home-container">
    <img src={backgroundImage} alt="Background" className="home-image" />
  </div>
);

const App = () => {
  const location = useLocation();
  const [showBackground, setShowBackground] = useState(true);

  useEffect(() => {
    setShowBackground(location.pathname === '/');
  }, [location]);

  return (
    <div className="App">
      <Header />
      {showBackground }
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pagina_principal" element={<PaginaPrincipal />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:recipeId" element={<RecipeCard />} />
      </Routes>
    </div>
  );
};

export default App;
