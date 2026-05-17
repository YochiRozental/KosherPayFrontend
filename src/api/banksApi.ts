import api from "./httpApi";

export const validateBank = async (bankNumber: string) => {
  const res = await api.get("/api/web/banks/validate", {
    params: { bank_number: bankNumber },
  });

  return res.data;
};

export const validateBankBranch = async (
  bankNumber: string,
  branchNumber: string,
) => {
  const res = await api.get("/api/web/banks/branches/validate", {
    params: {
      bank_number: bankNumber,
      branch_number: branchNumber,
    },
  });

  return res.data;
};
