export default function parseTime(intValue) {
    let seconds = intValue % 60;
    let minutes = Math.floor(intValue / 60) % 60;
    let hours = Math.floor(Math.floor(intValue / 60) / 60) % 60;

    hours = hours.toString().padStart(2, 0)
    minutes = minutes.toString().padStart(2, 0)
    seconds = seconds.toString().padStart(2, 0)

    if (hours !== 0) {
        return `${hours}:${minutes}:${seconds}`
    } else {
        return `${minutes}:${seconds}`
    }
}