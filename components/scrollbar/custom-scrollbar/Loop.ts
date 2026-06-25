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

interface UpdatableItem {
  _unmounted?: boolean;
  update: () => unknown;
}

export class RAFLoop {
  /**
   * @description List of targets to update
   */
  private readonly targets: UpdatableItem[] = [];

  /**
   * @description ID of requested animation frame. Valuable only if loop is active and has items to iterate.
   */
  private animationFrameID = 0;

  /**
   * @description Loop's state.
   */
  private _isActive = false;

  /**
   * @description Loop's state.
   */
  public get isActive(): boolean {
    return this._isActive;
  }

  /**
   * @description Start the loop if it wasn't yet.
   */
  public start = (): this => {
    if (!this._isActive && this.targets.length) {
      this._isActive = true;

      if (this.animationFrameID) cancelAnimationFrame(this.animationFrameID);
      this.animationFrameID = requestAnimationFrame(this.rafCallback);
    }

    return this;
  };

  /**
   * @description Stop the loop if is was active.
   */
  public stop = (): this => {
    if (this._isActive) {
      this._isActive = false;

      if (this.animationFrameID) cancelAnimationFrame(this.animationFrameID);
      this.animationFrameID = 0;
    }

    return this;
  };

  /**
   * @description Add target to the iteration list if it's not there.
   */
  public addTarget = (target: UpdatableItem, silent = false): this => {
    if (!this.targets.includes(target)) {
      this.targets.push(target);

      if (this.targets.length === 1 && !silent) this.start();
    }

    return this;
  };

  /**
   * @description Remove target from iteration list if it was there.
   */
  public removeTarget = (target: UpdatableItem): this => {
    const idx = this.targets.indexOf(target);

    if (idx !== -1) {
      this.targets.splice(idx, 1);

      if (this.targets.length === 0) this.stop();
    }

    return this;
  };

  /**
   * @description Callback that called each animation frame.
   */
  private rafCallback = (): number => {
    if (!this._isActive) {
      return 0;
    }

    for (let i = 0; i < this.targets.length; i++) {
      if (!this.targets[i]._unmounted) this.targets[i].update();
    }

    this.animationFrameID = requestAnimationFrame(this.rafCallback);
    return this.animationFrameID;
  };
}

export default new RAFLoop();
