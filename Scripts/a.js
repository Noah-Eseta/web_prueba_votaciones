const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

console.log("Firebase configurado correctamente: ", app.name); // Si la conexión es exitosa, mostrará el nombre de la app
