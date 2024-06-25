// RecipeDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import recipeApi from '../../../src/apis/recipeApi';
import RecipeTable from './RecipeTable';

const RecipeDetails = () => {
    const { id } = useParams();

    const [recipeDetails, setRecipeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            setLoading(true);
            try {
                const response = await recipeApi.get(`/recipes/${id}/information`);
                setRecipeDetails(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [id]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error al cargar los detalles de la receta. Inténtalo de nuevo más tarde.</div>;
    }

    if (!recipeDetails) {
        return <div>No se encontraron detalles de la receta.</div>;
    }

    return (
        <div>
            <h2>{recipeDetails.title}</h2>
            <img src={recipeDetails.image} alt={recipeDetails.title} />
            <p>{recipeDetails.summary}</p>
            <h3>Ingredientes:</h3>
            <RecipeTable ingredients={recipeDetails.extendedIngredients} />
            <h3>Instrucciones:</h3>
            <ol>
                {recipeDetails.analyzedInstructions[0]?.steps.map((step, index) => (
                    <li key={index}>{step.step}</li>
                ))}
            </ol>
        </div>
    );
};

export default RecipeDetails;
