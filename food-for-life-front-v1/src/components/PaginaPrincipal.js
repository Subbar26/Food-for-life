import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import React, { useCallback, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import './PaginaPrincipal.css';
import translateText from './Recipes_component/translateApi';

// Registrar elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PaginaPrincipal = () => {
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [idr, setIdr] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [isIngredientSelected, setIsIngredientSelected] = useState(false);
    const [meals, setMeals] = useState({
        Desayuno: [],
        Almuerzo: [],
        Cena: [],
        Otros: []
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        axios.get('http://localhost:8080/auth/idr', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setUserName(response.data.name);
                setIdr(response.data.idr);
                setUserId(response.data.id);
            })
            .catch(error => {
                console.error('Error al obtener los detalles del usuario:', error);
            });
    }, []);

    const fetchMeals = useCallback(async (mealType) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/alimentos/listar`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    usuarioId: userId,
                    tipoComida: mealType,
                    fecha: selectedDate.toISOString().split('T')[0] // Enviar la fecha seleccionada en el formato adecuado
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error al obtener los alimentos de tipo ${mealType}:`, error);
            return [];
        }
    }, [userId, selectedDate]);

    const loadMeals = useCallback(async () => {
        const desayuno = await fetchMeals('Desayuno');
        const almuerzo = await fetchMeals('Almuerzo');
        const cena = await fetchMeals('Cena');
        const otros = await fetchMeals('Otros');
        setMeals({
            Desayuno: desayuno,
            Almuerzo: almuerzo,
            Cena: cena,
            Otros: otros
        });
    }, [fetchMeals]);

    useEffect(() => {
        if (userId) {
            loadMeals();
        }
    }, [userId, selectedDate, loadMeals]);

    useEffect(() => {
        const handleSearch = async () => {
            if (searchQuery.length > 0) {
                const translatedQuery = await translateText(searchQuery, 'en');
                const options = {
                    method: 'GET',
                    url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/search',
                    params: {
                        query: translatedQuery,
                        number: '2'
                    },
                    headers: {
                        'x-rapidapi-key': 'a9c2ea2640mshc3e6c9038687ca3p1c6e34jsndef63eba3c2a',
                        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
                    }
                };

                try {
                    const response = await axios.request(options);
                    const translatedResults = await Promise.all(response.data.results.map(async (result) => {
                        const translatedName = await translateText(result.name, 'es');
                        return { ...result, name: translatedName };
                    }));
                    setSearchResults(translatedResults);
                } catch (error) {
                    console.error(error);
                }
            } else {
                setSearchResults([]);
            }
        };

        handleSearch();
    }, [searchQuery]);

    const handleSelectIngredient = async (ingredientId) => {
        const options = {
            method: 'GET',
            url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/${ingredientId}/information`,
            params: {
                amount: '100',
                unit: 'grams'
            },
            headers: {
                'x-rapidapi-key': 'a9c2ea2640mshc3e6c9038687ca3p1c6e34jsndef63eba3c2a',
                'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            setSelectedIngredient(response.data);
            setIsIngredientSelected(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAccordionClick = (section) => {
        setActiveAccordion(section === activeAccordion ? null : section);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedIngredient(null);
        setIsIngredientSelected(false);
    };

    const handleSaveIngredient = async () => {
        if (selectedIngredient && activeAccordion) {
            const translatedName = await translateText(selectedIngredient.name, 'es');
            const ingredientWithTranslatedName = { ...selectedIngredient, name: translatedName };
            const newMeals = { ...meals };
            newMeals[activeAccordion].push(ingredientWithTranslatedName);
            setMeals(newMeals);
    
            // Guardar el alimento en la base de datos
            const token = localStorage.getItem('token');
            console.log('Saving ingredient with the following details:');
            console.log('Nombre:', translatedName);
            console.log('Usuario ID:', userId);
            console.log('Tipo Comida:', activeAccordion);
            console.log('Datos Nutricionales:', ingredientWithTranslatedName.nutrition.nutrients);
    
            const alimento = {
                nombre: translatedName,
                grasas: ingredientWithTranslatedName.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || 0,
                carbohidratos: ingredientWithTranslatedName.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0,
                proteinas: ingredientWithTranslatedName.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || 0,
                calorias: ingredientWithTranslatedName.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 0,
            };
    
            try {
                await axios.post('http://localhost:8080/api/v1/alimentos/agregar', alimento, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        usuarioId: userId,
                        tipoComida: activeAccordion,
                        fecha: selectedDate.toISOString().split('T')[0] // Enviar la fecha seleccionada como parámetro
                    }
                });
                loadMeals(); // Volver a cargar las comidas después de guardar
            } catch (error) {
                console.error('Error al guardar el alimento:', error);
            }
    
            setSelectedIngredient(null);
            setIsIngredientSelected(false);
            setSearchResults([]);
            setSearchQuery('');
            setActiveAccordion(null); // Ocultar el buscador después de agregar
        }
    };
    

    const handleCancel = () => {
        setActiveAccordion(null);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedIngredient(null);
        setIsIngredientSelected(false);
    };

    const handleDeleteIngredient = async (mealType, index) => {
        const newMeals = { ...meals };
        const ingredientToDelete = newMeals[mealType][index];
    
        // Eliminar el alimento de la base de datos
        const token = localStorage.getItem('token');
        try {
            // Obtener el alimento usuario específico desde el backend
            const response = await axios.get('http://localhost:8080/api/v1/alimentos/buscar', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    usuarioId: userId,
                    tipoComida: mealType,
                    nombre: ingredientToDelete.nombre,
                    fecha: selectedDate.toISOString().split('T')[0] // Agregar la fecha seleccionada
                }
            });
            
            const alimentoUsuarioList = response.data;
            if (alimentoUsuarioList.length > 0) {
                const alimentoUsuario = alimentoUsuarioList[0]; // Obtener el primero que coincide
                await axios.delete('http://localhost:8080/api/v1/alimentos/eliminar', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        usuarioId: userId,
                        alimentoId: alimentoUsuario.alimento.id,
                        tipoComida: mealType
                    }
                });
    
                // Actualizar la lista de comidas en el estado
                newMeals[mealType] = newMeals[mealType].filter((_, idx) => idx !== index);
                setMeals(newMeals);
            }
        } catch (error) {
            console.error('Error al eliminar el alimento:', error);
        }
    };
    
    const calculateTotals = (meal) => {
        const totalFat = meal.reduce((acc, item) => acc + (item.nutrition?.nutrients.find(n => n.name === 'Fat')?.amount || item.grasas || 0), 0);
        const totalCarbs = meal.reduce((acc, item) => acc + (item.nutrition?.nutrients.find(n => n.name === 'Carbohydrates')?.amount || item.carbohidratos || 0), 0);
        const totalProtein = meal.reduce((acc, item) => acc + (item.nutrition?.nutrients.find(n => n.name === 'Protein')?.amount || item.proteinas || 0), 0);
        const totalCalories = meal.reduce((acc, item) => acc + (item.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount || item.calorias || 0), 0);
        return { 
            totalFat: isNaN(totalFat) ? 0 : totalFat, 
            totalCarbs: isNaN(totalCarbs) ? 0 : totalCarbs, 
            totalProtein: isNaN(totalProtein) ? 0 : totalProtein, 
            totalCalories: isNaN(totalCalories) ? 0 : totalCalories 
        };
    };

    const calculateDayTotals = () => {
        const allMeals = Object.values(meals).flat();
        const totals = calculateTotals(allMeals);
        return totals;
    };

    const dayTotals = calculateDayTotals();
    const idrPercentage = idr ? Math.min(((dayTotals.totalCalories / idr) * 100).toFixed(2), 100) : 0;
    const extraCalories = dayTotals.totalCalories > idr ? (dayTotals.totalCalories - idr).toFixed(2) : 0;

    const pieData = {
        labels: ['Carbohidratos', 'Grasas', 'Proteínas'],
        datasets: [
            {
                data: [
                    isNaN(dayTotals.totalCarbs) || dayTotals.totalCalories === 0 ? 0 : ((dayTotals.totalCarbs * 4) / dayTotals.totalCalories * 100).toFixed(2),
                    isNaN(dayTotals.totalFat) || dayTotals.totalCalories === 0 ? 0 : ((dayTotals.totalFat * 9) / dayTotals.totalCalories * 100).toFixed(2),
                    isNaN(dayTotals.totalProtein) || dayTotals.totalCalories === 0 ? 0 : ((dayTotals.totalProtein * 4) / dayTotals.totalCalories * 100).toFixed(2),
                ],
                backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
            }
        ]
    };

    return (
        <div className='page-container'>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card card-body shadow-sm main-card">
                        <h2 className='text-center mb-4'>Mi diario de alimentos</h2>
                        <p className='text-center'>Hola, {userName}</p>
                        {idr !== null && (
                            <div className="text-center mb-4">
                                <p>IDR: {idr}</p>
                            </div>
                        )}

                        <div className="text-center mb-4">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                maxDate={new Date()}
                            />
                        </div>

                        <div className="card mb-5">
                            <div className="card-header">
                                Resumen del Día
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center flex-column">
                                            <div className="me-3">
                                                <h5>{idrPercentage}% de IDR</h5>
                                                <p>({dayTotals.totalCalories.toFixed(2)} cal)</p>
                                            </div>
                                            <div className="progress progress-custom" style={{ height: '20px', width: '100%' }}>
                                                <div className="progress-bar" role="progressbar" style={{ width: `${idrPercentage}%` }} aria-valuenow={idrPercentage} aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            {idrPercentage >= 100 && (
                                                <div className="alert alert-success mt-3" role="alert">
                                                    ¡Felicitaciones! Has cumplido con tu ingesta diaria de calorías. {extraCalories > 0 && `Te has excedido por ${extraCalories} calorías.`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <p>Desglose de Calorías:</p>
                                        <p>Carbohidrato: {isNaN(dayTotals.totalCarbs) || dayTotals.totalCalories === 0 ? '0.00' : ((dayTotals.totalCarbs * 4) / dayTotals.totalCalories * 100).toFixed(2)}%</p>
                                        <p>Grasa: {isNaN(dayTotals.totalFat) || dayTotals.totalCalories === 0 ? '0.00' : ((dayTotals.totalFat * 9) / dayTotals.totalCalories * 100).toFixed(2)}%</p>
                                        <p>Proteína: {isNaN(dayTotals.totalProtein) || dayTotals.totalCalories === 0 ? '0.00' : ((dayTotals.totalProtein * 4) / dayTotals.totalCalories * 100).toFixed(2)}%</p>
                                    </div>
                                    <div className="col-md-4">
                                        <Pie data={pieData} />
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                Basado en un IDR de {idr} calorías
                            </div>
                        </div>

                        {['Desayuno', 'Almuerzo', 'Cena', 'Otros'].map((meal, index) => {
                            const { totalFat, totalCarbs, totalProtein, totalCalories } = calculateTotals(meals[meal]);
                            return (
                                <div key={index} className="mb-5">
                                    <div className="text-center mt-3">
                                        <h5 className="accordion-header">{meal}</h5>
                                    </div>
                                    {meals[meal].length > 0 && (
                                        <table className="table table-hover table-hover-custom">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Artículo</th>
                                                    <th>Grasas (g)</th>
                                                    <th>Carbohidratos (g)</th>
                                                    <th>Proteínas (g)</th>
                                                    <th>Calorías</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {meals[meal].map((ingredient, idx) => (
                                                    <tr key={idx}>
                                                        <td>{ingredient.nombre || ingredient.name}</td>
                                                        <td>{ingredient.grasas || ingredient.nutrition?.nutrients.find(n => n.name === 'Fat')?.amount}</td>
                                                        <td>{ingredient.carbohidratos || ingredient.nutrition?.nutrients.find(n => n.name === 'Carbohydrates')?.amount}</td>
                                                        <td>{ingredient.proteinas || ingredient.nutrition?.nutrients.find(n => n.name === 'Protein')?.amount}</td>
                                                        <td>{ingredient.calorias || ingredient.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount}</td>
                                                        <td>
                                                            <button className="btn btn-danger btn-sm btn-danger-custom" onClick={() => handleDeleteIngredient(meal, idx)}>Eliminar</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th>Total</th>
                                                    <th>{isNaN(totalFat) ? '0.00' : totalFat.toFixed(2)}</th>
                                                    <th>{isNaN(totalCarbs) ? '0.00' : totalCarbs.toFixed(2)}</th>
                                                    <th>{isNaN(totalProtein) ? '0.00' : totalProtein.toFixed(2)}</th>
                                                    <th>{isNaN(totalCalories) ? '0.00' : totalCalories.toFixed(2)}</th>
                                                    <th></th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    )}
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button collapsed custom-button accordion-button-custom"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#flush-collapse${index}`}
                                            aria-expanded={activeAccordion === meal}
                                            aria-controls={`flush-collapse${index}`}
                                            onClick={() => handleAccordionClick(meal)}
                                            disabled={idrPercentage >= 100}
                                        >
                                            + Añadir artículo
                                        </button>
                                    </h2>
                                    <div
                                        id={`flush-collapse${index}`}
                                        className={`accordion-collapse collapse ${activeAccordion === meal ? 'show' : ''}`}
                                        aria-labelledby={`flush-heading${index}`}
                                        data-bs-parent="#accordionFlushExample"
                                    >
                                        <div className="accordion-body">
                                            {activeAccordion === meal && (
                                                <>
                                                    <div className="input-group mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Buscar ingrediente"
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            disabled={idrPercentage >= 100}
                                                        />
                                                    </div>

                                                    {searchResults.length > 0 && (
                                                        <ul className="list-group mb-3">
                                                            {searchResults.map(result => (
                                                                <li
                                                                    key={result.id}
                                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                                >
                                                                    <div className="form-check">
                                                                        <input
                                                                            className="form-check-input form-check-input-custom"
                                                                            type="checkbox"
                                                                            value={result.id}
                                                                            onChange={() => handleSelectIngredient(result.id)}
                                                                            checked={selectedIngredient && selectedIngredient.id === result.id}
                                                                            disabled={idrPercentage >= 100}
                                                                        />
                                                                        <label className="form-check-label ms-2">
                                                                            {result.name}
                                                                        </label>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}

                                                    <div className="d-flex justify-content-end">
                                                        <button
                                                            className="btn btn-primary me-2 btn-primary-custom"
                                                            style={{ flex: '1 1 auto', maxWidth: '150px' }}
                                                            onClick={handleSaveIngredient}
                                                            disabled={!isIngredientSelected || idrPercentage >= 100}
                                                        >
                                                            Agregar
                                                        </button>
                                                        <p></p>
                                                        <button
                                                            className="btn btn-secondary btn-secondary-custom"
                                                            style={{ flex: '1 1 auto', maxWidth: '150px' }}
                                                            onClick={handleCancel}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <footer className="cerrar-sesion-custom">
                    <Link to="#" onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }} className="btn btn-link text-decoration-none">Cerrar sesión</Link>
                </footer>
            </div>
        </div>
    );
};

export default PaginaPrincipal;
