document.addEventListener('DOMContentLoaded', () => {
    // Asegúrate de que esta sea tu URL de Render
    const API_URL = 'https://vanifruzhiapp-backend.onrender.com/api/auth';

    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // --- LÓGICA DE REGISTRO (ACTUALIZADA) ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.textContent = '';
            
            // Leemos el nuevo campo de nombre de usuario
            const username = document.getElementById('username').value; 
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                errorMessage.textContent = 'Las contraseñas no coinciden.';
                return;
            }

            try {
                // Añadimos el username al cuerpo de la petición
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }) 
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error en el registro.');
                }

                alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
                window.location.href = 'login.html';

            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }

    // --- LÓGICA DE INICIO DE SESIÓN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.textContent = '';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error al iniciar sesión.');
                }
                
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                window.location.href = 'index.html';

            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }
});
