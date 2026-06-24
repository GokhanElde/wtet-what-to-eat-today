const PEXELS_BASE_URL = "https://api.pexels.com/v1";
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const IMAGE_CACHE = new Map();

export async function searchFoodImage(foodName) {
  const cacheKey = foodName.toLowerCase().trim();

  if (IMAGE_CACHE.has(cacheKey)) {
    return IMAGE_CACHE.get(cacheKey);
  }

  if (!PEXELS_API_KEY) {
    return null;
  }

  const response = await fetch(
    `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(`${foodName} food`)}&orientation=square&per_page=1`,
    {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Pexels image search failed: ${response.status}`);
  }

  const photo = (await response.json()).photos?.[0];
  const image = photo
    ? {
        imageUrl: photo.src.large,
        imageAlt: photo.alt || foodName,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        photoUrl: photo.url,
        imageSource: "Pexels",
      }
    : null;

  IMAGE_CACHE.set(cacheKey, image);
  return image;
}
