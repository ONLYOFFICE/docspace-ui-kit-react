# Errors

Pre-built error page components that wrap `ErrorContainer` with common error messages. Translations are resolved via the `getCommonTranslation` utility from `window.i18n`.

### Usage

```js
import { Error401, Error403, Error404, ErrorOfflineContainer, ErrorInvalidLink, ErrorUnavailable, AccessRestricted } from "@docspace/ui-kit/errors";
```

```jsx
<Error401 />
<Error403 />
<Error404 />
<ErrorOfflineContainer />
<ErrorInvalidLink />
<ErrorUnavailable />
<AccessRestricted />
```

### Components

| Component              | Translation Key                | Description                        |
| ---------------------- | :----------------------------: | ---------------------------------- |
| `Error401`             | `Error401Text`                 | Unauthorized access error          |
| `Error403`             | `Error403Text`                 | Forbidden access error             |
| `Error404`             | `Error404Text`                 | Page not found error               |
| `ErrorOfflineContainer`| `ErrorOfflineText`             | Offline / no connection error      |
| `ErrorInvalidLink`     | `InvalidLink`, `LinkDoesNotExist` | Invalid or expired link error   |
| `ErrorUnavailable`     | `ErrorDeactivatedText`         | Portal deactivated error           |
| `AccessRestricted`     | `AccessDenied`, `PortalRestriction` | Access restricted error       |
