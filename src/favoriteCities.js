// Rules for the saved favorite city list.
// Each function returns a new list instead of changing the old one.

export const MAX_FAVORITE_CITIES = 8

// Compare two city names while ignoring spacing and capital letters
function isSameCity(firstCity, secondCity) {
  return firstCity.trim().toLowerCase() === secondCity.trim().toLowerCase()
}

// Check whether a city is already saved
export function isFavoriteCity(favoriteCities, cityName) {
  if (!cityName) {
    return false
  }

  return favoriteCities.some((favoriteCity) => isSameCity(favoriteCity, cityName))
}

// Add a city to the top of the list
export function addFavoriteCity(favoriteCities, cityName) {
  const trimmedCity = cityName.trim()

  if (!trimmedCity || isFavoriteCity(favoriteCities, trimmedCity)) {
    return favoriteCities // Nothing to do for blank or repeated names.
  }

  return [trimmedCity, ...favoriteCities].slice(0, MAX_FAVORITE_CITIES) // Drop the oldest when full.
}

// Remove a city from the list
export function removeFavoriteCity(favoriteCities, cityName) {
  return favoriteCities.filter((favoriteCity) => !isSameCity(favoriteCity, cityName))
}

// Keep only usable names when reading the list back from storage
export function cleanFavoriteCities(savedValue) {
  if (!Array.isArray(savedValue)) {
    return []
  }

  return savedValue
    .filter((savedCity) => typeof savedCity === 'string' && savedCity.trim())
    .slice(0, MAX_FAVORITE_CITIES)
}
