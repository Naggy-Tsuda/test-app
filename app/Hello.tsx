'use client'

import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Instrument Name',
    width: 200
  },
];

export default function ({ rows }: any) {

  return (
    <div>
      <DataGrid rows={rows} columns={columns} />
    </div>
  )
}