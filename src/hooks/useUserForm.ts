import { useState, useEffect } from "react";

import type { UserMe, UserFormData } from "../types";

type Mode = "login" | "register" | "profile";

const emptyForm = (): UserFormData => ({
  id: "",
  name: "",
  phone: "",
  secret: "",
  balance: "0",
  role: "user",
  additionalPhones: [],
  bankAccount: {
    accountNumber: "",
    bankNumber: "",
    branchNumber: "",
    accountHolder: "",
  },
});

function mapUserMeToForm(initial: UserMe): UserFormData {
  return {
    ...emptyForm(),
    id: initial.id ?? "",
    name: initial.name ?? "",
    phone: initial.phone ?? "",
    role: initial.role ?? "user",
    balance: initial.balance ?? "0",
    secret: "",
    additionalPhones: initial.additionalPhones ?? [],
    bankAccount: {
      bankNumber: initial.bankAccount?.bankNumber ?? "",
      branchNumber: initial.bankAccount?.branchNumber ?? "",
      accountNumber: initial.bankAccount?.accountNumber ?? "",
      accountHolder: initial.bankAccount?.accountHolder ?? "",
    },
  };
}

export function useUserForm(initial?: UserMe, mode: Mode = "profile") {
  const isRegister = mode === "register";
  const isLogin = mode === "login";

  const [data, setData] = useState<UserFormData>(() =>
    initial ? mapUserMeToForm(initial) : emptyForm(),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) setData(mapUserMeToForm(initial));
  }, [initial]);

  const onChange = (e: any) => {
    const { name, value } = e.target as { name: string; value: string };

    const bankKeys = [
      "bankNumber",
      "branchNumber",
      "accountNumber",
      "accountHolder",
    ];

    if (bankKeys.includes(name)) {
      setData((prev) => ({
        ...prev,
        bankAccount: { ...prev.bankAccount, [name]: value },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
        bankAccount:
          isRegister && name === "name"
            ? { ...prev.bankAccount, accountHolder: value }
            : prev.bankAccount,
      }));
    }

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const addAdditionalPhone = () => {
    setData((prev) => ({
      ...prev,
      additionalPhones: [...(prev.additionalPhones ?? []), ""],
    }));
  };

  const removeAdditionalPhone = (index: number) => {
    setData((prev) => ({
      ...prev,
      additionalPhones: prev.additionalPhones.filter((_, i) => i !== index),
    }));
  };

  const changeAdditionalPhone = (index: number, value: string) => {
    setData((prev) => ({
      ...prev,
      additionalPhones: prev.additionalPhones.map((phone, i) =>
        i === index ? value : phone,
      ),
    }));

    setErrors((prev) => {
      const key = `additionalPhones.${index}`;
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
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
      if (data.phone && !/^0\d{8,9}$/.test(data.phone))
        e.phone = "טלפון לא תקין";
      if (data.secret && data.secret.length < 4) e.secret = "קוד סודי קצר מדי";
    }

    // register bank
    if (isRegister) {
      if (!data.name.trim()) e.name = "יש להזין שם מלא";
      if (!/^\d{2,3}$/.test(data.bankAccount.bankNumber))
        e.bankNumber = "מספר בנק לא תקין";
      if (!/^\d{1,3}$/.test(data.bankAccount.branchNumber))
        e.branchNumber = "מספר סניף לא תקין";
      if (!/^\d{5,12}$/.test(data.bankAccount.accountNumber))
        e.accountNumber = "מספר חשבון לא תקין";
      if (!data.bankAccount.accountHolder.trim())
        e.accountHolder = "יש להזין שם בעל חשבון";
      const additionalPhones = (data.additionalPhones ?? [])
        .map((p) => p.trim())
        .filter(Boolean);

      additionalPhones.forEach((phone, index) => {
        if (!/^0\d{8,9}$/.test(phone)) {
          e[`additionalPhones.${index}`] = "טלפון נוסף לא תקין";
        }

        if (phone === data.phone) {
          e[`additionalPhones.${index}`] =
            "טלפון נוסף לא יכול להיות זהה לטלפון הראשי";
        }
      });

      if (new Set(additionalPhones).size !== additionalPhones.length) {
        e.additionalPhones = "יש מספרי טלפון נוספים כפולים";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return {
    data,
    errors,
    onChange,
    validate,
    addAdditionalPhone,
    removeAdditionalPhone,
    changeAdditionalPhone,
  };
}
