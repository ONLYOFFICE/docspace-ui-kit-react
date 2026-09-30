import { useState } from "react";

import CheckIcon from "../../assets/check.react.svg";

import { MATRICES, PORTAL_TYPES, ROOM_ROLES, type TMatrixName } from "./matrix";
import styles from "./AccessMatrix.module.scss";

type TColumn = { key: string; label: string; code: string };

type AccessMatrixProps = {
  /** Which table of `matrix.ts` to draw. */
  name: TMatrixName;
};

/**
 * One access table: actions down the side, user types or room roles across
 * the top. A header is a toggle that highlights its column, so a reader can
 * follow one type or role down the whole table.
 */
export const AccessMatrix = ({ name }: AccessMatrixProps) => {
  const matrix = MATRICES[name];
  const [focus, setFocus] = useState<string | null>(null);

  const all: readonly TColumn[] =
    matrix.axis === "type" ? PORTAL_TYPES : ROOM_ROLES;
  const keys: readonly string[] =
    "columns" in matrix ? matrix.columns : all.map((column) => column.key);
  const columns = all.filter((column) => keys.includes(column.key));

  return (
    <div className={styles.wrapper}>
      <table className={styles.table} data-testid={`access-${matrix.id}`}>
        <caption className={styles.caption}>{matrix.title}</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.action}>
              Action
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={styles.column}
                data-focus={focus === column.key ? "true" : undefined}
              >
                <button
                  type="button"
                  className={styles.toggle}
                  aria-pressed={focus === column.key}
                  title={column.code}
                  onClick={() =>
                    setFocus((current) =>
                      current === column.key ? null : column.key,
                    )
                  }
                >
                  {column.label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((row) => (
            <tr key={row.action}>
              <th scope="row" className={styles.action}>
                {row.action}
              </th>
              {columns.map((column) => {
                const allowed = (row.allowed as readonly string[]).includes(
                  column.key,
                );
                return (
                  <td
                    key={column.key}
                    className={styles.cell}
                    data-allowed={allowed ? "true" : "false"}
                    data-focus={focus === column.key ? "true" : undefined}
                  >
                    {allowed ? (
                      <CheckIcon
                        className={styles.check}
                        role="img"
                        aria-label="Yes"
                      />
                    ) : (
                      <span className={styles.no} aria-label="No">
                        {"—"}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
