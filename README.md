# 🛠️ Makergram

> **Makergram** es una red social exclusiva para *makers* y entusiastas de la impresión 3D, desarrollada como proyecto práctico en el **curso de Supabase** de **RollingCode School**. 🚀



## ⚡ Tecnologías Principales

Para hacer este proyecto escalable, rápido y robusto, utilizamos el siguiente stack:

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)


## 🎓 ¿Qué aprendemos en este proyecto?

A lo largo del curso, implementamos funciones avanzadas utilizando el ecosistema de **Supabase** para darle superpoderes al backend de Makergram:

*   **💾 Base de Datos & API REST:** Modelado de datos de posts, perfiles y likes, consumidos directamente mediante el SDK de Supabase.
*   **📁 Storage de Supabase:** Subida y optimización de imágenes (esos pesados renders y fotos de piezas 3D).
*   **🔔 Real-Time:** Actualizaciones automáticas para que veas los nuevos likes y posts al instante sin recargar la página.
*   **⚡ Edge Functions:** Lógica del lado del servidor escalable y segura para tareas especiales.



## 📂 Estructura del Proyecto
El código está organizado de manera modular siguiendo las mejores prácticas del desarrollo moderno en React:

```text
src/
 ├── 🎨 components/    # Componentes reutilizables de la UI (PostCard, Navbar, etc.)
 ├── 🔌 lib/           # Configuración base e inicialización de clientes de Supabase
 ├── 🧪 mocks/         # Datos de prueba iniciales (para prototipado rápido)
 ├── 📄 pages/         # Vistas principales de la aplicación (Home, Profile, Rank)
 ├── 🏷️ types/         # Interfaces y tipado estricto de TypeScript
 └── 🧰 utils/         # Funciones helper y utilidades auxiliares
```
# 🚀 Comenzando
Sigue estos pasos para levantar tu entorno de desarrollo local en pocos minutos.

## 📋 Requisitos previos

Asegúrate de tener instalado:

- Node.js (Versión 21 o superior recomendada)
- pnpm (Puedes usar npm si lo prefieres)
- Una cuenta activa en [Supabase](https://supabase.com/)

## 🛠️ Instalación y Configuración

### 1. Clona el repositorio y prepara el proyecto:
```bash
# Clonar el repositorio
git clone https://github.com/rollingcodeschool/makergram.git

# Entrar a la carpeta
cd makergram

# Instalar dependencias
pnpm install
```

### 2. Configurar Variables de Entorno 🔑

Para que la app se conecte de forma segura a tu base de datos de Supabase, crea un archivo <code>.env.local</code> en la raíz del proyecto:

```bash
#variables de entorno
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key_aqui
```

#### ¿Dónde obtener esos valores?

1. Entra a tu panel de control en Supabase y abre tu proyecto.
2. Dirígete al menú superior Connect > Seleccionar framework
3. Copia:
   - la URL del proyecto
   - la Publishable key

> ⚠️ Importante: Nunca subas este archivo .env.local ni tus credenciales privadas a repositorios públicos de GitHub.


### 3. ¡A programar! 💻
Una vez configuradas las variables, arranca el servidor local de desarrollo:

```bash
pnpm run dev
```
Abre tu navegador en http://localhost:5173 y ¡que comience la magia! 🚀


## ✍️ Autor

- Ing. [Arias Emilse Andrea](https://github.com/emiarias)

Desarrollado con ❤️ para la comunidad de makers de RollingCode School.
