"use client";



import React, { useState, useMemo } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TablePagination,
  TextField, TableSortLabel, Paper, Button, Checkbox,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import Papa from "papaparse";
import { saveAs } from "file-saver";

type RowType = {
  id: number;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
};

const allColumns = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "age", label: "Age" },
  { id: "role", label: "Role" },
  { id: "department", label: "Department" },
  { id: "location", label: "Location" },
];

const defaultColumns = ["name", "email", "age", "role"];

const initialRows: RowType[] = [
  { id: 1, name: "Vinay", email: "vinay9887@mail.com", age: 24, role: "Admin", department: "IT", location: "Delhi" },
  { id: 2, name: "Shivam", email: "shivamt0099@mail.com", age: 21, role: "User", department: "HR", location: "Bihar" },
];

export default function DataTable() {
  const [rows, setRows] = useState<RowType[]>(initialRows);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof RowType>("name");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("columnPrefs") || "null") || defaultColumns
  );
  React.useEffect(() => {
    localStorage.setItem("columnPrefs", JSON.stringify(visibleColumns));
  }, [visibleColumns]);
  const [openModal, setOpenModal] = useState(false);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<RowType>(file, {
      header: true,
      complete: (result) => {
        setRows(
          result.data
            .map((row, idx) => ({
              ...row,
              id: idx + 1
            }))
            .filter((r) => r.name)
        );
      },
      error: () => {
        alert("CSV Parse Error!");
      }
    });
  };

  const handleExportCSV = () => {
    const exportData = rows.map((row) =>
      Object.fromEntries(visibleColumns.map((col) => [col, row[col as keyof RowType]]))
    );
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "table-data.csv");
  };

  const filteredRows = useMemo(() => {
    let filtered = rows.filter((row) =>
      visibleColumns.some(
        (col) =>
          String(row[col as keyof RowType] ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    );
    filtered = filtered.sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      if (aVal === undefined || bVal === undefined) return 0;
      if (order === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
    return filtered;
  }, [rows, search, order, orderBy, visibleColumns]);

  const pagedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (columnId: string) => {
    if (orderBy === columnId) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setOrderBy(columnId as keyof RowType);
      setOrder("asc");
    }
  };

  return (
    <Paper sx={{ width: "100%", padding: 2 }}>
      <TextField
        label="Global Search"
        variant="outlined"
        size="small"
        fullWidth
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Table>
        <TableHead>
          <TableRow>
            {visibleColumns.map((col) => (
              <TableCell key={col}>
                <TableSortLabel
                  active={orderBy === col}
                  direction={orderBy === col ? order : "asc"}
                  onClick={() => handleSort(col)}
                >
                  {allColumns.find(c => c.id === col)?.label || col}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {pagedRows.map((row) => (
            <TableRow key={row.id}>
              {visibleColumns.map((col) => (
                <TableCell key={col}>{row[col as keyof RowType]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />
      <div style={{ marginTop: 16 }}>
        <Button variant="contained" component="label">
          Import CSV
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleImportCSV}
          />
        </Button>
        <Button variant="outlined" onClick={handleExportCSV} sx={{ ml: 2 }}>
          Export CSV
        </Button>
        <Button variant="outlined" onClick={() => setOpenModal(true)} sx={{ ml: 2 }}>
          Select Columns
        </Button>
      </div>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Select Visible Columns</DialogTitle>
        <DialogContent>
          {allColumns.map((col) => (
            <div key={col.id}>
              <Checkbox
                checked={visibleColumns.includes(col.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setVisibleColumns([...visibleColumns, col.id]);
                  } else {
                    setVisibleColumns(visibleColumns.filter((c) => c !== col.id));
                  }
                }}
              />
              {col.label}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
