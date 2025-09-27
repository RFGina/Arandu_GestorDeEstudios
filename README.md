Arandú - Plataforma de Estudio
Arandú (del guaraní "sabio") es una aplicación web full-stack para organizar resúmenes de estudio y aprender mediante flashcards.

Características
Organización por carpetas - Clasifica tus resúmenes por materia/tema

Editor de resúmenes - Crea y edita contenido de estudio

Flashcards interactivas - Sistema de repaso activo

Autenticación de usuarios - Registro y login seguro

Diseño responsive simple - Funciona en todos los dispositivos

Tecnologías
Backend
Django 5.2+ - Framework principal

Django REST Framework - API REST

SQLite - Base de datos

JWT - Autenticación con Simple JWT

django-cors-headers - Manejo de CORS

Frontend
React 19+ - Biblioteca principal

Chakra UI - Sistema de diseño y componentes

React Router DOM - Navegación

Axios - Cliente HTTP

Vite - Build tool y dev server

Instalación
Prerrequisitos

Python 3.13.2+

Node.js 22.16+

SQLite

1. Clonar el repositorio
bash
git clone https://github.com/RFGina/Arandu_GestorDeEstudios.git
cd Arandu_GestorDeEstudios
2. Configurar Backend (Django)
bash
# Entrar en la carpeta del backend
cd arandu_social

# Crear entorno virtual
python -m venv env
source env/bin/activate  # Linux/Mac
# env\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requirements.txt

# Migraciones iniciales
python manage.py migrate

# Ejecutar servidor de desarrollo
python manage.py runserver

3. Configurar Frontend (React)
bash
# En una nueva terminal, entrar en la carpeta del frontend
cd arandu_social/aranduSocial

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

Uso de la Aplicación
Registro/Login: Crea una cuenta o inicia sesión

Crear Carpetas: Organiza tus materias por carpetas

Agregar Resúmenes: Escribe tus apuntes en el editor

Crear Flashcards: Convierte tus resúmenes en tarjetas de estudio

Estudiar: Usa el sistema de repetición espaciada para memorizar

Comandos Útiles
Backend
bash
python manage.py makemigrations    # Crear migraciones
python manage.py migrate          # Aplicar migraciones
python manage.py collectstatic    # Recoger archivos estáticos
python manage.py test             # Ejecutar tests
Frontend
bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
npm run lint       # Análisis de código


Autor
RFGina - GitHub

Agradecimientos
Iconos por Feather Icons

Inspirado en sistemas de repetición espaciada como Anki
