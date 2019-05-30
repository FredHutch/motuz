export default function reverseArray(arr) {
    const result = new Array(arr.length)
    for (let i = 0; i < arr.length; i++) {
        result[arr.length - i - 1] = arr[i];
    }
    return result;
}