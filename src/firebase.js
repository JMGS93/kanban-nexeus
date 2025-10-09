// =========================================================
// Módulo de inicialización de Firebase
// ---------------------------------------------------------
// Este archivo centraliza la configuración y exporta los
// servicios de Firebase necesarios para la aplicación:
// - auth: autenticación de usuarios
// - db: base de datos Firestore
// - analytics: seguimiento de uso con Google Analytics
// =========================================================

// Importaciones desde el SDK de Firebase
import { initializeApp } from "firebase/app";         // Inicializa la app de Firebase
import { getAuth } from "firebase/auth";             // Servicio de autenticación
import { getFirestore } from "firebase/firestore";   // Servicio de base de datos Firestore
import { getAnalytics } from "firebase/analytics";   // Servicio de analíticas

// Configuración de tu proyecto Firebase
// Cada clave es proporcionada por Firebase al crear el proyecto
const firebaseConfig = {
  apiKey: "AIzaSyAt9zCGP19etDuHx6Wr7iCmNVNaAQJEdeY",     // Clave pública de API
  authDomain: "kanban-nexeus.firebaseapp.com",           // Dominio de autenticación
  projectId: "kanban-nexeus",                            // ID del proyecto
  storageBucket: "kanban-nexeus.firebasestorage.app",    // Almacenamiento de archivos
  messagingSenderId: "105629778633",                     // ID para mensajes push
  appId: "1:105629778633:web:741833647f6a3b13e04318",   // ID de la app
  measurementId: "G-910KW8CD2G"                         // ID para Google Analytics
};

// Inicializa la aplicación de Firebase con la configuración proporcionada
const app = initializeApp(firebaseConfig);

// Exporta los servicios para ser usados en toda la app
export const auth = getAuth(app);        // Servicio de autenticación
export const db = getFirestore(app);     // Base de datos Firestore
export const analytics = getAnalytics(app); // Google Analytics