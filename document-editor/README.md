# Document Editor

A React wrapper component for integrating ONLYOFFICE Document Editor into your application. Provides a seamless way to embed document editing capabilities with full configuration support.

## Features

- **Full Document Editing**: Support for documents, spreadsheets, and presentations
- **Customizable Configuration**: Complete control over editor behavior and appearance
- **Flexible Sizing**: Adjustable width and height to fit any layout
- **Load Balancing**: Built-in shard key support for distributed deployments
- **Error Handling**: Callback for handling component loading errors

## Installation

```tsx
import { DocumentEditor } from "@docspace/ui-kit/document-editor";
import type { IConfig } from "@docspace/ui-kit/document-editor";
```

## Usage

### Basic Example

```tsx
<DocumentEditor
  id="docEditor"
  documentServerUrl="https://your-document-server.com"
  config={{
    document: {
      fileType: "docx",
      key: "unique-document-key",
      title: "Example Document.docx",
      url: "https://example.com/document.docx",
    },
    documentType: "word",
    editorConfig: {
      mode: "edit",
    },
  }}
/>
```

### With Custom Dimensions

```tsx
<DocumentEditor
  id="docEditor"
  documentServerUrl="https://your-document-server.com"
  config={editorConfig}
  width="800px"
  height="600px"
/>
```

### With Error Handling

```tsx
<DocumentEditor
  id="docEditor"
  documentServerUrl="https://your-document-server.com"
  config={editorConfig}
  onLoadComponentError={(errorCode, errorDescription) => {
    console.error(`Editor failed to load: ${errorCode} - ${errorDescription}`);
  }}
/>
```

### With Shard Key for Load Balancing

```tsx
<DocumentEditor
  id="docEditor"
  documentServerUrl="https://your-document-server.com"
  config={editorConfig}
  shardkey="shard-key-value"
/>
```

## Properties

