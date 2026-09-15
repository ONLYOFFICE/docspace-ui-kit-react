export type SavedApiProvider = {
  id: string;
  name: string;
  url: string;
  apiKey: string;
};

export const STORAGE_KEY = "sb-saved-api-providers";

export const getSavedProviders = (): SavedApiProvider[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveProvider = (provider: SavedApiProvider): void => {
  const providers = getSavedProviders();
  const existingIndex = providers.findIndex((p) => p.id === provider.id);

  if (existingIndex >= 0) {
    providers[existingIndex] = provider;
  } else {
    providers.push(provider);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
};

export const deleteProvider = (id: string): void => {
  const providers = getSavedProviders().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
};

export const getProviderById = (id: string): SavedApiProvider | undefined => {
  return getSavedProviders().find((p) => p.id === id);
};

export const generateProviderId = (): string => {
  return `provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
