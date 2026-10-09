import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n}from"./blocks-D1qLjfJS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,r as a}from"./react-qN2cStNd.js";function o(e){let t={a:`a`,blockquote:`blockquote`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Getting started/API`}),`
`,(0,c.jsx)(t.h1,{id:`api`,children:`API`}),`
`,(0,c.jsxs)(t.blockquote,{children:[`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`Portal-internal.`}),` Everything on this page needs an ONLYOFFICE Apps portal: a URL, an API key and a
signed-in person. An application built on this kit does not mount `,(0,c.jsx)(t.code,{children:`ApiProvider`}),` and does not call
these endpoints — it talks to its own backend and composes only the theme and translation
providers.`]}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`The UI Kit uses `,(0,c.jsx)(t.code,{children:`ApiProvider`}),` to give components access to the ONLYOFFICE Apps REST API.
It wraps the `,(0,c.jsx)(t.code,{children:`@onlyoffice/docspace-api-sdk`}),` and authenticates requests with a Bearer token.`]}),`
`,(0,c.jsx)(t.h2,{id:`reference-documentation`,children:`Reference documentation`}),`
`,(0,c.jsxs)(t.p,{children:[`This page covers the provider, not the endpoints. The REST API itself is documented at
`,(0,c.jsx)(t.a,{href:`https://api.onlyoffice.com/docspace/`,rel:`nofollow`,children:`api.onlyoffice.com/docspace`}),`, and the same
documentation is published in a machine-readable form for agents and LLMs:`]}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.a,{href:`https://api.teamlab.info/llms.txt`,rel:`nofollow`,children:(0,c.jsx)(t.code,{children:`llms.txt`})}),` — index of every section`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.a,{href:`https://api.teamlab.info/docspace/api-backend/llms.txt`,rel:`nofollow`,children:(0,c.jsx)(t.code,{children:`docspace/api-backend/llms.txt`})}),` —
the ONLYOFFICE Apps REST API reference the SDK wraps`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.a,{href:`https://api.teamlab.info/docspace/javascript-sdk/llms.txt`,rel:`nofollow`,children:(0,c.jsx)(t.code,{children:`docspace/javascript-sdk/llms.txt`})}),` —
Embed SDK`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.a,{href:`https://api.teamlab.info/docspace/plugins-sdk/llms.txt`,rel:`nofollow`,children:(0,c.jsx)(t.code,{children:`docspace/plugins-sdk/llms.txt`})}),` —
Plugins SDK`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.a,{href:`https://api.teamlab.info/docspace/mcp-server/llms.txt`,rel:`nofollow`,children:(0,c.jsx)(t.code,{children:`docspace/mcp-server/llms.txt`})}),` —
MCP server`]}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`Every page there is also available as Markdown: replace the trailing slash of its URL
with `,(0,c.jsx)(t.code,{children:`.md`}),`.`]}),`
`,(0,c.jsxs)(t.p,{children:[`Those links point at `,(0,c.jsx)(t.code,{children:`api.teamlab.info`}),` today. The documentation is moving to
`,(0,c.jsx)(t.code,{children:`api.onlyoffice.com`}),` under the same paths, so prefer that host once it serves them.`]}),`
`,(0,c.jsx)(t.h2,{id:`setting-up-apiprovider`,children:`Setting up ApiProvider`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { ApiProvider } from "@onlyoffice/apps-ui-kit/providers/api";

<ApiProvider url="https://your-docspace.com/api" apiKey="your-api-key">
  <App />
</ApiProvider>
`})}),`
`,(0,c.jsxs)(t.p,{children:[`There is also a composite `,(0,c.jsx)(t.code,{children:`Providers`}),` component that bundles the API, translation and theme
providers together. Everything on this page, that component included, is `,(0,c.jsx)(t.strong,{children:`portal-internal`}),`: it
needs an ONLYOFFICE Apps URL, an API key and a portal behind them. An application of your own composes
`,(0,c.jsx)(t.code,{children:`ThemeProvider`}),` and `,(0,c.jsx)(t.code,{children:`TranslationProvider`}),` and nothing else — see
`,(0,c.jsx)(t.a,{href:`?path=/docs/getting-started-welcome--docs`,children:`Getting started`}),`.`]}),`
`,(0,c.jsx)(t.h3,{id:`provider-props`,children:`Provider props`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`url`})}),` (`,(0,c.jsx)(t.code,{children:`string`}),`) — base URL of the ONLYOFFICE Apps API`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`apiKey`})}),` (`,(0,c.jsx)(t.code,{children:`string`}),`) — API key used as Bearer token for authentication`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`initSocket`})}),` (`,(0,c.jsx)(t.code,{children:`boolean`}),`, default `,(0,c.jsx)(t.code,{children:`true`}),`) — connect the portal WebSocket on mount`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`socketPath`})}),` (`,(0,c.jsx)(t.code,{children:`string`}),`) — socket path; read from portal settings when omitted`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`useBearerForRawClient`})}),` (`,(0,c.jsx)(t.code,{children:`boolean`}),`) — send `,(0,c.jsx)(t.code,{children:`Authorization`}),` with the `,(0,c.jsx)(t.code,{children:`Bearer`}),` prefix on
`,(0,c.jsx)(t.code,{children:`rawApiClient`}),` as well (Storybook needs this)`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`using-the-api-in-components`,children:`Using the API in components`}),`
`,(0,c.jsxs)(t.p,{children:[`Use the `,(0,c.jsx)(t.code,{children:`useApi`}),` hook to access API services:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { useApi } from "@onlyoffice/apps-ui-kit/providers/api";

function MyComponent() {
  const { profilesApi, commonSettingsApi } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      const profile = await profilesApi.getSelfProfile();
      const settings = await commonSettingsApi.getPortalSettings();

      // Access data via .data.response
      console.log(profile.data.response);
      console.log(settings.data.response);
    };

    fetchData();
  }, [profilesApi, commonSettingsApi]);

  return <div>...</div>;
}
`})}),`
`,(0,c.jsxs)(t.blockquote,{children:[`
`,(0,c.jsxs)(t.p,{children:[`Calling `,(0,c.jsx)(t.code,{children:`useApi()`}),` outside of `,(0,c.jsx)(t.code,{children:`ApiProvider`}),` throws: `,(0,c.jsx)(t.code,{children:`"useApi must be used within an ApiProvider"`})]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`available-api-services`,children:`Available API services`}),`
`,(0,c.jsxs)(t.p,{children:[`The `,(0,c.jsx)(t.code,{children:`useApi`}),` hook returns the following services:`]}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`profilesApi`})}),` — user profile operations (`,(0,c.jsx)(t.code,{children:`getSelfProfile`}),`)`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`commonSettingsApi`})}),` — portal settings (`,(0,c.jsx)(t.code,{children:`getPortalSettings`}),`)`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`foldersApi`})}),` — folder management (`,(0,c.jsx)(t.code,{children:`createFolder`}),`)`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`roomsApi`})}),` — room management (`,(0,c.jsx)(t.code,{children:`createRoom`}),`, `,(0,c.jsx)(t.code,{children:`getRoomsFolder`}),`)`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`filesApi`})}),` — file operations (`,(0,c.jsx)(t.code,{children:`openEditFile`}),`)`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`filesSettingsApi`})}),` — file settings (`,(0,c.jsx)(t.code,{children:`getDocServiceUrl`}),`)`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`operationsApi`})}),` — long-running file operations`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`groupApi`})}),` — group management`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`peopleSearchApi`})}),` — people search`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`groupSearchApi`})}),` — group search`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`aiApi`})}),` — AI agents and MCP servers`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`thirdPartyApi`})}),` — third-party storage connections`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`paymentApi`})}),` — tariffs and payments`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`portalQuotaApi`})}),` — portal quota`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`apiClient`})}),` — raw client for custom requests (`,(0,c.jsx)(t.code,{children:`Bearer`}),` prefix on the token)`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`rawApiClient`})}),` — the same client without the `,(0,c.jsx)(t.code,{children:`Bearer`}),` prefix, unless
`,(0,c.jsx)(t.code,{children:`useBearerForRawClient`}),` is set`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`baseUrl`})}),` — base API URL string`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`response-format`,children:`Response format`}),`
`,(0,c.jsx)(t.p,{children:`All API calls return responses in this format:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`{
  data: {
    response: T  // Actual data payload
  }
}
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Access the data via `,(0,c.jsx)(t.code,{children:`.data.response`}),`:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`const result = await profilesApi.getSelfProfile();
const user = result.data.response; // EmployeeFullDto
`})}),`
`,(0,c.jsx)(t.h2,{id:`usage-examples`,children:`Usage examples`}),`
`,(0,c.jsx)(t.h3,{id:`creating-a-folder`,children:`Creating a folder`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`const { foldersApi } = useApi();

