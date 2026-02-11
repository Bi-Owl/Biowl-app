
/**
 * Converts Persian and Arabic digits to English digits.
 * @param {string} str - The string containing Persian/Arabic digits.
 * @returns {string} - The string with English digits.
 */
export const toEnglishDigits = (str) => {
    if (!str) return str;
    return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
        .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
};

/**
 * Validates and cleans numeric input.
 * Allows digits, decimal points, and commas (for multiple answers).
 * @param {string} value - The input value.
 * @param {boolean} allowComma - Whether to allow commas (for lists).
 * @returns {string} - The cleaned value.
 */
export const cleanNumericInput = (value, allowComma = false) => {
    if (!value) return '';
    let cleaned = toEnglishDigits(value);

    // Allow digits, dot, and optionally comma
    const regex = allowComma ? /[^0-9.,]/g : /[^0-9.]/g;
    cleaned = cleaned.replace(regex, '');

    return cleaned;
};
