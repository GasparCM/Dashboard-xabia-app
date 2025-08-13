import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de petición de recuperación.
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-app p-4">
      <Card>
        <h1 className="text-xl font-semibold text-text-title-strong mb-4">Recuperar contraseña</h1>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-3 w-80">
            <div>
              <label className="block text-sm text-text-body mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
            <Button type="submit" className="w-full">Enviar enlace</Button>
          </form>
        ) : (
          <div className="w-80 space-y-3">
            <p className="text-sm text-text-body">Si existe una cuenta con ese email, te enviaremos instrucciones para restablecer la contraseña.</p>
            <Link to="/login" className="text-primary hover:underline text-sm">Volver al login</Link>
          </div>
        )}
      </Card>
    </div>
  );
};
