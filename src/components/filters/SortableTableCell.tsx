import { TableCell, TableSortLabel } from "@mui/material";

type Align = "left" | "center" | "right";

interface SortableTableCellProps<T extends string = string> {
  columnKey: T;
  currentSortColumn: T;
  currentSortDirection: "asc" | "desc";
  handleSort: (column: T, nextDirection?: "asc" | "desc") => void;
  label: string;
  align?: Align;
}

const SortableTableCell = <T extends string>({
  columnKey,
  currentSortColumn,
  currentSortDirection,
  handleSort,
  label,
  align = "center",
}: SortableTableCellProps<T>) => {
  const isActive = currentSortColumn === columnKey;

  return (
    <TableCell
      align={align}
      onClick={() => {
        const next = isActive
          ? currentSortDirection === "asc"
            ? "desc"
            : "asc"
          : "asc";
        handleSort(columnKey, next);
      }}
      sortDirection={isActive ? currentSortDirection : false}
      sx={{
        cursor: "pointer",
        "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
      }}
    >
      <TableSortLabel
        active={isActive}
        direction={isActive ? currentSortDirection : "asc"}
        hideSortIcon={!isActive}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
};

export default SortableTableCell;
