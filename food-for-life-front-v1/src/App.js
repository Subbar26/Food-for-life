import React, { createContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header'; // Importar el componente Header
import Login from './components/Login';
import PaginaPrincipal from './components/PaginaPrincipal';
import RecipeCard from './components/Recipes_component/RecipeCard';
import Recipes from './components/Recipes_component/Recipes';
import Register from './components/Registro';

// Crear el contexto de autenticación
export const AuthContext = createContext();

const App = () => {

  return (
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pagina_principal" element={<PaginaPrincipal />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:recipeId" element={<RecipeCard />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
};

export default App;