await foldersApi.createFolder(parentFolderId, {
  title: "My Folder",
});
`})}),`
`,(0,c.jsx)(t.h3,{id:`creating-a-room`,children:`Creating a room`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { RoomType } from "@onlyoffice/docspace-api-sdk";

const { roomsApi } = useApi();

await roomsApi.createRoom({
  roomType: RoomType.CustomRoom,
  title: "My Room",
});
`})}),`
`,(0,c.jsx)(t.h3,{id:`listing-rooms-with-pagination`,children:`Listing rooms with pagination`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`const { roomsApi } = useApi();

const res = await roomsApi.getRoomsFolder(
  typeFilter,          // room type filter
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  StorageFilter.Internal,
  pageCount,           // items per page
  startIndex,          // pagination offset
  undefined,
  undefined,
  searchValue,         // search string
);

const { folders, total, count } = res.data.response;
`})}),`
`,(0,c.jsx)(t.h3,{id:`opening-a-file-in-the-editor`,children:`Opening a file in the editor`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`const { filesApi, filesSettingsApi } = useApi();

const [docService, editConfig] = await Promise.all([
  filesSettingsApi.getDocServiceUrl(),
  filesApi.openEditFile(fileId),
]);

const editorUrl = docService.data.response?.docServiceUrl;
const config = editConfig.data.response;
`})}),`
`,(0,c.jsx)(t.h2,{id:`raw-api-client`,children:`Raw API client`}),`
`,(0,c.jsxs)(t.p,{children:[`For endpoints not covered by the SDK services, use the `,(0,c.jsx)(t.code,{children:`apiClient`}),` directly:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`const { apiClient } = useApi();

// Using the typed request helper
const data = await apiClient.request<MyType>("/custom/endpoint");

// Using the raw axios instance
const response = await apiClient.instance.post("/custom/endpoint", body);
`})}),`
`,(0,c.jsx)(t.h2,{id:`provider-hierarchy`,children:`Provider hierarchy`}),`
`,(0,c.jsxs)(t.p,{children:[`When using the composite `,(0,c.jsx)(t.code,{children:`Providers`}),` component, providers are nested in this order:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`ErrorBoundary
  └── ApiProvider
      └── TranslationProvider
          └── ThemeProvider
              └── {children}
`})}),`
`,(0,c.jsxs)(t.p,{children:[`There is no separate socket provider: `,(0,c.jsx)(t.code,{children:`ApiProvider`}),` connects the portal WebSocket itself in
an effect, unless `,(0,c.jsx)(t.code,{children:`initSocket`}),` is `,(0,c.jsx)(t.code,{children:`false`}),`.`]}),`
`,(0,c.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,c.jsx)(t.p,{children:`Mock the SDK classes in your tests:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`vi.mock("@onlyoffice/docspace-api-sdk", () => ({
  Configuration: class {},
  ProfilesApi: class {
    getSelfProfile = vi.fn().mockResolvedValue({
      data: { response: { cultureName: "en" } },
    });
  },
  CommonSettingsApi: class {
    getPortalSettings = vi.fn().mockResolvedValue({
      data: { response: { culture: "en" } },
    });
  },
  // ... other API mocks
}));
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Or wrap your component in `,(0,c.jsx)(t.code,{children:`ApiProvider`}),` for integration tests:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`const { result } = renderHook(() => useApi(), {
  wrapper: ({ children }) => (
    <ApiProvider url="https://example.com" apiKey="test-key">
      {children}
    </ApiProvider>
  ),
});

expect(result.current.profilesApi).toBeDefined();
`})})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),a(),t()})))()}l();export{s as default};