import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import AuthForm from "../../components/forms/AuthForm";
import { registerUser } from "../../features/auth/authThunks";

import type { UserFormData } from "../../types";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const submit = async (data: UserFormData) => {
    const r = await dispatch(registerUser(data)).unwrap();
    if (r) navigate("/profile");
  };

  return (
    <AuthForm
      mode="register"
      loading={loading}
      error={error ?? undefined}
      onSubmit={submit}
      onSwitch={() => navigate("/login")}
    />
  );
}
