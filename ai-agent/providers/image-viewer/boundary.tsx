import { Component, type ReactNode } from "react";

type ImageViewerBoundaryProps = {
  /** Closes the viewer, so the chat under it is usable again. */
  onClose: VoidFunction;
  children: ReactNode;
};

type ImageViewerBoundaryState = { failed: boolean };

/**
 * Keeps a failure of the chat's image viewer inside the viewer. The viewer is
 * loaded on the first picture opened, and its chunk is gone from the server
 * after a deployment for a tab that was opened before it; without a boundary
 * here that rejected import reaches the host's own, which sits above the whole
 * app. The picture stays closed and the chat goes on.
 */
export class ImageViewerBoundary extends Component<
  ImageViewerBoundaryProps,
  ImageViewerBoundaryState
> {
  state: ImageViewerBoundaryState = { failed: false };

  static getDerivedStateFromError(): ImageViewerBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("AI chat: the image viewer failed to open", error);
    this.props.onClose();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
