import { WebSearchPage } from "@onlyoffice/ai-chat";

import styles from "./WebSearch.module.scss";

const WebSearch = () => {
  return (
    <WebSearchPage
      hideHeader
      noPadding
      isHorizontal={false}
      className={styles.webSearch}
    />
  );
};

export default WebSearch;
