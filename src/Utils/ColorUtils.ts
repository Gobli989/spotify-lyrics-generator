export function contrastingWhite(color: string) {
    const rgb = hexToRgb(color);

    return (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 186;
}

export function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(!result) throw new Error("Invalid hex color");

    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
}