import { useState, useEffect } from "react";

import {
    Box,
    Typography,
    CircularProgress,
    Card,
    useTheme
} from "@mui/material";

import * as api from "../api/paymentsApi";

import type { UserMe } from "../types";

export default function BalancePage({ user }: { user: UserMe; onLogout: () => void }) {
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    useEffect(() => {
        const loadBalance = async () => {
            setIsLoading(true);
            setError(null);
            setBalance(null);
            try {
                const res = await api.getBalance();
                setBalance(Number(res.balance) || 0);
            } catch (err) {
                console.error("שגיאה בטעינת יתרה:", err);
                setError("אירעה שגיאה בטעינת היתרה.");
            } finally {
                setIsLoading(false);
            }
        };
        loadBalance();
    }, [user.phone, user.id]);

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
                    יתרה נוכחית
                </Typography>

                {isLoading && (
                    <Box display="flex" justifyContent="center" mt={5}>
                        <CircularProgress />
                    </Box>
                )}

                {!isLoading && error && (
                    <Typography color="error" variant="h6">
                        {error}
                    </Typography>
                )}

                {!isLoading && balance !== null && (
                    <Card
                        sx={{
                            p: 3,
                            textAlign: "center",
                            background: theme.palette.mode === 'light'
                                ? `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`
                                : `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                            color: "white",
                            borderRadius: 3,
                            boxShadow: 6,
                        }}
                    >
                        <Typography variant="h5" sx={{ opacity: 0.8 }}>היתרה הזמינה שלך 💰</Typography>
                        <Typography variant="h3" sx={{ mt: 1, fontWeight: 700 }}>
                            {balance.toLocaleString("he-IL", {
                                style: 'currency',
                                currency: 'ILS',
                                minimumFractionDigits: 2,
                            })}
                        </Typography>
                    </Card>
                )}
            </Box>
        </Box>
    );
}