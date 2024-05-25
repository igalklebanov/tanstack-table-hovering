import type { OnChangeFn, Row, Updater } from "@tanstack/react-table";

export interface HoveringOptions {
  onRowHoveringChange?: OnChangeFn<RowHoveringState | undefined>;
}

export type RowHoveringState = Record<string, boolean>;

export interface HoveringTableState {
  rowHovering?: RowHoveringState;
}

export interface HoveringTableAPI<TData> {
  getHoveredRows(): Row<TData>[];
  setHoveredRows(updater: Updater<RowHoveringState | undefined>): void;
}

export interface HoveringRowAPI {
  getIsHovered(): boolean;
  toggleHovered(): void;
}
