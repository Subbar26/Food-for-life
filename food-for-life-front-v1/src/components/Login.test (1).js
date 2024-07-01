const { render, fireEvent, waitFor } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
const Login = require('./Login').default;

// Mock manual de Axios
jest.mock('axios', () => ({
  post: jest.fn()
}));

describe('Login component', () => {
  test('shows error message for short password', async () => {
    const { getByPlaceholderText, getByRole, getByText } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Simular entrada del usuario
    fireEvent.change(getByPlaceholderText('Contraseña'), { target: { value: 'short' } });
    fireEvent.click(getByRole('button', { name: /Iniciar sesión/i }));

    // Asegurar que aparezca el mensaje de error
    await waitFor(() => {
      expect(getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    });
  });

  test('shows error message for invalid email format', async () => {
    const { getByPlaceholderText, getByRole, getByText } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Simular entrada del usuario
    fireEvent.change(getByPlaceholderText('Correo electrónico'), { target: { value: 'invalid-email' } });
    fireEvent.click(getByRole('button', { name: /Iniciar sesión/i }));

    // Asegurar que aparezca el mensaje de error
    await waitFor(() => {
      expect(getByText('El correo electrónico no es válido')).toBeInTheDocument();
    });
  });
});
