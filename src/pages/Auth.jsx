import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { login, signup } from '../data/auth';
import { useUser } from '../data/db';
import { Card, Btn, Field, inputCls } from '../components/ui';
import Logo from '../components/Logo';

export default function Auth({ mode = 'login' }) {
  const isSignup = mode === 'signup';
  const user = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await (isSignup ? signup(form) : login(form));
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9ff] px-4 text-[#0b1c30]">
      <div className="w-full max-w-sm">
        <Logo className="mb-6 justify-center" />
        <Card className="!p-6">
          <h1 className="text-2xl font-extrabold">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <form onSubmit={submit} className="mt-5 grid gap-4">
            {isSignup && <Field label="Display name"><input required className={inputCls} value={form.name} onChange={set('name')} /></Field>}
            <Field label="Email"><input required type="email" autoComplete="email" className={inputCls} value={form.email} onChange={set('email')} /></Field>
            <Field label="Password"><input required type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} className={inputCls} value={form.password} onChange={set('password')} /></Field>
            {error && <p role="alert" className="text-sm font-semibold text-[#ba1a1a]">{error}</p>}
            <Btn type="submit" disabled={busy}>{isSignup ? 'Sign up' : 'Log in'}</Btn>
          </form>
          <p className="mt-4 text-center text-sm text-[#565e74]">
            {isSignup ? 'Already have an account? ' : 'New here? '}
            <Link className="font-bold text-[#006948]" to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Sign up'}</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
