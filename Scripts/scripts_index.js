import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, get, update } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyBYflm70mFVdioZqKdiWe1m92XCTy44Z_c",
    authDomain: "votaciones-2024-f1e0c.firebaseapp.com",
    databaseURL: "https://votaciones-2024-f1e0c-default-rtdb.firebaseio.com/",
    projectId: "votaciones-2024-f1e0c",
    storageBucket: "votaciones-2024-f1e0c.firebasestorage.app",
    messagingSenderId: "293361877394",
    appId: "1:293361877394:web:22f329fdcfceac4d5ac14b",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const submitBtn = document.getElementById('submitBtn');
const dniField = document.getElementById('dni');
const loginForm = document.getElementById('loginForm');

dniField.addEventListener('input', () => {
    submitBtn.disabled = dniField.value.trim() === '';
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const dniValue = dniField.value.trim();

    if (dniValue === '') {
        alert('Por favor, ingresa tu DNI.');
        return;
    }

    try {
        const dniRef = ref(database, 'votantes/' + dniValue);
        const snapshot = await get(dniRef);

        if (snapshot.exists()) {
            const votante = snapshot.val();

            if (votante.voto === 'si') {
                alert('Este DNI ya fue usado para votar. No puede volver a ingresar.');
            } else {
                localStorage.setItem('dni', dniValue);

                window.location.href = 'votacion.html';
            }
        } else {
            alert('El DNI ingresado no está registrado para votar.');
        }
    } catch (error) {
        console.error('Error al verificar el DNI:', error);
        alert('Ocurrió un error al validar tu DNI. Intenta de nuevo más tarde.');
    }
});
