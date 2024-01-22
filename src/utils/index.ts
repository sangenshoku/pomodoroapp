export const getFromLocalStorage = <T>(key: string) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  return JSON.parse(item) as T;
};

export const setHTMLTitle = (title: string) => {
  document.title = title;
};
