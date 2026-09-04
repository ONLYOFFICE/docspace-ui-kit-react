type TConfiguration = {
  basePath: string;
  apiKey: string;
};

interface CustomRequestInit extends RequestInit {
  data?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  isStream?: boolean;
}

export class BaseCustomApi {
  protected config: TConfiguration;

  constructor(config: TConfiguration) {
    this.config = config;
  }

  protected async request<T>(
    endpoint: string,
    options: CustomRequestInit = {},
  ): Promise<T> {
    const { data, params, isStream, ...fetchOptions } = options;

    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    let url = `${this.config.basePath}/api/2.0${cleanEndpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }

    const headers = new Headers(fetchOptions.headers);
    headers.set("Accept", isStream ? "text/event-stream" : "application/json");

    if (this.config.apiKey) {
      headers.set("Authorization", `Bearer ${this.config.apiKey}`);
    }

    if (data) {
      fetchOptions.body = JSON.stringify(data);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          errorData.message ||
          `Request error: ${response.status}`,
      );
    }

    if (isStream) {
      return response.body as unknown as T;
    }

    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as T;
    }

    const text = await response.text();
    const result = text ? JSON.parse(text) : {};

    if (result && typeof result === "object" && "response" in result) {
      if (result.total !== undefined) {
        return {
          total: result.total ? +result.total : 0,
          items: result.response,
        } as unknown as T;
      }
      return result.response as T;
    }

    return result as T;
  }
}
