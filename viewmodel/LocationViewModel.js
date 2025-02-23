import * as Location from 'expo-location';

//Function to request permission to use the location
export const handlePositionPermission = async() => {

    let permission = false
    const grantedPermission = await Location.getForegroundPermissionsAsync()
      if (grantedPermission.status === "granted") {
        permission = true
      } else {
        const permissionResponse = await Location.requestForegroundPermissionsAsync()
        if (permissionResponse.status === "granted") {
          permission = true
        }
      }
    return permission
      
}

//Function to obtain user's latitude and longitude
export const getCoords = async () => {

    
    const location = await Location.getCurrentPositionAsync()

    const data = {
        latitude : location.coords.latitude,
        longitude : location.coords.longitude
    }

    return data

}

//Function to control permissions on the user's location
export const hasLocationPermission = async () => {
  const permissionStatus = await Location.getForegroundPermissionsAsync()
  return permissionStatus.status === "granted"
}

/**
 * Formats a timestamp into a human-readable date and time.
 * 
 * @param {string} isoString - The ISO 8601 timestamp to format.
 * @returns {string} - A formatted date and time string.
 */
export function formatDate(isoString) {
  try {
    if (!isoString) return "N/A"

    const date = new Date(isoString)

    // Options for locale formatting
    const options = {
      weekday: 'short',   // Abbreviated weekday name (e.g., Thu)
      year: 'numeric',    // Full numeric year (e.g., 2024)
      month: 'short',     // Abbreviated month name (e.g., Dec)
      day: 'numeric',     // Numeric day of the month (e.g., 19)
      hour: '2-digit',    // Two-digit hour (e.g., 05 for 5 PM)
      minute: '2-digit',  // Two-digit minutes (e.g., 10)
      hour12: true,       // Use 12-hour clock (e.g., 5:10 PM)
    };

    return date.toLocaleString('en-US', options)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "N/A"
  }
}