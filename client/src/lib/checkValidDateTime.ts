
function checkValidDateTime(date: string, time: string): boolean {
    const inputDateTimeStr = `${date}T${time}:00`;
    const inputDate = new Date(inputDateTimeStr);
    const now = new Date();
    const diffMs = inputDate.getTime() - now.getTime();
    const sixHoursMs = 6 * 60 * 60 * 1000;

    // Return true if input datetime is at least 6 hours from now
    return diffMs >= sixHoursMs;
}

export default checkValidDateTime;