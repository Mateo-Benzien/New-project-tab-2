// scr/components/SignInForm.jsx
import { useState, useContext } from 'react';
import { signIn } from '../lib/auth';
import { AuthContext } from '../context/AuthContext';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (user) return <p>You are already signed in.</p>;

  return (
    <form onSubmit={handleSignIn}>
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign In</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default SignInForm;
