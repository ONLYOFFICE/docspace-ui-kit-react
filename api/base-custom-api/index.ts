/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
