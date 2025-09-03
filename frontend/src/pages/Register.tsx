import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as apiRegister } from 'src/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiRegister({
        name,
        email,
        password,
        phone: phone || undefined,
        photo_url: photoUrl || undefined,
      } as any);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow p-6 rounded">
        <h1 className="text-2xl mb-4">Register</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border mb-3" />

          <label className="block mb-2">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full p-2 border mb-3" />

          <label className="block mb-2">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full p-2 border mb-3" />

          <label className="block mb-2">Phone (optional)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border mb-3" />

          <label className="block mb-2">Photo URL (optional)</label>
          <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="w-full p-2 border mb-3" />

          {error && <div className="text-red-600 mb-2">{error}</div>}
          <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-green-600 text-white">
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}