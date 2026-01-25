import { useState, useEffect } from "react";
import type { UserMe, UserFormData } from "../types";

type Mode = "login" | "register" | "profile";

export function useUserForm(initial?: UserMe, mode: Mode = "profile") {
  const isRegister = mode === "register";
  const isLogin = mode === "login";

  const [data, setData] = useState<UserFormData>(
    initial
      ? { ...initial, secret: "" }
      : {
        id: "",
        name: "",
        phone: "",
        secret: "",
        balance: "0",
        role: "user",
        bankAccount: {
          accountNumber: "",
          bankNumber: "",
          branchNumber: "",
          accountHolder: "",
        },
      }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) setData({ ...initial, secret: "" });
  }, [initial]);

  const onChange = (e: any) => {
    const { name, value } = e.target;

    if (["bankNumber", "branchNumber", "accountNumber", "accountOwner"].includes(name)) {
      setData((prev) => ({
        ...prev,
        bankAccount: { ...prev.bankAccount, [name]: value },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
        bankAccount: name === "name" ? { ...prev.bankAccount, accountOwner: value } : prev.bankAccount,
      }));
    }

    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};

    // login/register
    if (isLogin || isRegister) {
      if (!/^0\d{8,9}$/.test(data.phone)) e.phone = "טלפון לא תקין";
      if (!data.secret || data.secret.length < 4) e.secret = "קוד סודי קצר מדי";
    }

    // profile mode
    if (mode === "profile") {
      if (!data.name.trim()) e.name = "יש להזין שם מלא";
      if (data.phone && !/^0\d{8,9}$/.test(data.phone)) e.phone = "טלפון לא תקין";
      if (data.secret && data.secret.length < 4) e.secret = "קוד סודי קצר מדי";
    }

    // register bank
    if (isRegister) {
      if (!data.name.trim()) e.name = "יש להזין שם מלא";
      if (!/^\d{2,3}$/.test(data.bankAccount.bankNumber)) e.bankNumber = "מספר בנק לא תקין";
      if (!/^\d{1,3}$/.test(data.bankAccount.branchNumber)) e.branchNumber = "מספר סניף לא תקין";
      if (!/^\d{5,12}$/.test(data.bankAccount.accountNumber)) e.accountNumber = "מספר חשבון לא תקין";
      if (!data.bankAccount.accountHolder.trim()) e.accountHolder = "יש להזין שם בעל חשבון";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return { data, errors, onChange, validate };
}
