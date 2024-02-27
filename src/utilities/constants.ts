/**
 * Check if the window exists (avoid SSR issues) and return the
 * window variable or the fallback value. Fallback value is used
 * when testing outside of the Vidaa OS environment or the
 * browser.
 *
 * @param {string} windowVariable
 * @param {number} fallback
 * @return {*}
 */
const safeCheck = (windowVariable: string, fallback: number) => {
  if (typeof window !== 'undefined') {
    return (window as any)[windowVariable] || fallback;
  }
  return fallback;
};

// Map the key codes to the corresponding key names or default codes.
export const VK_LEFT: number = safeCheck('VK_LEFT', 37);
export const VK_RIGHT: number = safeCheck('VK_RIGHT', 39);
export const VK_UP: number = safeCheck('VK_UP', 38);
export const VK_DOWN: number = safeCheck('VK_DOWN', 40);
export const VK_ENTER: number = safeCheck('VK_ENTER', 13);
export const VK_BACK_SPACE: number = safeCheck('VK_BACK_SPACE', 8);
