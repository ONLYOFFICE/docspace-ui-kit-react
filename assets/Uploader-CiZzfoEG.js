import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{a as s,c,d as l,i as u,l as d,n as f,o as p,r as m,s as h,t as g,u as _}from"./Uploader.stories-BKyVmWYt.js";function v(e){let t={code:`code`,h1:`h1`,h3:`h3`,p:`p`,pre:`pre`,...a(),...e.components};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(n,{of:c}),`
`,(0,b.jsx)(t.h1,{id:`uploader`,children:`Uploader`}),`
`,(0,b.jsx)(t.p,{children:`Uploader is a file upload component that supports chunked uploads, folder uploads, and file size validation. It uses the ONLYOFFICE Apps API SDK for upload operations and provides a drag-and-drop interface.`}),`
`,(0,b.jsx)(t.h3,{id:`default-file-upload`,children:`Default file upload`}),`
`,(0,b.jsx)(t.p,{children:`This example shows the basic file uploader with multiple file support and file type restrictions.`}),`
`,(0,b.jsx)(r,{of:m}),`
`,(0,b.jsx)(t.p,{children:`Basic usage with file type restrictions and multiple file upload enabled:`}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-tsx`,children:`<Uploader
  width="800px"
  height="300px"
  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
  shortText="PDF, DOC, DOCX, XLS, XLSX"
  fullText="PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX"
  badgeValue={2}
  linkMainText="Upload files"
  secondaryText="or drag and drop files here"
  isMultipleUpload={true}
  targetId="123"
/>
`})}),`
`,(0,b.jsx)(t.h3,{id:`single-file-upload`,children:`Single file upload`}),`
`,(0,b.jsx)(t.p,{children:`Demonstrates uploading a single file at a time.`}),`
`,(0,b.jsx)(r,{of:p}),`
`,(0,b.jsxs)(t.p,{children:[`Restrict to single file upload by setting `,(0,b.jsx)(t.code,{children:`isMultipleUpload`}),` to false:`]}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-tsx`,children:`<Uploader
  linkMainText="Upload file"
  secondaryText="or drag and drop a file here"
  isMultipleUpload={false}
  targetId="123"
/>
`})}),`
`,(0,b.jsx)(t.h3,{id:`folder-upload`,children:`Folder upload`}),`
`,(0,b.jsx)(t.p,{children:`Shows how to enable folder upload mode for uploading entire directories.`}),`
`,(0,b.jsx)(r,{of:u}),`
`,(0,b.jsxs)(t.p,{children:[`Enable folder upload with `,(0,b.jsx)(t.code,{children:`isFolderUpload`}),` prop:`]}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-tsx`,children:`<Uploader
  shortText="Any files"
  linkMainText="Upload folder"
  secondaryText="or drag and drop a folder here"
  isFolderUpload={true}
  isMultipleUpload={true}
  targetId="123"
/>
`})}),`
`,(0,b.jsx)(t.h3,{id:`single-folder-upload`,children:`Single folder upload`}),`
`,(0,b.jsx)(t.p,{children:`Demonstrates uploading a single folder at a time.`}),`
`,(0,b.jsx)(r,{of:h}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-tsx`,children:`<Uploader
  linkMainText="Upload folder"
  secondaryText="or drag and drop a folder here"
  isFolderUpload={true}
  isMultipleUpload={false}
  targetId="123"
/>
`})}),`
`,(0,b.jsx)(t.h3,{id:`image-upload`,children:`Image upload`}),`
`,(0,b.jsx)(t.p,{children:`Specialized uploader for image files only.`}),`
`,(0,b.jsx)(r,{of:s}),`
`,(0,b.jsx)(t.p,{children:`Restrict to image file types:`}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-tsx`,children:`<Uploader
  accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
  shortText="PNG, JPG, JPEG, GIF"
  fullText="PNG, JPG, JPEG, GIF, WEBP, SVG"
  badgeValue={2}
  linkMainText="Upload images"
  secondaryText="or drag and drop images here"
  targetId="123"
/>
`})}),`
`,(0,b.jsx)(t.h3,{id:`with-size-limit`,children:`With size limit`}),`
`,(0,b.jsx)(t.p,{children:`Shows how to set maximum file size per upload.`}),`
`,(0,b.jsx)(r,{of:d}),`
`,(0,b.jsxs)(t.p,{children:[`Set maximum file size with `,(0,b.jsx)(t.code,{children:`maxPerUploadSize`}),`:`]}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-tsx`,children:`<Uploader
  linkMainText="Upload files (max 10MB each)"
  maxPerUploadSize="10MB"
  targetId="123"
/>
`})}),`
`,(0,b.jsx)(t.h3,{id:`with-total-size-limit`,children:`With total size limit`}),`
`,(0,b.jsx)(t.p,{children:`Demonstrates setting both per-file and total upload size limits.`}),`
`,(0,b.jsx)(r,{of:_}),`
`,(0,b.jsx)(t.p,{children:`Set both individual and total size limits:`}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-tsx`,children:`<Uploader
  linkMainText="Upload files (max 100MB total)"
  maxPerUploadSize="10MB"
  maxTotalUploadSize="100MB"
  targetId="123"
/>
`})}),`
`,(0,b.jsx)(t.h3,{id:`any-file-types`,children:`Any file types`}),`
`,(0,b.jsx)(t.p,{children:`Allows uploading any file type without restrictions.`}),`
`,(0,b.jsx)(r,{of:g}),`
`,(0,b.jsx)(t.p,{children:`Accept all file types with wildcard:`}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-tsx`,children:`<Uploader
  accept="*"
  shortText="Any files"
  linkMainText="Upload any files"
  secondaryText="All file types are accepted"
  targetId="123"
/>
`})}),`
`,(0,b.jsx)(t.h3,{id:`custom-upload-settings`,children:`Custom upload settings`}),`
`,(0,b.jsx)(t.p,{children:`Shows how to customize chunk size, thread count, and concurrent file uploads.`}),`
`,(0,b.jsx)(r,{of:f}),`
`,(0,b.jsxs)(t.p,{children:[`Configure upload behavior with `,(0,b.jsx)(t.code,{children:`filesSettings`}),`:`]}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-tsx`,children:`<Uploader
  filesSettings={{
    chunkUploadSize: 10 * 1024 * 1024,
    maxUploadThreadCount: 5,
    maxUploadFilesCount: 3,
  }}
  linkMainText="Upload with custom settings"
  secondaryText="10MB chunks, 5 threads, 3 files at once"
  targetId="123"
/>
`})})]})}function y(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,b.jsx)(t,{...e,children:(0,b.jsx)(v,{...e})}):v(e)}var b;function x(){return(x=e((()=>{b=i(),o(),t(),l()})))()}x();export{y as default};