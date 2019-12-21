export function copyToClipboardElement(el) {
    const selection = window.getSelection()
    selection.removeAllRanges()

    const range = document.createRange()
    range.selectNode(el)
    selection.addRange(range)

    const successful = document.execCommand('copy');
    selection.removeAllRanges()
    return successful
}
