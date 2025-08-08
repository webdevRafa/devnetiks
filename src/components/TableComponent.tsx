interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-50">
          {columns.map((col) => (
            <th
              key={col.header}
              className="px-4 py-2 text-left text-sm font-medium text-gray-500"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center text-gray-500 py-4"
            >
              No data available.
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={idx} className="border-t border-gray-200">
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-2 text-sm">
                  {col.render
                    ? col.render(row[col.accessor], row)
                    : String(row[col.accessor])}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default DataTable;
