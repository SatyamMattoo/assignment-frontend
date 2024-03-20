import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const columns = [
  {
    key: "username",
    label: "NAME",
  },
  {
    key: "language",
    label: "CODE LANGUAGE",
  },
  {
    key: "stdin",
    label: "INPUT",
  },
  {
    key: "stdout",
    label: "OUTPUT",
  },
  {
    key: "sourceCode",
    label: "SOURCE CODE",
  },
  {
    key: "timeStamp",
    label: "TIME STAMP",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

export default function TableCom({ rows, tableSchema, message }) {
  const [sortDescriptor, setSortDescriptor] = React.useState({
    direction: "ascending",
  });

  // sort items when the <sortDescriptor> or <filterValue> changes
  const sortedItems = useMemo(() => {
    const filteredRows = rows.filter((row) => {
      const value = String(row[columns[1]]); // Ensure the value is a string
      return value.toLowerCase();
    });

    return filteredRows.sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, rows]);

  return (
    <Table
      isHeaderSticky
      className="rounded-xl bg-white"
      aria-label="Table"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(columns) => (
          <TableColumn key={columns.key} allowsSorting={true}>
            {columns.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={message} items={sortedItems}>
        {(rows) => (
          <TableRow key={rows.key}>
            {(columnKey) => (
              <TableCell>{tableSchema(rows, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
