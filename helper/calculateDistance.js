const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Radius of the Earth in meters
  const R = 6371000;

  // Convert latitude and longitude from degrees to radians
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  // Calculate the differences
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Apply the Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance
  const distance = R * c; // in meters
  const send = parseFloat(distance).toFixed(2);
  return send; // Return the distance
};

function getDateTimestamp() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight
  return today.getTime();
}

module.exports = { calculateDistance, getDateTimestamp };

// Example usage
// const distance = calculateDistance(21.230399, 72.900771, 21.2301229, 72.8999804); // London to Paris
// console.log(`Distance: ${distance} meters`);

function getMonthTimestampRange(year, month) {
  // Start of the month
  const startOfMonth = moment(`${year}-${month}`, "YYYY-MM").startOf("month");
  // End of the month
  const endOfMonth = moment(`${year}-${month}`, "YYYY-MM").endOf("month");

  // Get Unix timestamps in seconds
  const startTimestamp = startOfMonth.unix();
  const endTimestamp = endOfMonth.unix();

  return { startTimestamp, endTimestamp };
}

// const range = getMonthTimestampRange(2024, 7);
// console.log(range);

function getMonthTimestampRange(year, month) {
  // Create a date object for the first day of the month
  const startDate = new Date(year, month - 1, 1); // month is zero-based, so subtract 1
  // Create a date object for the first day of the next month and subtract 1 millisecond to get the last moment of the current month
  const endDate = new Date(year, month, 0, 23, 59, 59, 999); // 0th day of next month is last day of current month

  // Get timestamps in seconds
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);

  return { startTimestamp, endTimestamp };
}

// Example usage for July 2024:
// const range = getMonthTimestampRange(2024, 7);
// console.log(range); // { startTimestamp: 1719792000, endTimestamp: 1722460799 }

// const formattedDate = moment(attendance.day).format("DD/MM/YYYY hh:mm:ss A");
// console.log(formattedDate);
