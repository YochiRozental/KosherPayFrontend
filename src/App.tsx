import { useEffect } from "react";

import { ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "dayjs/locale/he";

import BalancePage from "@/pages/BalancePage";
import DashboardPage from "@/pages/DashboardPage";
import HistoryPage from "@/pages/HistoryPage";
import RequestsPage from "@/pages/RequestsPage";
import SentRequestsPage from "@/pages/SentRequestsPage";
import EditProfilePage from "@/pages/users/EditProfilePage";
import LoginPage from "@/pages/users/LoginPage";
import ProfilePage from "@/pages/users/ProfilePage";
import RegisterPage from "@/pages/users/RegisterPage";

import AdminUsersPage from "@/components/admin/AdminUsersPage";
import MainLayout from "@/components/layout/MainLayout";

import { setOnUnauthorized } from "@/api/authEvents";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import theme from "@/theme/theme";

export default function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = setOnUnauthorized(() => {
      dispatch(logout());
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (user) {
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
        <Router>
          <Routes>
            <Route
              path="/register"
              element={
                !user ? (
                  <RegisterPage />
                ) : (
                  <Navigate to="/account-actions" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                !user ? (
                  <LoginPage />
                ) : (
                  <Navigate to="/account-actions" replace />
                )
              }
            />

            <Route
              path="/*"
              element={
                user ? (
                  <MainLayout onLogout={handleLogout}>
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate to="/profile" replace />}
                      />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/edit" element={<EditProfilePage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route
                        path="/account-actions"
                        element={
                          <DashboardPage user={user} onLogout={handleLogout} />
                        }
                      />
                      <Route
                        path="/balance"
                        element={
                          <BalancePage user={user} onLogout={handleLogout} />
                        }
                      />
                      <Route
                        path="/history"
                        element={
                          <HistoryPage user={user} onLogout={handleLogout} />
                        }
                      />
                      <Route
                        path="/requests"
                        element={
                          <RequestsPage user={user} onLogout={handleLogout} />
                        }
                      />
                      <Route
                        path="/sent-requests"
                        element={
                          <SentRequestsPage
                            user={user}
                            onLogout={handleLogout}
                          />
                        }
                      />
                      <Route path="/admin/users" element={<AdminUsersPage />} />
                      <Route
                        path="*"
                        element={<Navigate to="/account-actions" replace />}
                      />
                    </Routes>
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
