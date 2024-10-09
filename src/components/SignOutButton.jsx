// scr/components/SignOutButton.jsx
import { useContext } from 'react';
import { logout } from '../lib/auth';
import { AuthContext } from '../context/AuthContext';

const SignOutButton = () => {
  const { user } = useContext(AuthContext);

  const handleSignOut = async () => {
    await logout();
  };

  if (!user) return null;

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
