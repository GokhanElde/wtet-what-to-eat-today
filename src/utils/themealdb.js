const THEMEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

function mapMeal(meal) {
  return {
    _id: "mealdb-" + meal.idMeal,
    mealId: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory || "Meal",
    area: meal.strArea || "",
    instructions: meal.strInstructions || "",
    recipeUrl: meal.strSource || meal.strYoutube || "",
    imageUrl: meal.strMealThumb,
    imageAlt: meal.strMeal,
    imageSource: "TheMealDB",
    calories: null,
    protein: null,
    carbs: null,
    fat: null,
    likes: [],
  };
}

export async function searchMealRecipes(query) {
  const response = await fetch(
    THEMEALDB_BASE_URL + "/search.php?s=" + encodeURIComponent(query),
  );

  if (!response.ok) {
    throw new Error("TheMealDB search failed: " + response.status);
  }

  const data = await response.json();
  return (data.meals || []).map(mapMeal);
}

export async function getRandomMealRecipe() {
  const response = await fetch(THEMEALDB_BASE_URL + "/random.php");

  if (!response.ok) {
    throw new Error("TheMealDB random meal failed: " + response.status);
  }

  const data = await response.json();
  return data.meals?.[0] ? mapMeal(data.meals[0]) : null;
}
