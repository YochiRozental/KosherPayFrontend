import { useState } from "react";

import { Box, Paper, Typography, Button, Stack, Divider } from "@mui/material";

import * as banksApi from "../../api/banksApi";
import { useUserForm } from "../../hooks/useUserForm";
import FormFields from "../forms/FormFields";

interface Props {
  mode: "login" | "register";
  loading?: boolean;
  error?: string;
  onSubmit: (data: any) => Promise<void> | void;
  onSwitch: () => void;
}

export default function AuthForm({
  mode,
  loading = false,
  error,
  onSubmit,
  onSwitch,
}: Props) {
  const isReg = mode === "register";
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    data,
    errors,
    onChange,
    validate,
    addAdditionalPhone,
    removeAdditionalPhone,
    changeAdditionalPhone,
  } = useUserForm(undefined, isReg ? "register" : "login");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLocalError(null);

    if (!validate()) return;

    if (isReg) {
      try {
        const res = await banksApi.validateBankBranch(
          data.bankAccount.bankNumber,
          data.bankAccount.branchNumber,
        );

        if (!res?.valid) {
          setLocalError(res?.message || "בנק או סניף לא תקינים");
          return;
        }
      } catch (err: any) {
        setLocalError(
          err?.response?.data?.detail?.message ||
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "בנק או סניף לא תקינים",
        );
        return;
      }
    }

    await onSubmit(data);
  };

  const shownError = localError || error;

  return (
    <Box
      display="flex"
      justifyContent="center"
      py={6}
      sx={{ bgcolor: "#f5f7fa", direction: "rtl" }}
    >
      <Paper sx={{ p: 5, width: "100%", maxWidth: 600, borderRadius: 3 }}>
        <Typography variant="h4" textAlign="center" mb={2}>
          {isReg ? "פתיחת חשבון" : "התחברות"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormFields
              data={data}
              errors={errors}
              onChange={onChange}
              showBankFields={isReg}
              onAddAdditionalPhone={addAdditionalPhone}
              onRemoveAdditionalPhone={removeAdditionalPhone}
              onAdditionalPhoneChange={changeAdditionalPhone}
            />

            {shownError && (
              <Typography color="error" textAlign="center">
                {shownError}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
            >
              {isReg ? "צור חשבון" : "התחבר"}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }} />
        <Button variant="outlined" fullWidth onClick={onSwitch}>
          {isReg ? "מעבר להתחברות" : "מעבר להרשמה"}
        </Button>
      </Paper>
    </Box>
  );
}
