# Smartstreet - Demo Interactivo

Demo interactivo de la webapp Smartstreet desarrollado con React, Vite y TailwindCSS, listo para despliegue en Vercel.

## Características

- 🗺️ **Página Principal**: Mapa simulado con búsqueda y botón de reportar incidencia
- 👤 **Configuración de Perfil**: Modal para configurar edad, género, nacionalidad y apariencia
- 🛣️ **Selección de Rutas**: Página con múltiples opciones de ruta y termómetro de peligrosidad
- 🧭 **Navegación**: Página simulada de navegación en curso

## Tecnologías

- React 18
- Vite
- TailwindCSS
- React Router DOM

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build para Producción

```bash
npm run build
```

## Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente el proyecto Vite
3. El despliegue se realizará automáticamente

O usando Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── DangerThermometer.jsx
│   └── ProfileConfigModal.jsx
├── pages/           # Páginas principales
│   ├── HomePage.jsx
│   ├── RouteSelectionPage.jsx
│   └── NavigationPage.jsx
├── data/            # Datos mock
│   └── routesData.js
├── App.jsx          # Componente principal con rutas
├── main.jsx         # Punto de entrada
└── index.css        # Estilos globales con Tailwind
```

