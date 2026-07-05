export function sanitizeInput(input) {
    if (typeof input !== 'string') return value
    return input
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}