KANBAN-NEXEUS

Tablero Kanban avanzado construido con React y Vite, con soporte para:

Creación, edición y eliminación de tareas.
Drag & Drop para mover tareas entre columnas.
Registro de horas trabajadas por fecha (timesheet).
Validación de fechas y mensajes modales.
Integración con Firestore para persistencia de datos.

Requisitos
Node.js >= 18.x
npm >= 9.x o yarn >= 3.x

Instalación
Clonar el repositorio oficial del equipo:
git clone https://github.com/Nexeus-Big-Data-Labs/202509-sigma.git

cd 202509-sigma

Instalar dependencias:
npm install

Configurar Firebase:
Copiar el siguiente contenido en un archivo .env en la raíz del proyecto (202509-sigma/.env):
=========================================================
Variables de entorno para Firebase - Proyecto Oficial
=========================================================
VITE_FIREBASE_API_KEY=AIzaSyAt9zCGP19etDuHx6Wr7iCmNVNaAQJEdeY
VITE_FIREBASE_AUTH_DOMAIN=kanban-nexeus.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kanban-nexeus
VITE_FIREBASE_STORAGE_BUCKET=kanban-nexeus.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=105629778633
VITE_FIREBASE_APP_ID=1:105629778633:web:741833647f6a3b13e04318
VITE_FIREBASE_MEASUREMENT_ID=G-910KW8CD2G

Inicializar la aplicación:
npm run dev

Abrir en el navegador:
http://localhost:5173

Estructura principal del proyecto

202509-sigma/
├─ public/
├─ src/
│ ├─ components/ # Componentes React (TaskCard, Column, Modals)
│ ├─ screens/ # Pantallas principales (KanbanBoard, Login)
│ ├─ firestoreTasks.js # Funciones CRUD con Firestore
│ ├─ App.jsx # Componente principal
│ └─ main.jsx # Punto de entrada
├─ .env # Configuración Firebase
├─ package.json
├─ vite.config.js
└─ tailwind.config.cjs

Dependencias principales
React 18+
Vite
TailwindCSS
@hello-pangea/dnd (Drag & Drop)
Firebase (Firestore)

Notas importantes
Antes de ejecutar, asegúrate de tener el archivo .env con las credenciales proporcionadas.
El tablero se inicializa vacío si no hay tareas en Firestore.
