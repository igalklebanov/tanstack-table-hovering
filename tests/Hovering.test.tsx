import React, { useState } from "react";
import {
  RowData,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import {
  HoveringFeature,
  type HoveringOptions,
  type HoveringRowAPI,
  type HoveringTableAPI,
  type HoveringTableState,
} from "../dist/index.js";

declare module "@tanstack/react-table" {
  interface TableState extends HoveringTableState {}

  interface TableOptionsResolved<TData extends RowData>
    extends HoveringOptions {}

  interface Table<TData extends RowData> extends HoveringTableAPI<TData> {}

  interface Row<TData extends RowData> extends HoveringRowAPI {}
}

interface Person {
  firstName: string;
}

const defaultData: Person[] = [
  { firstName: "tanner" },
  { firstName: "derek" },
  { firstName: "joe" },
];

const columnHelper = createColumnHelper<Person>();

const defaultColumns = [
  columnHelper.accessor("firstName", {
    header: "First Name",
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      if (!row.getIsHovered()) {
        return null;
      }

      return <button role="button">Moshe</button>;
    },
  }),
];

describe("Hovering", () => {
  it("should render a cell conditionally based on whether its row is being hovered on", async () => {
    const TestTable = () => {
      const [columns] = useState(() => [...defaultColumns]);

      const [data] = useState(() => [...defaultData]);

      const table = useReactTable({
        _features: [HoveringFeature],
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
      });

      return (
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onMouseEnter={() => row.toggleHovered()}
                onMouseLeave={() => row.toggleHovered()}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    const user = userEvent.setup();

    const rendered = render(<TestTable />);

    expect(rendered.queryByRole("button")).not.toBeInTheDocument();

    const [, row, ...otherRows] = screen.getAllByRole("row");

    await user.hover(row);

    expect(within(row).queryByRole("button")).toBeInTheDocument();
    otherRows.forEach((row) => {
      expect(within(row).queryByRole("button")).not.toBeInTheDocument();
    });

    await user.unhover(row);

    expect(rendered.queryByRole("button")).not.toBeInTheDocument();
  });
});
