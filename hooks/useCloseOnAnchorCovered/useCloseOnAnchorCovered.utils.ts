/**
 * Checks if an element is partially covered by other elements or outside the viewport
 * @param element - The HTML element to check
 * @returns true if the element is covered or outside viewport, false otherwise
 */
export function isElementCovered(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();

  // Check if element is outside viewport
  if (
    rect.bottom < 0 ||
    rect.top > window.innerHeight ||
    rect.right < 0 ||
    rect.left > window.innerWidth
  ) {
    return true;
  }

  // Check if element is covered by another element
  const x = rect.left + rect.width / 2;
  const y = rect.top + 5;

  const topElement = document.elementFromPoint(x, y);

  return !topElement?.contains(element);
}
