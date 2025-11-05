import React from "react";
import DataTable from "./components/DataTable";

export default function HomePage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dynamic Data Table</h2>
      <DataTable />
    </div>
  );
}
