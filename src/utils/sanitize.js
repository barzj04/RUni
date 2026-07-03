export function sanitizeInput(input) {
    if (typeof input !== 'string') return value
    return value
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}