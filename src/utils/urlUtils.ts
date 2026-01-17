export const getGameIdFromUrl = (): string | null =>
  new URLSearchParams(window.location.search).get('game');

/** Clears game ID from URL without page reload */
export const clearGameIdFromUrl = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('game');
  window.history.replaceState({}, '', url.toString());
};
