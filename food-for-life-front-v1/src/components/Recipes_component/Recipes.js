import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import loadingGif from '../../../src/images/Glowing ring.gif';
import logo from '../../../src/images/logo.png';
import recipeApi from '../../apis/recipeApi';
import './Recipes.css';

const Recipes = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nutritionData, setNutritionData] = useState({});
    const [translatedTitles, setTranslatedTitles] = useState({});


    const translatedTextCache = useMemo(() => ({}), []);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const response = await recipeApi.get('/recipes/complexSearch', {
                    params: {
                        query: searchQuery,
                        number: 4,
                        fields: 'title,summary,ingredients,tags,image',
                    },
                });
                setRecipes(response.data.results);
                response.data.results.forEach(recipe => {
                    fetchNutritionData(recipe.id);
                });
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) {
            fetchRecipes();
        }
    }, [searchQuery]);

    useEffect(() => {
        const fetchDefaultRecipes = async () => {
            setLoading(true);
            try {
                const response = await recipeApi.get('/recipes/complexSearch', {
                    params: {
                        number: 4,
                        fields: 'title,summary,ingredients,tags,image',
                    },
                });
                setRecipes(response.data.results);
                response.data.results.forEach(recipe => {
                    fetchNutritionData(recipe.id);
                });
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDefaultRecipes();
    }, []);

    const fetchNutritionData = async (recipeId) => {
        try {
            const response = await recipeApi.get(`/recipes/${recipeId}/nutritionWidget.json`);
            setNutritionData(prevData => ({ ...prevData, [recipeId]: response.data }));
        } catch (error) {
            console.error('Error fetching nutrition data:', error);
        }
    };

    const translateText = useCallback(async (text, targetLanguage) => {
        if (translatedTextCache[text]) {
            return translatedTextCache[text];
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
            translatedTextCache[text] = data.data.translations[0].translatedText;
            return translatedTextCache[text];
        } catch (error) {
            console.error('Error translating text:', error);
            return text;
        }
    }, [translatedTextCache]);

    useEffect(() => {
        const translateRecipeTitles = async () => {
            const translatedTitles = {};
            for (const recipe of recipes) {
                translatedTitles[recipe.id] = await translateText(recipe.title, 'es');
            }
            setTranslatedTitles(translatedTitles);
        };
        translateRecipeTitles();
    }, [recipes, searchQuery, translateText]);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="contenedor">
            <div className="container">
                <header className="header">
                    <div className="app-name">
                        <img src={logo} alt="Logo" className="app-icon" />
                        Buscador de Recetas
                    </div>
                    <div className="search-component">
                        <img src="/icons8-search.svg" alt="Search Icon" className="search-icon" />
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Buscar Receta"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                    </div>
                </header>
                {loading ? (
                    <div className="loading-container">
                        <img src={loadingGif} alt="Cargando..." className="loading-gif" />
                    </div>
                ) : error ? (
                    <div>Error al cargar las recetas. Inténtalo de nuevo más tarde.</div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-4 g-4">
                        {recipes.map((recipe) => (
                            <div key={recipe.id} className="col">
                                <div className="card h-100 card-recipe">
                                    <img src={recipe.image} alt={recipe.title} className="card-img-top" />
                                    <div className="card-body card_body">
                                        <Link to={`/recipes/${recipe.id}`} className="link-button title">
                                            {translatedTitles[recipe.id]}
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
                )}
            </div>
        </div>
    );
};

export default Recipes;
