const BASE_URL = "https://api.pexels.com/v1";
const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
const imageCache = new Map();

export async function searchFoodImage(foodName) {
  const cacheKey = foodName.toLowerCase().trim();

  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  if (!apiKey) {
    return null;
  }

  const response = await fetch(
    `${BASE_URL}/search?query=${encodeURIComponent(`${foodName} food`)}&orientation=square&per_page=1`,
    {
      headers: {
        Authorization: apiKey,
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

  imageCache.set(cacheKey, image);
  return image;
}