| Prop                    | Type                                                          | Required | Default | Description                                                                 |
| ----------------------- | ------------------------------------------------------------- | :------: | :-----: | --------------------------------------------------------------------------- |
| `id`                    | `string`                                                      |    ✅    |    -    | Unique identifier for the editor instance                                   |
| `documentServerUrl`     | `string`                                                      |    ✅    |    -    | URL of the ONLYOFFICE Document Server                                       |
| `config`                | `IConfig`                                                     |    ✅    |    -    | Editor configuration object (see [Config API](#config-object))              |
| `width`                 | `string`                                                      |    -     | `"100%"`| Width of the editor container (CSS value)                                   |
| `height`                | `string`                                                      |    -     | `"100%"`| Height of the editor container (CSS value)                                  |
| `shardkey`              | `string`                                                      |    -     |    -    | Shard key for load balancing across multiple document servers              |
| `onLoadComponentError`  | `(errorCode: number, errorDescription: string) => void`       |    -     |    -    | Callback invoked when the component fails to load                           |

## Config Object

The `config` prop accepts an `IConfig` object that follows the ONLYOFFICE Document Server API specification. Key configuration sections include:

### Document Configuration

```tsx
config={{
  document: {
    fileType: "docx",           // File extension
    key: "unique-key",          // Unique document identifier
    title: "Document.docx",     // Document title
    url: "https://...",         // Document URL
    permissions: {              // Access permissions
      edit: true,
      download: true,
      print: true,
    },
  },
  documentType: "word",         // "word", "cell", or "slide"
  editorConfig: {
    mode: "edit",               // "edit" or "view"
    lang: "en",                 // Interface language
    user: {                     // Current user info
      id: "user-id",
      name: "John Doe",
    },
  },
}}
```

For complete configuration options, refer to the [ONLYOFFICE API Documentation](https://api.onlyoffice.com/editors/config/).

## Examples

### Read-Only Mode

```tsx
<DocumentEditor
  id="viewerEditor"
  documentServerUrl="https://your-document-server.com"
  config={{
    document: {
      fileType: "docx",
      key: "doc-key",
      title: "Read Only Document.docx",
      url: "https://example.com/document.docx",
      permissions: {
        edit: false,
        download: true,
        print: true,
      },
    },
    documentType: "word",
    editorConfig: {
      mode: "view",
    },
  }}
/>
```

### Spreadsheet Editor

```tsx
<DocumentEditor
  id="spreadsheetEditor"
  documentServerUrl="https://your-document-server.com"
  config={{
    document: {
      fileType: "xlsx",
      key: "spreadsheet-key",
      title: "Financial Report.xlsx",
      url: "https://example.com/report.xlsx",
    },
    documentType: "cell",
    editorConfig: {
      mode: "edit",
    },
  }}
/>
```

### Presentation Editor

```tsx
<DocumentEditor
  id="presentationEditor"
  documentServerUrl="https://your-document-server.com"
  config={{
    document: {
      fileType: "pptx",
      key: "presentation-key",
      title: "Company Presentation.pptx",
      url: "https://example.com/presentation.pptx",
    },
    documentType: "slide",
    editorConfig: {
      mode: "edit",
    },
  }}
/>
```

### With Custom Callbacks

```tsx
<DocumentEditor
  id="callbackEditor"
  documentServerUrl="https://your-document-server.com"
  config={{
    document: {
      fileType: "docx",
      key: "doc-key",
      title: "Document.docx",
      url: "https://example.com/document.docx",
    },
    documentType: "word",
    editorConfig: {
      mode: "edit",
      callbackUrl: "https://your-app.com/callback",
    },
    events: {
      onDocumentReady: () => {
        console.log("Document is ready");
      },
      onError: (event) => {
        console.error("Editor error:", event);
      },
    },
  }}
/>
```

### Responsive Container

```tsx
function ResponsiveEditor() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <DocumentEditor
        id="responsiveEditor"
        documentServerUrl="https://your-document-server.com"
        config={editorConfig}
        width="100%"
        height="100%"
      />
    </div>
  );
}
```

## Best Practices

1. **Unique Document Keys**: Always use unique keys for each document to prevent caching issues
2. **Error Handling**: Implement `onLoadComponentError` to gracefully handle loading failures
3. **Responsive Design**: Set appropriate width and height based on your layout requirements
4. **Security**: Ensure your Document Server URL is properly secured and accessible
5. **Callback URL**: Configure a callback URL in production to receive document save notifications
6. **Permissions**: Set appropriate document permissions based on user roles

## Common Use Cases

### Embedded Document Viewer

```tsx
<DocumentEditor
  id="embeddedViewer"
  documentServerUrl="https://your-document-server.com"
  config={{
    document: {
      fileType: "pdf",
      key: "pdf-key",
      title: "Report.pdf",
      url: "https://example.com/report.pdf",
      permissions: { edit: false },
    },
    documentType: "word",
    editorConfig: {
      mode: "view",
      customization: {
        hideRightMenu: true,
        hideRulers: true,
      },
    },
  }}
  height="600px"
/>
```

### Collaborative Editing

```tsx
<DocumentEditor
  id="collaborativeEditor"
  documentServerUrl="https://your-document-server.com"
  config={{
    document: {
      fileType: "docx",
      key: "collab-doc-key",
      title: "Team Document.docx",
      url: "https://example.com/team-doc.docx",
    },
    documentType: "word",
    editorConfig: {
      mode: "edit",
      user: {
        id: currentUser.id,
        name: currentUser.name,
      },
      coEditing: {
        mode: "fast",
        change: true,
      },
    },
  }}
/>
```

## Troubleshooting

### Editor Not Loading

- Verify `documentServerUrl` is accessible
- Check that the document URL is publicly accessible
- Ensure CORS is properly configured on your document server
- Implement `onLoadComponentError` to capture specific error codes

### Document Key Issues

- Use unique keys for each document version
- Keys should be consistent across page reloads for the same document
- Changing the key will create a new editing session
