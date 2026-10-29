import React from "react";
import { describe, expect, it } from "vitest";
import { render, renderHook } from "@testing-library/react";

import {
  ContextRoomProvider,
  useContextRoom,
  useContextRooms,
  type ContextRoom,
} from "./index";

const withProvider = (props: {
  room?: ContextRoom | null;
  rooms?: ContextRoom[] | null;
}) =>
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <ContextRoomProvider {...props}>{children}</ContextRoomProvider>;
  };

const skills = { id: "12", name: "Skills" };
const legal = { id: "13", name: "Legal tone" };

describe("ContextRoomProvider", () => {
  it("offers no room outside one", () => {
    const { result } = renderHook(
      () => ({ rooms: useContextRooms(), room: useContextRoom() }),
      { wrapper: withProvider({ room: null }) },
    );
    expect(result.current.rooms).toEqual([]);
    expect(result.current.room).toBeNull();
  });

  it("offers the one room a section passes", () => {
    const { result } = renderHook(
      () => ({ rooms: useContextRooms(), room: useContextRoom() }),
      { wrapper: withProvider({ room: skills }) },
    );
    expect(result.current.rooms).toEqual([skills]);
    expect(result.current.room).toEqual(skills);
  });

  it("offers a project's rooms, which win over the single room", () => {
    const { result } = renderHook(
      () => ({ rooms: useContextRooms(), room: useContextRoom() }),
      { wrapper: withProvider({ room: legal, rooms: [skills, legal] }) },
    );
    expect(result.current.rooms).toEqual([skills, legal]);
    expect(result.current.room).toEqual(skills);
  });

  it("keeps the same value for the same rooms, and a new one when they change", () => {
    let seen: ContextRoom[] = [];
    const Reader = () => {
      seen = useContextRooms();
      return null;
    };
    const Tree = ({ rooms }: { rooms: ContextRoom[] }) => (
      <ContextRoomProvider rooms={rooms}>
        <Reader />
      </ContextRoomProvider>
    );
    const { rerender } = render(<Tree rooms={[{ ...skills }, { ...legal }]} />);
    const first = seen;
    expect(first).toEqual([skills, legal]);

    rerender(<Tree rooms={[{ ...skills }, { ...legal }]} />);
    expect(seen).toBe(first);

    rerender(
      <Tree
        rooms={[{ ...skills }, { id: "13", name: "Legal tone (renamed)" }]}
      />,
    );
    expect(seen).not.toBe(first);
    expect(seen[1].name).toBe("Legal tone (renamed)");

    rerender(<Tree rooms={[]} />);
    expect(seen).toEqual([]);
  });
});
