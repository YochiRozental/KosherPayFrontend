import { useEffect, useState, useMemo } from "react";
import { Typography, Box, CircularProgress, Chip } from "@mui/material";
import { motion } from "framer-motion";
import type { ApiResponse } from "../../types";
import * as api from "../../api/adminApi";
import DataTable, { type Column } from "../tables/DataTable";

interface UserRow {
    phone: string;
    idNum: string;
    balance: number;
    role: "admin" | "user";
    name: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError("");

                const res: ApiResponse = await api.getAllUsers();

                const list = (res as any).users;
                if (res.success && Array.isArray(list)) {
                    const normalized: UserRow[] = list.map((u: any) => ({
                        phone: u.phone_number ?? u.phone ?? "",
                        idNum: u.id_number ?? u.idNum ?? "",
                        balance: Number(u.balance ?? 0),
                        role: u.role === "admin" ? "admin" : "user",
                        name: u.name ?? "",
                    }));
                    setUsers(normalized);
                } else {
                    setError(res.message || "שגיאה בטעינת המשתמשים.");
                }
            } catch (err) {
                console.error("שגיאה בטעינת המשתמשים:", err);
                setError("שגיאה בטעינת המשתמשים.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const columns: Column<UserRow>[] = useMemo(
        () => [
            { key: "name", label: "שם", align: "right" },
            { key: "phone", label: "טלפון", align: "center" },
            { key: "idNum", label: "תעודת זהות", align: "center" },
            {
                key: "balance",
                label: "יתרה",
                align: "left",
                render: (value: any) => (
                    <Typography fontWeight="bold" color={Number(value) > 0 ? "primary" : "text.secondary"}>
                        {value} ₪
                    </Typography>
                ),
            },
            {
                key: "role",
                label: "תפקיד",
                align: "center",
                render: (value: any) => (
                    <Chip
                        label={value === "admin" ? "מנהל" : "משתמש"}
                        color={value === "admin" ? "primary" : "default"}
                        variant="outlined"
                        size="small"
                    />
                ),
            },
        ],
        []
    );

    if (loading)
        return (
            <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress color="primary" />
            </Box>
        );

    if (error)
        return (
            <Typography color="error" textAlign="center" variant="h6" p={3}>
                {error}
            </Typography>
        );

    return (
        <Box sx={{ direction: "rtl", p: 3 }}>
            <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="center"
                mb={3}
                component={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                רשימת כל המשתמשים ({users.length})
            </Typography>

            <DataTable<UserRow>
                columns={columns}
                rows={users}
                emptyMessage="אין משתמשים להצגה"
                sortable
                initialSort={{ column: "balance" as keyof UserRow, direction: "desc" }}
            />
        </Box>
    );
}
