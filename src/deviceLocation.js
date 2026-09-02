// Ask the browser where the device is.
// The browser uses GPS when it has it, and nearby networks otherwise.

const LOCATION_TIMEOUT_MS = 10000 // Give up after ten seconds.

// Turn a browser position error into a message the user can act on
function getLocationErrorMessage(positionError) {
  if (positionError.code === positionError.PERMISSION_DENIED) {
    return 'Location access was blocked. Search for a city instead.'
  }

  return 'Could not detect your location. Please search for a city.'
}

// Read the current device coordinates
function requestDeviceLocation() {
  // Wrap the older callback style API so callers can await it.
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('This browser does not support location detection.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (positionError) => {
        reject(new Error(getLocationErrorMessage(positionError)))
      },
      {
        enableHighAccuracy: true,
        timeout: LOCATION_TIMEOUT_MS,
        maximumAge: 0, // Always ask for a fresh position.
      },
    )
  })
}

export default requestDeviceLocation
