# WTET - What To Eat Today

WTET is a responsive React app that helps users search for foods, view nutrition details, and save favorite foods.

## Current Features

- Search foods by name or ingredient
- Fetch nutrition data from USDA FoodData Central
- Fetch food images from Pexels
- Display food result cards
- Open a modal with calories, protein, carbs, and fat
- Save and remove favorite foods
- View saved foods on a separate page
- Persist saved foods with localStorage
- Show loading, error, and empty-result states
- Show more results in groups of three
- Responsive layout for desktop, tablet, and mobile screens

## APIs

- USDA FoodData Central: nutrition and macro data
- Pexels: food images

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root:

```env
VITE_USDA_API_KEY=your_usda_api_key
VITE_PEXELS_API_KEY=your_pexels_api_key
```

3. Start the development server:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Technologies

- React
- React Router
- Vite
- JavaScript
- CSS

## Future Improvements

- Add a Food Challenge feature for random meal ideas
- Add recipe-based food search with TheMealDB
- Show ingredients and recipe instructions in the food modal
- Add backend storage for saved foods

## Author

Developed by Gokhan Eldeleklioglu
