// src/api.js
import axios from 'axios';

const recipeApi = axios.create({
    baseURL: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    headers: {
        'x-rapidapi-key': 'a9c2ea2640mshc3e6c9038687ca3p1c6e34jsndef63eba3c2a',
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    },
});

export default recipeApi;
