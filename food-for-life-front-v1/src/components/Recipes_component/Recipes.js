import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loadingGif from '../../../src/images/Glowing ring.gif';
import logo from '../../../src/images/logo.png';
import recipeApi from '../../apis/recipeApi';
import { useAuth } from '../AuthContext'; // Importar el contexto de autenticación
import './Recipes.css';

const Recipes = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nutritionData, setNutritionData] = useState({});
    const [translatedTitles, setTranslatedTitles] = useState({});
    const [noResults, setNoResults] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 2;
    const navigate = useNavigate(); // Usar useNavigate para redirecciones
    const { isAuthenticated } = useAuth(); // Obtener el estado de autenticación
    

    const translatedTitlesCache = useMemo(() => ({}), []);

    const translateText = useCallback(async (text, targetLanguage) => {
        if (translatedTitlesCache[text]) {
            return translatedTitlesCache[text];
        }
        const apiKey = 'AIzaSyCQYwPuGifUdqMUEJtOOziVQy7Ne9wcAFg';
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ q: text, target: targetLanguage }),
            });
            const data = await response.json();
            translatedTitlesCache[text] = data.data.translations[0].translatedText;
            return translatedTitlesCache[text];
        } catch (error) {
            console.error('Error translating text:', error);
            return text;
        }
    }, [translatedTitlesCache]);

    const translateRecipeTitles = useCallback(async (recipes) => {
        const translatedTitles = {};
        for (const recipe of recipes) {
            translatedTitles[recipe.id] = await translateText(recipe.title, 'es');
        }
        setTranslatedTitles(translatedTitles);
    }, [translateText]);

    const fetchRecipes = useCallback(async () => {
        setLoading(true);
        setNoResults(false); // Reset no results state before search
        setError(null);
        try {
            const translatedQuery = await translateText(searchQuery, 'en');
            const response = await recipeApi.get('/recipes/complexSearch', {
                params: {
                    query: translatedQuery,
                    number: 8,
                    offset: 0,
                    fields: 'title,summary,ingredients,tags,image',
                },
            });
            const results = response.data.results;
            setRecipes(results);
            if (results.length === 0) {
                setNoResults(true);
            }
            await translateRecipeTitles(results);
            results.forEach(recipe => {
                fetchNutritionData(recipe.id);
            });

            // Guardar la búsqueda y los resultados en el almacenamiento local
            localStorage.setItem('searchQuery', searchQuery);
            localStorage.setItem('searchResults', JSON.stringify(results));
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, translateText, translateRecipeTitles]);

    const fetchDefaultRecipes = useCallback(async () => {
        setLoading(true);
        setNoResults(false); // Reset no results state before search
        setError(null);
        try {
            const response = await recipeApi.get('/recipes/complexSearch', {
                params: {
                    number: 8,
                    fields: 'title,summary,ingredients,tags,image',
                },
            });
            const results = response.data.results;
            setRecipes(results);
            if (results.length === 0) {
                setNoResults(true);
            }
            await translateRecipeTitles(results);
            results.forEach(recipe => {
                fetchNutritionData(recipe.id);
            });
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [translateRecipeTitles]);

    useEffect(() => {
        const savedSearchQuery = localStorage.getItem('searchQuery');
        const savedSearchResults = JSON.parse(localStorage.getItem('searchResults'));

        if (savedSearchQuery && savedSearchResults) {
            setSearchQuery(savedSearchQuery);
            setRecipes(savedSearchResults);
            translateRecipeTitles(savedSearchResults);
            savedSearchResults.forEach(recipe => {
                fetchNutritionData(recipe.id);
            });
        } else {
            fetchDefaultRecipes();
        }
    }, [fetchDefaultRecipes, translateRecipeTitles]);

    useEffect(() => {
        if (searchQuery === '') {
            fetchDefaultRecipes();
        } else {
            fetchRecipes();
        }
    }, [searchQuery, fetchRecipes, fetchDefaultRecipes]);

    const fetchNutritionData = async (recipeId) => {
        try {
            const response = await recipeApi.get(`/recipes/${recipeId}/nutritionWidget.json`);
            setNutritionData(prevData => ({ ...prevData, [recipeId]: response.data }));
        } catch (error) {
            console.error('Error fetching nutrition data:', error);
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchRecipes();
        }
    };

    const handleSearchClick = () => {
        fetchRecipes();
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleAuthRedirect = () => {
        if (isAuthenticated) {
            navigate('/pagina_principal');
        } else {
            navigate('/login');
        }
    };

    const currentRecipes = recipes.slice((currentPage - 1) * 4, currentPage * 4);

    return (
        <div className="contenedor-pr">
            <div className="container container-recipes">
                <header className="header-recipes">
                    <div className="nombre-cabecera">
                        <img src={logo} alt="Logo" className="app-icon icono-cabecera" />
                        Buscador de Recetas
                    </div>
                    <div className="auth-link">
                        <button className="btn btn-primary" onClick={handleAuthRedirect}>
                            {isAuthenticated ? 'Ir a la página principal' : 'Iniciar sesión'}
                        </button>
                    </div>
                </header>
                <div className="search-container">
                    <div className="search-component">
                        <img 
                            src="/icons8-search.svg" 
                            alt="Search Icon" 
                            className="search-icon" 
                            onClick={handleSearchClick} // Añadir el manejador de clic
                        />
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Buscar Receta"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleSearchKeyPress} // Añadir el manejador de evento de tecla
                        />
                    </div>
                    <div className="pagination-info">
                        <span>Página {currentPage} de {totalPages}</span>
                    </div>
                </div>
                {loading ? (
                    <div className="loading-container">
                        <img src={loadingGif} alt="Cargando..." className="loading-gif" />
                    </div>
                ) : error ? (
                    <div>Error al cargar las recetas. Inténtalo de nuevo más tarde.</div>
                ) : noResults ? (
                    <div>No se encontraron resultados para tu búsqueda.</div>
                ) : (
                    <>
                        <div className="row row-cols-1 row-cols-md-4 g-4">
                            {currentRecipes.map((recipe) => (
                                <div key={recipe.id} className="col">
                                    <div className="card h-100 tarjeta-receta">
                                        <img src={recipe.image} alt={recipe.title} className="card-img-top" />
                                        <div className="card-body cuerpo-tarjeta">
                                            <Link to={`/recipes/${recipe.id}`} className="link titulo-tarjeta">
                                                {translatedTitles[recipe.id] || recipe.title}
                                            </Link>
                                            {nutritionData[recipe.id] ? (
                                                <div className="nutrition-info">
                                                    <p>Calorías: {nutritionData[recipe.id].calories}</p>
                                                    <p>Carbohidratos: {nutritionData[recipe.id].carbs}</p>
                                                    <p>Grasas: {nutritionData[recipe.id].fat}</p>
                                                    <p>Proteínas: {nutritionData[recipe.id].protein}</p>
                                                </div>
                                            ) : (
                                                <p>Cargando información nutricional...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pagination">
                            <nav aria-label="Page-navigation">
                                <ul className="pagination justify-content-center">
                                    <li className="page-item">
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className="page-item">
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Siguiente
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Recipes;
