// Decode any double-escaped unicode sequences (e.g. "\ud83e\udd13")
export const decodeUnicodeEscapes = (input: string): string =>
  input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
