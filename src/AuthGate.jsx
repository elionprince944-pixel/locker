import { useEffect, useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck, ArrowRight, LoaderCircle } from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabase';

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setError(error.message);
      setSession(data?.session ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) return children;

  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: displayName.trim() } }
        });
        if (authError) throw authError;
        if (data.session) setMessage('Account created. You are signed in.');
        else setMessage('Check your email to confirm your account, then sign in.');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
      }
    } catch (e) {
      setError(e.message || 'Unable to complete that request.');
    } finally { setBusy(false); }
  }

  if (loading) return <div className="auth-screen"><div className="auth-card auth-loading"><LoaderCircle className="auth-spinner" size={26}/><p>Checking your secure session…</p></div></div>;
  if (!session) return <div className="auth-screen"><div className="auth-card">
    <div className="auth-logo"><LockKeyhole size={24}/></div>
    <div className="auth-eyebrow"><ShieldCheck size={14}/> YOUR PERSONAL SPACE</div>
    <h1>{mode === 'signin' ? 'Welcome back.' : 'Make space for what matters.'}</h1>
    <p className="auth-intro">{mode === 'signin' ? 'Sign in to continue to your LOCKER.' : 'Create your account to get your own private space.'}</p>
    <form onSubmit={submit}>
      {mode === 'signup' && <label className="auth-field"><span>Your name</span><input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Name" autoComplete="name" maxLength={80} required/></label>}
      <label className="auth-field"><span>Email address</span><div className="auth-input-wrap"><Mail size={16}/><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></div></label>
      <label className="auth-field"><span>Password</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={8} required/></label>
      {error && <div className="auth-alert auth-error" role="alert">{error}</div>}
      {message && <div className="auth-alert auth-message" role="status">{message}</div>}
      <button className="auth-submit" type="submit" disabled={busy}>{busy ? <LoaderCircle className="auth-spinner" size={17}/> : <>{mode === 'signin' ? 'Sign in securely' : 'Create account'} <ArrowRight size={17}/></>}</button>
    </form>
    <div className="auth-switch">{mode === 'signin' ? 'New to LOCKER?' : 'Already have an account?'} <button onClick={() => {setMode(mode === 'signin' ? 'signup' : 'signin');setError('');setMessage('');}}>{mode === 'signin' ? 'Create account' : 'Sign in'}</button></div>
    <div className="auth-privacy"><ShieldCheck size={15}/><span>Your account is protected by Supabase authentication. File encryption and secure file storage are not yet implemented.</span></div>
  </div><p className="auth-footnote">LOCKER · YOUR SPACE, SECURED</p></div>;

  return <><div className="auth-session-bar"><span><ShieldCheck size={15}/> Signed in as <strong>{session.user.email}</strong></span><button onClick={async () => { await supabase.auth.signOut(); }}>Sign out</button></div>{children}</>;
}
