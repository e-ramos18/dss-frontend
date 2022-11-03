/**
 * Check if email is valid.
 * @param {string} value
 * @returns boolean
 */
export const validatEmail = (value: string): boolean => {
  let apos = value.indexOf("@"); // from beginning first item
  let dotpos = value.lastIndexOf("."); // from beginning last item
  return apos < 1 || dotpos - apos < 2;
};

/**
 * Get an item from localStorage
 * @param {string} item
 * @returns string
 */
export const getItem = (item: string): string => {
  const result = localStorage.getItem(item);
  if (!result) return "";
  return JSON.parse(result);
};

/**
 * Set an item in the local storage.
 * @param {string} key
 * @param {string} value
 */
export const setItem = (key: string, value: string | null) => {
  localStorage.setItem(key, JSON.stringify(value));
};
