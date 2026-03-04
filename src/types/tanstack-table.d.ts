import type { RowData } from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    srOnly?: boolean
    flushLeft?: boolean
    flushRight?: boolean
    width?: React.CSSProperties["width"]
    actions?: boolean
  }
}
