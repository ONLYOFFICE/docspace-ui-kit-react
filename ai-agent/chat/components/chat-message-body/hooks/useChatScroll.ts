/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect, useEffectEvent, useRef } from "react";

import ChatStore from "../../../store/chatStore";
import MessageStore from "../../../store/messageStore";
import { useChatScrollContext } from "../../../providers/ChatScrollProvider";

type Props = {
  chatBodyRef: React.RefObject<HTMLDivElement | null>;
  isEmpty?: boolean;
  fetchNextMessages: VoidFunction;
  currentChat: ChatStore["currentChat"];
  messages: MessageStore["messages"];
};

export const useChatScroll = ({
  chatBodyRef,
  isEmpty,
  fetchNextMessages,
  currentChat,
  messages,
}: Props) => {
  const { scrollbarRef } = useChatScrollContext();

  const prevScrollTopRef = useRef(0);
  const disableAutoScrollRef = useRef(false);
  const prevBodyHeight = useRef(0);

  // toggle auto scroll
  // fetch prev messages if user is at the top
  const onScroll = useEffectEvent((e: Event) => {
    const scrollEl = e.currentTarget as HTMLDivElement;
    if (!scrollEl) return;

    const chatBodyOffsetHeight = chatBodyRef.current?.offsetHeight || 0;

    const currentHeight =
      scrollEl.scrollTop +
      scrollEl.clientHeight -
      (scrollEl.scrollHeight - chatBodyOffsetHeight);

    const isScrollToTop = prevScrollTopRef.current > scrollEl.scrollTop;
    const scrollThreshold = isScrollToTop ? 5 : 50;

    if (isScrollToTop) {
      disableAutoScrollRef.current = true;
    }

    if (
      currentHeight === chatBodyOffsetHeight ||
      Math.abs(currentHeight - chatBodyOffsetHeight) < scrollThreshold ||
      chatBodyOffsetHeight < currentHeight
    ) {
      disableAutoScrollRef.current = false;
    }

    if (scrollEl.scrollTop < 500 + scrollEl.clientHeight) {
      fetchNextMessages();
    }

    prevScrollTopRef.current = scrollEl.scrollTop;
  });

  // Scroll setter
  useEffect(() => {
    const scroll = scrollbarRef?.current;

    if (!scroll) return;

    scroll.addEventListener("scroll", onScroll);

    return () => {
      scroll.removeEventListener("scroll", onScroll);
    };
  }, [scrollbarRef?.current]);

  // enable auto scroll on chat change
  useEffect(() => {
    disableAutoScrollRef.current = false;
  }, [currentChat]);

  // scroll to bottom if anything changes (if autoscroll is not disabled)
  useEffect(() => {
    if (isEmpty || disableAutoScrollRef.current) return;

    const scrollEl = scrollbarRef?.current;

    requestAnimationFrame(() => {
      if (disableAutoScrollRef.current) return;
      scrollEl?.scrollTo(0, scrollEl.scrollHeight);
    });
  });

  // scroll to bottom if messages are added
  useEffect(() => {
    if (!chatBodyRef.current) return;

    const bodyHeight = chatBodyRef.current?.clientHeight;
    const diff = bodyHeight - prevBodyHeight.current;
    if (diff !== 0) {
      prevBodyHeight.current = bodyHeight;
    }

    if (prevScrollTopRef.current === 0 && diff > 0) {
      scrollbarRef?.current?.scrollTo(0, diff);
    }
  }, [messages.length]);
};
