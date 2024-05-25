import {
  functionalUpdate,
  makeStateUpdater,
  type Row,
  type RowData,
  type Table,
  type TableFeature,
  type TableOptionsResolved,
  type TableState,
  type Updater,
} from "@tanstack/table-core";
import type {
  HoveringRowAPI,
  HoveringTableAPI,
  HoveringOptions,
  RowHoveringState,
  HoveringTableState,
} from "./types.mjs";

/**
 * The Hovering feature definition.
 *
 * Example:
 *
 * ```tsx
 * import { useReactTable } from "@tanstack/react-table";
 * import { HoveringFeature } from "tanstack-table-hovering";
 *
 * const columnHelper = createColumnHelper<Data>();
 *
 * const columns = [
 *   columnHelper.accesor('name', {
 *     header: 'Name',
 *   }),
 *   columnHelper.display({
 *     id: 'actions',
 *     cell: ({ row }) => {
 *       if (!row.getIsHovered()) {
 *         return null;
 *       }
 *
 *       return <button onClick={() => alert('Clicked!')}>Click me</button>;
 *     },
 *     header: 'Actions',
 *   }),
 * ];
 *
 * const table = useReactTable({
 *   ...
 *   columns,
 *   _features: [HoveringFeature],
 *   ...
 * });
 *
 * return (
 *  <table>
 *    <tbody>
 *      {table.rows.map(row => (
 *        <tr
 *          key={row.id}
 *          onMouseEnter={() => row.toggleHovered()}
 *          onMouseLeave={() => row.toggleHovered()}
 *        >
 *          {row.cells.map(cell => (
 *            <td key={cell.id}>
 *              {flexRender(cell.column.columnDef.cell, cell.getContext())}
 *            </td>
 *          ))}
 *        </tr>
 *      ))}
 *    </tbody>
 *  </table>
 * )
 * ```
 */
export const HoveringFeature = {
  createRow<TData extends RowData>(row: Row<TData>, table: Table<TData>): void {
    type RowWithHover = Row<TData> & HoveringRowAPI;

    (row as RowWithHover).getIsHovered = () =>
      Boolean((table.getState() as HoveringTableState).rowHovering?.[row.id]);

    (row as RowWithHover).toggleHovered = () =>
      table.setState((old: TableState & HoveringTableState) => ({
        ...old,
        rowHovering: {
          ...old.rowHovering,
          [row.id]: !old.rowHovering?.[row.id],
        },
      }));
  },

  createTable<TData extends RowData>(table: Table<TData>): void {
    type TableWithHover = Table<TData> & HoveringTableAPI<TData>;

    (table as TableWithHover).getHoveredRows = () =>
      Object.entries((table.getState() as HoveringTableState).rowHovering || {})
        .filter(([, isHovered]) => isHovered)
        .map(([id]) => table.getRow(id));

    (table as TableWithHover).setHoveredRows = (updater) => {
      const safeUpdater: Updater<RowHoveringState | undefined> = (old) =>
        functionalUpdate(updater, old);

      return (table.options as HoveringOptions).onRowHoveringChange?.(
        safeUpdater
      );
    };
  },

  getDefaultOptions<TData extends RowData>(
    table: Table<TData>
  ): Partial<TableOptionsResolved<TData>> & HoveringOptions {
    return {
      onRowHoveringChange: makeStateUpdater("hovering" as any, table),
    };
  },

  getInitialState(state): Partial<TableState> & HoveringTableState {
    return {
      rowHovering: {},
      ...(state as Partial<TableState>),
    };
  },
} satisfies TableFeature;
