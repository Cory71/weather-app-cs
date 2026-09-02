// Small helpers for saving settings in the browser.
// Every call is wrapped in try/catch because a browser can block storage.

// Read a plain text setting
export function readStoredText(storageKey, fallbackValue) {
  try {
    const savedText = localStorage.getItem(storageKey)

    return savedText === null ? fallbackValue : savedText
  } catch {
    return fallbackValue
  }
}

// Save a plain text setting
export function saveStoredText(storageKey, value) {
  try {
    localStorage.setItem(storageKey, value)
  } catch {
    // Ignore save errors so blocked storage never breaks the app.
  }
}

// Read a setting that holds a list or a true/false value
export function readStoredJson(storageKey, fallbackValue) {
  try {
    const savedText = localStorage.getItem(storageKey)

    return savedText === null ? fallbackValue : JSON.parse(savedText)
  } catch {
    return fallbackValue // Also covers text that is not valid JSON.
  }
}

// Save a setting that holds a list or a true/false value
export function saveStoredJson(storageKey, value) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value))
  } catch {
    // Ignore save errors so blocked storage never breaks the app.
  }
}
