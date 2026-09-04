"use client";

import React from "react";
import type { ErrorInfo, PropsWithChildren, ReactNode } from "react";

import ErrorContainer from "../../components/error-container/ErrorContainer";

export type TErrorBoundaryProps = PropsWithChildren<{
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}>;

type TErrorBoundaryState = {
  error: Error | null;
};

class ErrorBoundary extends React.Component<
  TErrorBoundaryProps,
  TErrorBoundaryState
> {
  constructor(props: TErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  public static getDerivedStateFromError(error?: Error): TErrorBoundaryState {
    return { error: error ?? new Error("Unhandled exception") };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    onError?.(error, errorInfo);
  }

  public render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (typeof fallback === "function") return fallback(error);
      if (fallback) return fallback;

      return (
        <ErrorContainer
          headerText="Something went wrong"
          customizedBodyText={error.message}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
