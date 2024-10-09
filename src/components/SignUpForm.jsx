// scr/components/SignUpForm.jsx
import { useState, useContext } from 'react';
import { signUp } from '../lib/auth';
import { AuthContext } from '../context/AuthContext';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signUp(email, password);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (user) return <p>You are already signed in.</p>;

  return (
    <form onSubmit={handleSignUp}>
      <h2>Sign Up</h2>
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
      <button type="submit">Sign Up</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default SignUpForm;
