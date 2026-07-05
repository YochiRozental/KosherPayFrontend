import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {
  TextField,
  Stack,
  Divider,
  Typography,
  InputAdornment,
  Button,
  IconButton,
} from "@mui/material";

interface Props {
  data: Record<string, any> | null;
  errors: Record<string, string> | null;
  onChange: (e: any) => void;

  showForgotSecret?: boolean;
  onForgotSecretClick?: () => void;

  onAddAdditionalPhone?: () => void;
  onRemoveAdditionalPhone?: (index: number) => void;
  onAdditionalPhoneChange?: (index: number, value: string) => void;

  readOnly?: boolean;
  showBankFields?: boolean;
}

export default function FormFields({
  data,
  errors,
  onChange,

  onAddAdditionalPhone,
  onRemoveAdditionalPhone,
  onAdditionalPhoneChange,
  onForgotSecretClick,

  readOnly = false,
  showBankFields = false,
  showForgotSecret = false,
}: Props) {
  const bank = data?.bankAccount ?? {
    bankNumber: "",
    branchNumber: "",
    accountNumber: "",
    accountHolder: "",
  };

  const baseProps = (
    name: string,
    label: string,
    icon: any,
    extra: any = {},
    autoComplete?: string,
  ) => ({
    label,
    name,
    value: data?.[name] ?? "",
    onChange,
    fullWidth: true,
    disabled: readOnly,
    error: !!errors?.[name],
    helperText: errors?.[name] || "",
    inputProps: {
      autoComplete: autoComplete || "off",
    },
    InputProps: {
      startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
      readOnly,
    },
    ...extra,
  });

  const rawAdditionalPhones = data?.additionalPhones ?? [];

  const visibleAdditionalPhones = readOnly
    ? rawAdditionalPhones.filter((phone: string) => phone?.trim())
    : rawAdditionalPhones;

  const shouldShowAdditionalPhones =
    visibleAdditionalPhones.length > 0 || (!readOnly && showBankFields);

  return (
    <Stack spacing={2.5}>
      <Typography variant="h6">פרטים אישיים</Typography>
      <Divider />

      <TextField {...baseProps("name", "שם מלא", <PersonIcon />)} />
      <TextField
        {...baseProps("phone", "טלפון", <PhoneIcon />, {}, "tel-national")}
      />
      <Stack spacing={0.5}>
        <TextField
          {...baseProps(
            "secret",
            "קוד סודי",
            <LockIcon />,
            { type: "password" },
            "current-password",
          )}
        />

        {showForgotSecret && !readOnly && (
          <Button
            type="button"
            variant="text"
            size="small"
            onClick={onForgotSecretClick}
            sx={{ alignSelf: "flex-start" }}
          >
            שכחתי קוד
          </Button>
        )}
      </Stack>
      {shouldShowAdditionalPhones && (
        <>
          <Typography variant="h6" mt={3}>
            טלפונים נוספים
          </Typography>
          <Divider />

          {errors?.additionalPhones && (
            <Typography color="error">{errors.additionalPhones}</Typography>
          )}

          {visibleAdditionalPhones.map((phone: string, index: number) => (
            <Stack
              key={index}
              direction="row"
              spacing={1}
              alignItems="flex-start"
            >
              <TextField
                label={`טלפון נוסף ${index + 1}`}
                value={phone}
                onChange={(e) =>
                  onAdditionalPhoneChange?.(index, e.target.value)
                }
                disabled={readOnly}
                error={!!errors?.[`additionalPhones.${index}`]}
                helperText={errors?.[`additionalPhones.${index}`] || ""}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                  readOnly,
                }}
              />

              {!readOnly && (
                <IconButton
                  color="error"
                  onClick={() => onRemoveAdditionalPhone?.(index)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
          ))}

          {!readOnly && showBankFields && (
            <Button variant="outlined" onClick={onAddAdditionalPhone}>
              הוסף טלפון נוסף
            </Button>
          )}
        </>
      )}
      {showBankFields && (
        <>
          <Typography variant="h6" mt={3}>
            פרטי חשבון בנק
          </Typography>
          <Divider />

          <Stack
            direction="row"
            justifyContent={"space-between"}
            spacing={1}
            gap={1}
            width={"100%"}
          >
            <TextField
              label="מספר בנק"
              name="bankNumber"
              value={bank.bankNumber}
              onChange={onChange}
              disabled={readOnly}
              error={!!errors?.bankNumber}
              helperText={errors?.bankNumber}
              fullWidth
              inputProps={{ autoComplete: "off" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                ),
                readOnly,
              }}
            />
            <TextField
              label="מספר סניף"
              name="branchNumber"
              value={bank.branchNumber}
              onChange={onChange}
              disabled={readOnly}
              error={!!errors?.branchNumber}
              helperText={errors?.branchNumber}
              fullWidth
              inputProps={{ autoComplete: "off" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                ),
                readOnly,
              }}
            />
          </Stack>
          <TextField
            label="מספר חשבון"
            name="accountNumber"
            value={bank.accountNumber}
            onChange={onChange}
            disabled={readOnly}
            error={!!errors?.accountNumber}
            helperText={errors?.accountNumber}
            fullWidth
            inputProps={{ autoComplete: "off" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon />
                </InputAdornment>
              ),
              readOnly,
            }}
          />
          <TextField
            label="שם בעל החשבון"
            name="accountHolder"
            value={bank.accountHolder}
            onChange={onChange}
            disabled={readOnly}
            error={!!errors?.accountHolder}
            helperText={errors?.accountHolder}
            fullWidth
            inputProps={{ autoComplete: "off" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceIcon />
                </InputAdornment>
              ),
              readOnly,
            }}
          />
        </>
      )}
    </Stack>
  );
}
