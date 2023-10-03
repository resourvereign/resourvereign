import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuthStore from '../hooks/useAuthStore';

interface SignedInGuardProps {
  redirectTo?: string;
}

const SignedInGuard = ({ redirectTo = '/' }: SignedInGuardProps) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const signedIn = !!user;

  useEffect(() => {
    if (!signedIn) {
      navigate(redirectTo);
    }
  }, [signedIn, navigate, redirectTo]);

  return signedIn ? <Outlet /> : null;
};

export default SignedInGuard;
