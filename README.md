A custom @tanstack/\*-table feature that allows conditional rendering based on hovering over a row. e.g. rendering buttons in a cell only for the hovered row.

## Installation

```bash
npm i tanstack-table-hovering
```

## Usage

### Augment @tanstack/\*-table module

```ts
import type { RowData } from "@tanstack/react-table";
import type {
  HoveringOptions,
  HoveringRowAPI,
  HoveringTableAPI,
  HoveringTableState,
} from "tanstack-table-hovering";

declare module "@tanstack/react-table" {
  interface TableState extends HoveringTableState {}

  interface TableOptionsResolved<TData extends RowData>
    extends HoveringOptions {}

  interface Table<TData extends RowData> extends HoveringTableAPI<TData> {}

  interface Row<TData extends RowData> extends HoveringRowAPI {}
}
```

### Pass the feature to the use\*Table hook

```tsx
import { useReactTable } from "@tanstack/react-table";
import { HoveringFeature } from 'tanstack-table-hovering';

export interface MyTableProps {
  ...
}

export function MyTable(props: MyTableProps) {
  ...

  const table = useReactTable({
    _features: [HoveringFeature],
    ...
  })
}
```

### Update the table state on mouse enter and leave events

```tsx
...
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
...
```

### Use the hovering state in the cell renderer

```tsx
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
```
