const BASE_URL = "https://api.nal.usda.gov/fdc/v1";
const apiKey = import.meta.env.VITE_USDA_API_KEY || "DEMO_KEY";

function getNutrient(food, names) {
  const nutrient = food.foodNutrients?.find((item) =>
    names.includes(item.nutrientName),
  );

  return nutrient?.value ?? null;
}

function mapFood(food) {
  return {
    _id: `usda-${food.fdcId}`,
    usdaId: food.fdcId,
    name: food.description,
    brandName: food.brandName || null,
    dataType: food.dataType || null,
    servingDescription: food.servingSize
      ? `${food.servingSize}${food.servingSizeUnit || ""}`
      : "per 100 g",
    calories: getNutrient(food, ["Energy"]),
    protein: getNutrient(food, ["Protein"]),
    carbs: getNutrient(food, ["Carbohydrate, by difference"]),
    fat: getNutrient(food, ["Total lipid (fat)"]),
    nutritionSource: "USDA FoodData Central",
    likes: [],
  };
}

export async function searchUsdaFoods(foodName, pageSize = 10) {
  const response = await fetch(
    `${BASE_URL}/foods/search?api_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(foodName)}&pageSize=${pageSize}`,
  );

  if (!response.ok) {
    throw new Error(`USDA food search failed: ${response.status}`);
  }

  const data = await response.json();
  return (data.foods || []).map(mapFood);
}
