// Extend styled-components DefaultTheme to be flexible for ui-kit usage
import "styled-components";

declare module "styled-components" {
  // DefaultTheme is extended in the consuming application (packages/shared)
  // This ensures the ui-kit library can work with any theme structure
  export interface DefaultTheme {
    [key: string]: unknown;
  }
}
