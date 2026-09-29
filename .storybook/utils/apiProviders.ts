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

/**
 * The portal the `apiConfig` toolbar global points at: `.env` for "default"
 * (and for a saved provider that has since been deleted), the saved entry
 * otherwise. Both fields are "" when nothing is configured -- the demo mode
 * every story has to render in.
 */
export const resolveApiConfig = (
  apiConfig: string | undefined,
  defaults: { url: string; apiKey: string },
): { url: string; apiKey: string } => {
  if (apiConfig && apiConfig !== "default" && apiConfig !== "add-custom") {
    const provider = getProviderById(apiConfig);
    if (provider) return { url: provider.url, apiKey: provider.apiKey };
  }
  return defaults;
};

export const generateProviderId = (): string => {
  return `provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
