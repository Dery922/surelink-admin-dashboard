import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import LoginBrandPanel from '../components/auth/LoginBrandPanel.jsx';
import LoginForm from '../components/auth/LoginForm.jsx';

export default function LoginPage() {
  const { isAuth, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect already-authenticated admins away from login
  useEffect(() => {
    if (!isLoading && isAuth) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuth, isLoading, navigate]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex">
      <LoginBrandPanel />
      <LoginForm />
    </div>
  );
}
