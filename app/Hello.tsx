'use client'

import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: 'first_name',
    headerName: 'First Name',
    width: 200
  },
  {
    field: 'last_name',
    headerName: 'Last Name',
    width: 200
  },
];

export default function ({ rows }: any) {

  return (
    <div>
      <DataGrid rows={rows} columns={columns} showToolbar />
    </div>
  )
}