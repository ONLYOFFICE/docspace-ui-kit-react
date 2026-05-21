import type { FC, HTMLAttributes } from "react";

interface ReactSVGProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  wrapper?: string;
  afterInjection?: unknown;
  beforeInjection?: unknown;
  evalScripts?: unknown;
  fallback?: unknown;
  httpRequestWithCredentials?: unknown;
  loading?: unknown;
  renumerateIRIElements?: unknown;
  useRequestCache?: unknown;
}

export const ReactSVG: FC<ReactSVGProps> = ({
  src: _src,
  wrapper: _wrapper,
  afterInjection: _ai,
  beforeInjection: _bi,
  evalScripts: _es,
  fallback: _f,
  httpRequestWithCredentials: _http,
  loading: _l,
  renumerateIRIElements: _ri,
  useRequestCache: _urc,
  ...rest
}) => <div {...rest} />;

export default ReactSVG;
