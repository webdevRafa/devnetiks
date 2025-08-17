// src/components/TableComponent.tsx
import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

function DataTable<T>({
  data,
  columns,
  emptyMessage = "No data.",
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {columns.map((col) => (
              <th
                key={col.header}
                className="px-4 py-3 text-left font-medium text-white/70 tracking-wide"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!data || data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-white/60"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-white/10 hover:bg-[var(--color-card-hover)] transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.header)}
                    className="px-4 py-3 text-white/90"
                  >
                    {col.render
                      ? col.render((row as any)[col.accessor], row)
                      : String((row as any)[col.accessor] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
