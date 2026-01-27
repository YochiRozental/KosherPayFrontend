import { useState } from "react";

import { Box, Typography, Alert, Snackbar } from "@mui/material";

import ActionsSection from "../components/dashboard/AccountTansactions";

import type { UserMe } from "../types";

export default function ActionsPage({ user }: { user: UserMe; onLogout: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
        open: false,
        message: "",
        severity: "info",
    });

    const handleApiCall = async (apiFunc: () => Promise<any>): Promise<void> => {
        setIsLoading(true);
        try {
            const res = await apiFunc();
            if (res && res.success) {
                try {
                    const { getBalance } = await import("../api/paymentsApi");
                    await getBalance();
                } catch { }

                setSnackbar({
                    open: true,
                    message: "הפעולה בוצעה בהצלחה! היתרה עודכנה.",
                    severity: "success",
                });

            } else {

                setSnackbar({ open: true, message: res?.message || "שגיאה בביצוע הפעולה.", severity: "error" });
            }
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: "שגיאת רשת. נסה שוב מאוחר יותר.", severity: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", direction: "rtl" }}>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    boxSizing: "border-box",
                }}
            >
                <Typography variant="h4" color="primary" sx={{ mb: 4 }}>
                    פעולות בחשבון 🛠️
                </Typography>

                <ActionsSection
                    user={user}
                    onApiCall={handleApiCall}
                    isLoading={isLoading}
                />

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}