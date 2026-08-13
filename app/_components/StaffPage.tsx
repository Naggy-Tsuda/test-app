"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, } from "@mui/x-data-grid";
import { createClient } from "@/lib/supabase/client";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

type Staff = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
};

export default function StaffPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Staff[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [isMounted, setIsMounted] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    console.log('email changed')
  }, [email]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    loadStaff();
  }, []);

  async function loadStaff() {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("id");

    if (!error && data) {
      setRows(data);
    }
  }

  function validateForm() {
    const errors: Record<string, string> = {};

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Enter a valid email adress";
    }

    if (!subject.trim()) {
      errors.subject = "Subject is required";
    }

    return errors;
  }

  function handleFieldChange(
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    field: string,
  ) {
    setter(value);
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function saveStaff() {
    if (isSaving) {
      return;
    }

    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSaving(true)

    try {
      if (editingId == null) {
        const { error } = await supabase.from("staff").insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          subject: subject,
        });

        if (error) {
          alert(error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from("staff")
          .update({
            first_name: firstName,
            last_name: lastName,
            email: email,
            subject: subject,
          })
          .eq("id", editingId);

        if (error) {
          alert(error.message);
          return;
        }
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
      setEditingId(null);

      loadStaff();
    } catch (_error) {
      alert("Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  function editStaff(staff: Staff) {
    setEditingId(staff.id);
    setFormErrors({});
    setFirstName(staff.first_name);
    setLastName(staff.last_name);
    setEmail(staff.email);
    setSubject(staff.subject);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    const { error } = await supabase
      .from("staff")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    if (editingId === id) {
      setEditingId(null);
      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
    }

    loadStaff();
  }

  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 80 },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "subject", headerName: "Subject", flex: 1.5 },
    {
      field: "edit",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <Button onClick={() => editStaff(params.row)} startIcon={<EditIcon />}>
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <Button color="error" onClick={() => handleDelete(params.row.id)} startIcon={<DeleteIcon />}>
          Delete
        </Button>
      ),
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Staff
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => handleFieldChange(setFirstName, e.target.value, "firstName")}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
          />

          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => handleFieldChange(setLastName, e.target.value, "lastName")}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
          />

          <TextField
            label="Email"
            value={email}
            onChange={(e) => handleFieldChange(setEmail, e.target.value, "email")}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />

          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => handleFieldChange(setSubject, e.target.value, "subject")}
            error={!!formErrors.subject}
            helperText={formErrors.subject}
          />

          <Button variant="contained" onClick={saveStaff}>
            {editingId === null ? "Add Staff" : "Update Staff"}
          </Button>
        </Stack>
      </Paper>


      <Paper sx={{ height: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          showToolbar
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Paper>

    </Box>
  );
}

// function useDemoData(arg0: { dataSet: string; rowLength: number; maxColumns: number; }): { data: any; loading: any; } {
//   throw new Error("Function not implemented.");
// }