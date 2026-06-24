import { searchFoodImage } from "./pexels.js";
import { searchUsdaFoods } from "./usda.js";

const MAX_FOOD_RESULTS = 6;
const USDA_CANDIDATE_COUNT = 24;

function normalizeName(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFoodScore(food, query) {
  const name = normalizeName(food.name);
  const normalizedQuery = normalizeName(query);
  const nutrientCount = [
    food.calories,
    food.protein,
    food.carbs,
    food.fat,
  ].filter((value) => value !== null).length;

  return (
    (name === normalizedQuery ? 100 : 0) +
    (name.startsWith(normalizedQuery) ? 30 : 0) +
    (food.dataType !== "Branded" ? 20 : 0) +
    nutrientCount * 5
  );
}

function getUniqueFoods(foods, query) {
  const uniqueFoods = new Map();

  foods.forEach((food) => {
    const normalizedName = normalizeName(food.name);

    if (!normalizedName) return;

    const existingFood = uniqueFoods.get(normalizedName);
    if (
      !existingFood ||
      getFoodScore(food, query) > getFoodScore(existingFood, query)
    ) {
      uniqueFoods.set(normalizedName, food);
    }
  });

  return [...uniqueFoods.values()]
    .sort((a, b) => getFoodScore(b, query) - getFoodScore(a, query))
    .slice(0, MAX_FOOD_RESULTS);
}

async function addPexelsImage(food) {
  try {
    const image = await searchFoodImage(food.name);
    return image ? { ...food, ...image } : food;
  } catch (error) {
    console.error(`Image search failed for ${food.name}:`, error);
    return food;
  }
}

export async function searchFoodCatalog(query) {
  const foods = await searchUsdaFoods(query, USDA_CANDIDATE_COUNT);
  const uniqueFoods = getUniqueFoods(foods, query);

  return Promise.all(uniqueFoods.map(addPexelsImage));
}
