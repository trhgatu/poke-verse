# PokeVerse - Modern Pokemon Explorer

A modern web application for exploring Pokemon using the PokeAPI, built with React, TypeScript, and TailwindCSS.

## Features

- Browse Pokemon with pagination
- View detailed information about each Pokemon
- Save favorite Pokemon
- Responsive design for all devices
- Beautiful animations using Framer Motion
- Modern black and white theme

## Tech Stack

- React
- TypeScript
- Vite
- TailwindCSS
- Zustand (State Management)
- Axios (API Requests)
- React Router (Navigation)
- Framer Motion (Animations)
- Lucide React (Icons)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## API

This project uses the [PokeAPI](https://pokeapi.co/) to fetch Pokemon data.

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Application pages
- `/src/layouts` - Layout components
- `/src/services` - API service functions
- `/src/store` - State management (Zustand)
- `/src/types` - TypeScript type definitions
- `/src/lib` - Utility functions
- `/src/hooks` - Custom hooks
```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
