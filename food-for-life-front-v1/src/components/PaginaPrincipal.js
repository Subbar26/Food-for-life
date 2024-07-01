import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PaginaPrincipal.css';

const PaginaPrincipal = () => {
    const [userName, setUserName] = useState('');
    const [idr, setIdr] = useState(null);
    const [queries, setQueries] = useState({
        Desayuno: '',
        Almuerzo: '',
        Comida: '',
        Otros: ''
    });
    const [results, setResults] = useState({
        Desayuno: [],
        Almuerzo: [],
        Comida: [],
        Otros: []
    });
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState({
        Desayuno: false,
        Almuerzo: false,
        Comida: false,
        Otros: false
    });
    const [error, setError] = useState({
        Desayuno: null,
        Almuerzo: null,
        Comida: null,
        Otros: null
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:8080/auth/idr', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setUserName(response.data.name);
            setIdr(response.data.idr);
        })
        .catch(error => {
            console.error('Error al obtener los detalles del usuario:', error);
        });
    }, []);

    const handleSearch = async (category) => {
        if (queries[category]) {
            setLoading(prevLoading => ({ ...prevLoading, [category]: true }));
            setError(prevError => ({ ...prevError, [category]: null }));
            try {
                const response = await axios.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch', {
                    params: {
                        query: queries[category],
                        number: 10
                    },
                    headers: {
                        'x-rapidapi-key': 'a9c2ea2640mshc3e6c9038687ca3p1c6e34jsndef63eba3c2a',
                        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
                    }
                });
                const resultsWithCalories = response.data.results.map(result => ({
                    ...result,
                    calories: Math.floor(Math.random() * (600 - 50 + 1)) + 50 // Calorías entre 50 y 600
                }));
                setResults(prevResults => ({ ...prevResults, [category]: resultsWithCalories }));
            } catch (err) {
                setError(prevError => ({ ...prevError, [category]: err.message }));
            } finally {
                setLoading(prevLoading => ({ ...prevLoading, [category]: false }));
            }
        }
    };

    const handleInputChange = (category, value) => {
        setQueries(prevQueries => ({ ...prevQueries, [category]: value }));
    };

    const handleAddItems = (category) => {
        const itemsToAdd = results[category].filter(result => {
            const checkbox = document.getElementById(`check-${result.id}`);
            return checkbox && checkbox.checked;
        });
        setSelectedItems(prevItems => [...prevItems, ...itemsToAdd]);
    };

    const totalCalories = selectedItems.reduce((acc, item) => acc + item.calories, 0);

    return (
        <div className='container mt-5'>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card card-body shadow custom-card">
                        <h2 className='text-center'>Bienvenido a FoodForLife</h2>
                        <p className='text-center'>Esta es la página principal</p>
                        <p className='text-center'>Hola, {userName}</p>
                        {idr !== null && (
                            <div className="text-center">
                                <p>IDR: {idr}</p>
                            </div>
                        )}
                        <header className="d-flex justify-content-end">
                            <Link to="#" onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }} className="btn btn-link text-decoration-none">Cerrar sesión</Link>
                        </header>
                        {['Desayuno', 'Almuerzo', 'Comida', 'Otros'].map(category => (
                            <div key={category} className="mb-4">
                                <h3>{category}</h3>
                                <input
                                    type="text"
                                    placeholder={`Buscar ${category}`}
                                    value={queries[category]}
                                    onChange={(e) => handleInputChange(category, e.target.value)}
                                    className="form-control mb-2"
                                />
                                <button onClick={() => handleSearch(category)} className="btn btn-primary mb-2">
                                    Buscar
                                </button>
                                {loading[category] && <p>Cargando...</p>}
                                {error[category] && <p>Error: {error[category]}</p>}
                                <div className="results-container">
                                    {results[category].map(result => (
                                        <div key={result.id} className="result-item">
                                            <input type="checkbox" id={`check-${result.id}`} />
                                            <label htmlFor={`check-${result.id}`}>{result.title}</label>
                                            <span className="calories">({result.calories} Calorías)</span>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => handleAddItems(category)} 
                                    className="btn btn-secondary btn-sm mt-2">
                                    Añadir {category}
                                </button>
                            </div>
                        ))}
                        <div className="mt-4">
                            <h3>Alimentos de hoy</h3>
                            <div className="selected-items-container">
                                {selectedItems.length === 0 ? (
                                    <p>No has seleccionado ningún alimento.</p>
                                ) : (
                                    selectedItems.map(item => (
                                        <div key={item.id} className="selected-item">
                                            <p>{item.title} - {item.calories} Calorías</p>
                                        </div>
                                    ))
                                )}
                                {selectedItems.length > 0 && (
                                    <div className="total-calories">
                                        <p>Total de calorías: {totalCalories}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaginaPrincipal;
