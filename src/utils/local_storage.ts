// Local Storage
export const getLocalStorage = <T = any>(name: string): T[] => {
  if (!name) {
    throw new Error("Local Storage is missing...");
  }
  return JSON.parse(localStorage.getItem(name) || "[]") as T[];
};

// Set to local Storage
export const setLocalStorage = <T = any>(name: string, newData: T[]): void => {
  if (!name) {
    throw new Error("Local Storage is missing...");
  }
  if (!newData) {
    throw new Error("Data is missing...");
  }
  localStorage.setItem(name, JSON.stringify(newData));
};
