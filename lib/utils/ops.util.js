export function getDefault(val, def) {
    return val ? val : def;
}

export function getGlocalClassname(localStyles, className) {
    return `${className} ${localStyles[className]}`;
}