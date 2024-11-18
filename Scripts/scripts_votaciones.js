import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, runTransaction, update, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

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

const dni = localStorage.getItem('dni');
if (!dni) {
    alert('No se encontró un DNI válido. Por favor, regrese al inicio.');
    window.location.href = 'index.html';
}

const botonesVotar = document.querySelectorAll('.grupo button');
const confirmarModal = document.getElementById('confirmar-voto-modal');
const agradecimientoModal = document.getElementById('agradecimiento-modal');
const confirmarVotoBtn = document.getElementById('confirmar-voto-btn');
const volverInicioBtn = document.getElementById('volver-inicio-btn');
const imagenModal = document.getElementById('imagen-modal');
const imagenAgradecimiento = document.getElementById('imagen-agradecimiento');

let grupoSeleccionado = null;

botonesVotar.forEach((boton) => {
    boton.addEventListener('click', () => {
        const grupo = boton.parentElement;
        const imagenGrupo = grupo.querySelector('.grupo-imagen');

        grupoSeleccionado = boton.getAttribute('data-grupo');

        imagenModal.src = imagenGrupo.src;
        imagenModal.alt = imagenGrupo.alt;

        confirmarModal.style.display = 'flex';
    });
});

confirmarVotoBtn.addEventListener('click', async () => {
    if (!grupoSeleccionado) {
        alert('Por favor, selecciona un grupo antes de confirmar tu voto.');
        return;
    }

    confirmarVotoBtn.disabled = true;

    try {
        const votanteRef = ref(database, 'votantes/' + dni);
        const snapshot = await get(votanteRef);

        if (snapshot.exists() && snapshot.val().voto === 'si') {
            alert('Ya has votado anteriormente. No puedes votar nuevamente.');
            confirmarModal.style.display = 'none';
            return;
        }

        const votosRef = ref(database, 'votos/' + grupoSeleccionado);
        await runTransaction(votosRef, (currentVotos) => {
            return (currentVotos || 0) + 1;
        });

        await update(votanteRef, {
            voto: 'si',
        });

        localStorage.removeItem('dni');

        confirmarModal.style.display = 'none';
        imagenAgradecimiento.src = imagenModal.src;
        imagenAgradecimiento.alt = imagenModal.alt;
        agradecimientoModal.style.display = 'flex';
    } catch (error) {
        alert('Hubo un error al registrar tu voto. Por favor, intenta nuevamente.');
        console.error(error);
    } finally {
        confirmarVotoBtn.disabled = false;
    }
});

volverInicioBtn.addEventListener('click', () => {
    agradecimientoModal.style.display = 'none';
    localStorage.removeItem('dni');
    window.location.href = 'index.html';
});

window.addEventListener('click', (event) => {
    if (event.target === confirmarModal) {
        confirmarModal.style.display = 'none';
    }
});
