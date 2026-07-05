import api from "./httpApi";

export const startForgotSecret = async (phone_number: string) => {
  const { data } = await api.post("/api/web/forgot-secret/start", {
    phone_number,
  });

  return data;
};

export const verifyForgotSecret = async (
  challenge_id: string,
  code: string,
) => {
  const { data } = await api.post("/api/web/forgot-secret/verify", {
    challenge_id,
    code,
  });

  return data;
};

export const resetForgotSecret = async (
  challenge_id: string,
  new_secret: string,
) => {
  const { data } = await api.post("/api/web/forgot-secret/reset", {
    challenge_id,
    new_secret,
  });

  return data;
};
