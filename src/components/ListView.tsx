import React from "react";

interface ListViewProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

function ListView<T>({
  items,
  renderItem,
  emptyMessage = "No items found.",
}: ListViewProps<T>) {
  if (!items.length) {
    return <div className="text-center text-gray-500 py-4">{emptyMessage}</div>;
  }

  return <ul className="divide-y divide-gray-200">{items.map(renderItem)}</ul>;
}

export default ListView;
