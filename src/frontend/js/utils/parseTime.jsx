export default function parseTime(intValue) {
    const seconds = intValue % 60;
    const minutes = Math.floor(intValue / 60) % 60;
    const hours = Math.floor(Math.floor(intValue / 60) / 60) % 60;

    const _hours = hours.toString().padStart(2, 0)
    const _minutes = minutes.toString().padStart(2, 0)
    const _seconds = seconds.toString().padStart(2, 0)

    return `${_hours}:${_minutes}:${_seconds}`
}
