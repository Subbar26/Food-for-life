import { faClock, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import recipeApi from '../../../src/apis/recipeApi';
import './RecipeCard.css';

const RecipeCard = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [translatedTitle, setTranslatedTitle] = useState('');
    const [translatedIngredients, setTranslatedIngredients] = useState([]);
    const [translatedInstructions, setTranslatedInstructions] = useState([]);
    const [translatedDishTypes, setTranslatedDishTypes] = useState([]);

    // Función para traducir texto usando la API de Google Translate
    const translateText = useCallback(async (text, targetLanguage) => {
        const apiKey = 'AIzaSyCQYwPuGifUdqMUEJtOOziVQy7Ne9wcAFg';
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ q: text, target: targetLanguage }),
            });
            const data = await response.json();
            return data.data.translations[0].translatedText;
        } catch (error) {
            console.error('Error translating text:', error);
            return text;
        }
    }, []);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!recipeId) {
                setError('Recipe ID is undefined');
                setLoading(false);
                return;
            }

            try {
                const response = await recipeApi.get(`/recipes/${recipeId}/information`, {});
                setRecipe(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        if (recipeId) {
            fetchRecipe();
        }
    }, [recipeId]);

    useEffect(() => {
        const translateRecipeData = async () => {
            if (recipe) {
                // Traduce el título de la receta
                const translatedTitle = await translateText(recipe.title, 'es');
                setTranslatedTitle(translatedTitle);

                // Traduce los ingredientes
                const translatedIngredients = await Promise.all(
                    recipe.extendedIngredients.map(async (ingredient) => {
                        const translatedIngredient = await translateText(ingredient.original, 'es');
                        return translatedIngredient;
                    })
                );
                setTranslatedIngredients(translatedIngredients);

                // Traduce las instrucciones
                const translatedInstructions = await Promise.all(
                    recipe.analyzedInstructions[0]?.steps.map(async (step) => {
                        const translatedStep = await translateText(step.step, 'es');
                        return translatedStep;
                    })
                );
                setTranslatedInstructions(translatedInstructions);

                // Traduce los tipos de plato
                const translatedDishTypes = await Promise.all(
                    recipe.dishTypes.map(async (type) => {
                        const translatedType = await translateText(type, 'es');
                        return translatedType;
                    })
                );
                setTranslatedDishTypes(translatedDishTypes);
            }
        };

        translateRecipeData();
    }, [recipe, translateText]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading recipe. Please try again later. {error.message}</div>;
    }

    if (!recipe) {
        return null;
    }

    return (
        <div className="center-container">
            <div className="container">
                <div className="container d-flex justify-content-center">
                    <div className="card mb-3">
                        <div className="row g-0">
                            <div className="col-md-4">
                                <img src={recipe.image} alt={translatedTitle} className="img-fluid rounded-start" />
                                <div className="card-body">
                                    <div className="info-container">
                                        <div className="icon-container">
                                            <FontAwesomeIcon icon={faUtensils} />
                                        </div>
                                        <div>
                                            <p>Rendimiento: </p>
                                            <p>{recipe.servings} porción(es)</p>
                                        </div>
                                    </div>
                                    <div className="info-container">
                                        <div className="icon-container">
                                            <FontAwesomeIcon icon={faClock} />
                                        </div>
                                        <div>
                                            <p>Tiempo de preparación:</p>
                                            <p>{recipe.preparationMinutes} minutos</p>
                                            <p>Tiempo de Cocción:</p>
                                            <p>{recipe.cookingMinutes} minutos</p>
                                        </div>
                                    </div>
                                    <div className="info-container">
                                        <p>Tipo de plato:</p>
                                        <ul>
                                            {translatedDishTypes.map((type, index) => (
                                                <li key={index}>{type}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h1 className="card-title">{translatedTitle}</h1>
                                    <div className="card-text">
                                        <h2>Ingredientes</h2>
                                        <ul>
                                            {translatedIngredients.map((ingredient, index) => (
                                                <li key={index}>{ingredient}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="card-text">
                                        <h2>Instrucciones</h2>
                                        <ol>
                                            {translatedInstructions.map((step, index) => (
                                                <li key={index}>{step}</li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/recipes" className="back-button">← Volver a la búsqueda de recetas</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
