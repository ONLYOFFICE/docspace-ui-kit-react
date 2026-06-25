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

// @ts-nocheck
import { isFun, isNum, isUndef } from "./util";

type EventHandler = (...args: unknown[]) => void;
type OnceHandler = OnceHandlerState & { (...args: unknown[]): void };
type EventHandlersList = (OnceHandler | EventHandler)[];
type EmitterEventHandlers = { [key: string]: EventHandlersList };
type OnceHandlerState = {
  fired: boolean;
  handler: EventHandler;
  wrappedHandler?: OnceHandler;
  emitter: Emittr;
  event: string;
};

export default class Emittr {
  private _handlers: EmitterEventHandlers;

  // @ts-expect-error error from custom scrollbar
  private _maxHandlers: number;

  constructor(maxHandlers = 10) {
    this.setMaxHandlers(maxHandlers);
    this._handlers = Object.create(null);
  }

  private static _callEventHandlers(
    emitter: Emittr,
    handlers: EventHandlersList,
    args: unknown[],
  ) {
    if (!handlers.length) {
      return;
    }
    if (handlers.length === 1) {
      Reflect.apply(handlers[0], emitter, args);
      return;
    }
    handlers = [...handlers];
    let idx;
    for (idx = 0; idx < handlers.length; idx++) {
      Reflect.apply(handlers[idx], emitter, args);
    }
  }

  private static _addHandler = (
    emitter: Emittr,
    name: string,
    handler: EventHandler,
    prepend = false,
  ): Emittr => {
    if (!isFun(handler)) {
      throw new TypeError(
        `Expected event handler to be a function, got ${typeof handler}`,
      );
    }
    emitter._handlers[name] = emitter._handlers[name] || [];
    emitter.emit("addHandler", name, handler);

    if (prepend) {
      emitter._handlers[name].unshift(handler);
    } else {
      emitter._handlers[name].push(handler);
    }

    return emitter;
  };

  private static _onceWrapper = function _onceWrapper(...args: unknown[]) {
    // @ts-expect-error error from custom scrollbar
    if (!this.fired) {
      // @ts-expect-error error from custom scrollbar
      this.fired = true;
      // @ts-expect-error error from custom scrollbar
      this.emitter.off(this.event, this.wrappedHandler);
      // @ts-expect-error error from custom scrollbar
      Reflect.apply(this.handler, this.emitter, args);
    }
  };

  private static _removeHandler = (
    emitter: Emittr,
    name: string,
    handler: EventHandler,
  ): Emittr => {
    if (!isFun(handler)) {
      throw new TypeError(
        `Expected event handler to be a function, got ${typeof handler}`,
      );
    }
    // @ts-expect-error error from custom scrollbar
    if (isUndef(emitter._handlers[name]) || !emitter._handlers[name].length) {
      return emitter;
    }

    let idx = -1;
    // @ts-expect-error error from custom scrollbar
    if (emitter._handlers[name].length === 1) {
      if (
        emitter._handlers[name][0] === handler ||
        (emitter._handlers[name][0] as OnceHandler).handler === handler
      ) {
        idx = 0;
        handler =
          (emitter._handlers[name][0] as OnceHandler).handler ||
          emitter._handlers[name][0];
      }
    } else {
      // @ts-expect-error error from custom scrollbar
      for (idx = emitter._handlers[name].length - 1; idx >= 0; idx--) {
        if (
          emitter._handlers[name][idx] === handler ||
          (emitter._handlers[name][idx] as OnceHandler).handler === handler
        ) {
          handler =
            (emitter._handlers[name][idx] as OnceHandler).handler ||
            emitter._handlers[name][idx];
          break;
        }
      }
    }
    if (idx === -1) {
      return emitter;
    }

    if (idx === 0) {
      // @ts-expect-error error from custom scrollbar
      emitter._handlers[name].shift();
    } else {
      // @ts-expect-error error from custom scrollbar
      emitter._handlers[name].splice(idx, 1);
    }

    emitter.emit("removeHandler", name, handler);
    return emitter;
  };

  setMaxHandlers(count: number): this {
    if (!isNum(count) || count <= 0) {
      throw new TypeError(
        `Expected maxHandlers to be a positive number, got '${count}' of type ${typeof count}`,
      );
    }
    this._maxHandlers = count;
    return this;
  }

  getMaxHandlers(): number {
    return this._maxHandlers;
  }

  public emit(name: string, ...args: unknown[]): boolean {
    if (
      typeof this._handlers[name] !== "object" ||
      !Array.isArray(this._handlers[name])
    ) {
      return false;
    }
    Emittr._callEventHandlers(this, this._handlers[name], args);
    return true;
  }

  public on(name: string, handler: EventHandler): this {
    Emittr._addHandler(this, name, handler);
    return this;
  }

  public prependOn(name: string, handler: EventHandler): this {
    Emittr._addHandler(this, name, handler, true);
    return this;
  }

  public once(name: string, handler: EventHandler): this {
    if (!isFun(handler)) {
      throw new TypeError(
        `Expected event handler to be a function, got ${typeof handler}`,
      );
    }
    Emittr._addHandler(this, name, this._wrapOnceHandler(name, handler));
    return this;
  }

  public prependOnce(name: string, handler: EventHandler): this {
    if (!isFun(handler)) {
      throw new TypeError(
        `Expected event handler to be a function, got ${typeof handler}`,
      );
    }
    Emittr._addHandler(this, name, this._wrapOnceHandler(name, handler), true);
    return this;
  }

  public off(name: string, handler: EventHandler): this {
    Emittr._removeHandler(this, name, handler);
    return this;
  }

  public removeAllHandlers(): this {
    const handlers = this._handlers;
    this._handlers = Object.create(null);
    const removeHandlers = handlers.removeHandler;
    delete handlers.removeHandler;
    let idx;
    let eventName;
    for (eventName in handlers) {
      for (idx = handlers[eventName].length - 1; idx >= 0; idx--) {
        Emittr._callEventHandlers(this, removeHandlers, [
          eventName,
          (handlers[eventName][idx] as OnceHandler).handler ||
            handlers[eventName][idx],
        ]);
      }
    }
    return this;
  }

  private _wrapOnceHandler(name: string, handler: EventHandler): OnceHandler {
    const onceState: OnceHandlerState = {
      fired: false,
      handler,
      wrappedHandler: undefined,
      emitter: this,
      event: name,
    };
    // @ts-expect-error error from custom scrollbar
    const wrappedHandler: OnceHandler = Emittr._onceWrapper.bind(onceState);
    onceState.wrappedHandler = wrappedHandler;
    wrappedHandler.handler = handler;
    wrappedHandler.event = name;
    return wrappedHandler;
  }
}
