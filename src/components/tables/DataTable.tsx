import React, { useMemo, useState } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Box,
    Typography,
    useTheme,
} from "@mui/material";
import SortableTableCell from "../filters/SortableTableCell";

type Align = "left" | "center" | "right";

interface DataColumn<T> {
    key: keyof T;
    label: string;
    align?: Align;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface VirtualColumn<T> {
    key?: string;
    label: string;
    align?: Align;
    render: (value: undefined, row: T) => React.ReactNode;
}

export type Column<T> = DataColumn<T> | VirtualColumn<T>;

export interface DataTableProps<T extends Record<string, any>> {
    columns: Column<T>[];
    rows: T[];
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
    /**
     * When true, headers for data columns (columns that have a `key`) become sortable.
     * If `sortColumn`/`sortDirection`/`onSort` are provided the table operates in controlled mode.
     * Otherwise the table keeps the sorting state internally (uncontrolled)
     */
    sortable?: boolean;
    /** Controlled sort column (optional) */
    sortColumn?: keyof T | null;
    /** Controlled sort direction (optional) */
    sortDirection?: "asc" | "desc" | null;
    /** Controlled sort callback, called with (column, nextDirection).
     * DataTable computes the intended nextDirection so parent doesn't need to manage toggling logic.
     */
    onSort?: (column: keyof T, nextDirection: "asc" | "desc") => void;
    /** Uncontrolled initial sort state (used when controlled props not passed) */
    initialSort?: { column?: keyof T; direction?: "asc" | "desc" };
}

function isDataColumn<T>(col: Column<T>): col is DataColumn<T> {
    return typeof col.key !== "undefined" && !!(col as DataColumn<T>).key;
}

export default function DataTable<T extends Record<string, any>>({
    columns,
    rows,
    emptyMessage = "אין נתונים להצגה",
    onRowClick,
    sortable = false,
    sortColumn,
    sortDirection,
    onSort,
    initialSort,
}: DataTableProps<T>) {
    const theme = useTheme();
    const Wrapper = Paper as React.ElementType;

    const headerBackgroundColor = theme.palette.primary.light;

    if (!rows.length) {
        return (
            <Box p={3} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
                <Typography textAlign="center" color="text.secondary">
                    {emptyMessage}
                </Typography>
            </Box>
        );
    }

    const [internalSortColumn, setInternalSortColumn] = useState<keyof T | null>(
        initialSort?.column ?? null
    );
    const [internalSortDirection, setInternalSortDirection] = useState<"asc" | "desc">(
        initialSort?.direction ?? "asc"
    );

    const activeSortColumn: keyof T | null = sortColumn !== undefined ? (sortColumn ?? null) : internalSortColumn;
    const activeSortDirection: "asc" | "desc" | null = sortDirection !== undefined ? (sortDirection ?? null) : internalSortDirection;

    const handleSortRequest = (column: keyof T, nextDirection?: "asc" | "desc") => {
        if (onSort) {
            const isSame = activeSortColumn === column;
            const computedNext = nextDirection ?? (isSame ? (activeSortDirection === "asc" ? "desc" : "asc") : "asc");
            onSort(column, computedNext);
            return;
        }

        if (nextDirection) {
            setInternalSortColumn(column);
            setInternalSortDirection(nextDirection);
            return;
        }

        setInternalSortColumn((prev) => {
            if (prev !== column) {
                setInternalSortDirection("asc");
                return column;
            }
            setInternalSortDirection((d) => (d === "asc" ? "desc" : "asc"));
            return prev;
        });
    };

    const displayedRows = useMemo(() => {
        if (!activeSortColumn) return rows;

        const sorted = [...rows].sort((a, b) => {
            const aValue = a[activeSortColumn as keyof T];
            const bValue = b[activeSortColumn as keyof T];

            const toStr = (v: any) => (v === null || v === undefined ? "" : String(v));
            const tryParseNumber = (v: any) => {
                if (v === null || v === undefined) return NaN;
                const cleaned = String(v).replace(/[^0-9+\-.,eE]/g, '').replace(/,/g, '.');
                const n = parseFloat(cleaned);
                return Number.isFinite(n) ? n : NaN;
            };

            const aNum = tryParseNumber(aValue);
            const bNum = tryParseNumber(bValue);
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return activeSortDirection === "asc" ? aNum - bNum : bNum - aNum;
            }

            const aTime = new Date(toStr(aValue)).getTime();
            const bTime = new Date(toStr(bValue)).getTime();
            if (!isNaN(aTime) && !isNaN(bTime)) {
                return activeSortDirection === "asc" ? aTime - bTime : bTime - aTime;
            }

            const astr = toStr(aValue).trim();
            const bstr = toStr(bValue).trim();
            const cmp = astr.localeCompare(bstr, "he-IL", { numeric: true, sensitivity: "base" });
            return activeSortDirection === "asc" ? cmp : -cmp;
        });

        return sorted;
    }, [rows, activeSortColumn, activeSortDirection]);

    return (
        <Wrapper
            sx={{
                overflow: "hidden",
                direction: "rtl",
                borderRadius: 2,
                boxShadow: theme.shadows[3],
                border: `1px solid ${theme.palette.grey[200]}`,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: headerBackgroundColor,
                            "& th": {
                                color: theme.palette.primary.dark,
                                fontWeight: "bold",
                                fontSize: '0.875rem',
                                border: 'none',
                            },
                        }}
                    >
                        {columns.map((col, i) => {
                            const keyStr = col.key ? String(col.key) : `col-${i}`;
                            if (isDataColumn<T>(col) && (sortable || sortColumn !== undefined || onSort)) {
                                const columnKey = String(col.key) as unknown as string;
                                return (
                                    <SortableTableCell
                                        key={keyStr}
                                        columnKey={columnKey}
                                        currentSortColumn={(activeSortColumn ? String(activeSortColumn) : "")}
                                        currentSortDirection={activeSortDirection ?? "asc"}
                                        handleSort={(_colKey, nextDir) => handleSortRequest(col.key, nextDir)}
                                        label={col.label}
                                    />
                                );
                            }

                            return (
                                <TableCell key={keyStr} align={col.align || "center"}>
                                    {col.label}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {displayedRows.map((row, i) => (
                        <TableRow
                            key={i}
                            sx={{
                                height: 56,
                                "& td, & th": {
                                    height: 56,
                                    py: 1,
                                    borderBottom: `1px solid ${theme.palette.grey[200]}`,
                                    border: 'none',
                                },
                                "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
                                "&:hover": {
                                    backgroundColor: theme.palette.action.selected,
                                    cursor: onRowClick ? "pointer" : "default",
                                },
                            }}
                            onClick={() => onRowClick?.(row)}
                        >
                            {columns.map((col, j) => {
                                if (isDataColumn(col)) {
                                    const value = row[col.key];
                                    const content =
                                        col.render?.(value, row) ??
                                        (typeof value === "object" ? JSON.stringify(value) : String(value ?? ""));
                                    return (
                                        <TableCell key={String(col.key)} align={col.align || "center"}>
                                            {content}
                                        </TableCell>
                                    );
                                } else {
                                    const content = col.render(undefined, row);
                                    return (
                                        <TableCell key={`virtual-${j}`} align={col.align || "center"}>
                                            {content}
                                        </TableCell>
                                    );
                                }
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Wrapper>
    );
}