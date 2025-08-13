import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { useApp } from "../../store/AppContext";
import { mockUsers } from "../../mocks/data";
import { useTranslation } from "../../hooks/useTranslation";

export const Login: React.FC = () => {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login hardcodeado: admin / Gaspar1312
    if (username === "admin" && password === "Xabia123") {
      // Reutilizamos el primer mock user como usuario logueado
      const user = mockUsers[0];
      dispatch({ type: "SET_USER", payload: user });
      setError(null);
      navigate("/");
    } else {
      setError(t("auth.error.invalidCredentials"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-app p-4">
      <Card>
        <h1 className="text-xl font-semibold text-text-title-strong mb-4">
          {t("auth.login.title")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-3 w-80">
          <div>
            <label className="block text-sm text-text-body mb-1">
              {t("auth.username")}
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t("auth.username.placeholder")}
            />
          </div>
          <div>
            <label className="block text-sm text-text-body mb-1">
              {t("auth.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t("auth.password.placeholder")}
            />
          </div>
          {error && <div className="text-sm text-error">{error}</div>}
          <Button type="submit" className="w-full">
            {t("auth.login")}
          </Button>
        </form>
        <div className="text-sm text-text-body mt-3">
          <Link to="/forgot" className="text-primary hover:underline">
            {t("auth.forgot")}
          </Link>
        </div>
      </Card>
    </div>
  );
};
