
function checkValidDateTime(date: string, time: string): boolean {
    // Combine date and time into ISO format
    const inputDateTimeStr = `${date}T${time}:00`; // Add seconds for ISO :3
    const inputDate = new Date(inputDateTimeStr);

    // Get current local time
    const now = new Date();

    // Calculate the difference in milliseconds
    const diffMs = inputDate.getTime() - now.getTime();

    // 6 hours in milliseconds
    const sixHoursMs = 6 * 60 * 60 * 1000;

    // Return true if input datetime is at least 6 hours from now
    console.log(`Input Date: ${inputDate}, Now: ${now}, Difference: ${diffMs}ms`);
    return diffMs >= sixHoursMs;
}

export default checkValidDateTime;