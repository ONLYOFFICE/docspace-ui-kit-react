export const LoaderWrapper = ({
  children,
  isLoading,
  testId,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  testId?: string;
}) => {
  return (
    <div
      style={{
        opacity: isLoading
          ? "var(--loader-wrapper-loading-opacity, 0.5)"
          : "var(--loader-wrapper-idle-opacity, 1)",
        pointerEvents: isLoading ? "none" : "auto",
        transition: "var(--loader-wrapper-transition, opacity 0.3s ease-in-out)",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        // Without this the wrapper cannot shrink below its content height
        // (min-height: auto) and blows out bounded flex parents like the
        // section body in fullHeightBody (chat) mode, so the section scroller
        // scrolls the whole chat instead of the inner viewports. In
        // content-sized parents a zero min-height changes nothing.
        minHeight: 0,
      }}
      data-testid={testId || "loader-wrapper"}
    >
      {children}
    </div>
  );
};
