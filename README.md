# 🧠 KANBAN-NEXEUS

Tablero **Kanban avanzado** construido con **React** y **Vite**, diseñado para la gestión de proyectos de forma visual, ágil y colaborativa.

Incluye:

- ✅ Registro e inicio de sesión con **Firebase Authentication** (sin verificación por email)  
- 🗂️ Creación, edición y eliminación de tareas  
- 🔄 Drag & Drop para mover tareas entre columnas  
- ⏱️ Registro de horas trabajadas (timesheet)  
- 🧮 Validación de fechas y mensajes modales dinámicos  
- ☁️ Persistencia en **Firestore**  
- 🌟 Tutorial Interactivo

---

## 🚀 Requisitos

- **Node.js** >= 18.x  
- **npm** >= 9.x o **yarn** >= 3.x  

---

## ⚙️ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/JMGS93/kanban-nexeus.git
cd kanban-nexeus
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar Firebase:
Copiar el siguiente contenido en un archivo `.env` en la raíz del proyecto (`kanban-nexeus/.env`):


```env
# =========================================================
# Variables de entorno para Firebase - Proyecto Oficial
# =========================================================
VITE_FIREBASE_API_KEY=AIzaSyAt9zCGP19etDuHx6Wr7iCmNVNaAQJEdeY
VITE_FIREBASE_AUTH_DOMAIN=kanban-nexeus.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kanban-nexeus
VITE_FIREBASE_STORAGE_BUCKET=kanban-nexeus.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=105629778633
VITE_FIREBASE_APP_ID=1:105629778633:web:741833647f6a3b13e04318
VITE_FIREBASE_MEASUREMENT_ID=G-910KW8CD2G
```

4. Inicializar la aplicación:

```bash
npm run dev
```

5. Abrir en el navegador:
   [http://localhost:5173](http://localhost:5173)

---

## Estructura principal del proyecto

```text
kanban-nexeus/
├─ src/
│  ├─ assets/                 # Imágenes y recursos estáticos
│  ├─ components/             # Componentes reutilizables
│  │  ├─ Column.jsx
│  │  ├─ FormWrapper.jsx
│  │  ├─ KanbanBoard.jsx
│  │  ├─ Register.jsx
│  │  └─ TaskCard.jsx
│  ├─ screens/                # Pantallas principales
│  │  └─ Login.jsx
│  ├─ utils/                  # Utilidades y helpers
│  │  └─ exportCSV.js
│  ├─ App.css
│  ├─ App.jsx
│  ├─ firebase.js             # Configuración de Firebase
│  ├─ firestoreTasks.js       # CRUD de tareas en Firestore
│  ├─ index.css
│  ├─ main.jsx
│  └─ projects.js             # Gestión de proyectos
├─ .env                       # Variables de entorno
├─ package.json
├─ vite.config.js
└─ tailwind.config.cjs
```

---

## 📦 Dependencias principales

Estas son las librerías clave utilizadas en **Kanban-Nexeus**:

### 🔹 Core
- **React 18+** – Librería principal para la UI  
- **React DOM** – Renderizado en el navegador  
- **React Router DOM** – Navegación entre pantallas  
- **Vite** – Bundler ultrarrápido para desarrollo

### 🔹 Estilos
- **TailwindCSS 4+** – Framework CSS utilitario  
- **autoprefixer** / **postcss** – Compatibilidad entre navegadores  

### 🔹 Funcionalidad
- **@hello-pangea/dnd** – Drag & Drop moderno y fluido  
- **react-beautiful-dnd** – (Compatibilidad con versiones previas)  
- **lucide-react** – Iconos SVG ligeros y personalizables  
- **Firebase** – Autenticación y base de datos Firestore  

### 🔹 Desarrollo
- **ESLint** + **plugins React** – Reglas de estilo y linting  
- **Globals** – Tipos y configuraciones auxiliares  
- **Tailwind PostCSS Compat** – Soporte extendido para Tailwind  

---


## Notas importantes

* Antes de ejecutar, asegúrate de tener el archivo `.env` con las credenciales proporcionadas.
* El tablero se inicializa vacío si no hay tareas.

```
👥 Créditos

Desarrollado por Nexeus Big Data Labs
📦 Repositorio oficial: github.com/JMGS93/kanban-nexeus
```