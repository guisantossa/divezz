import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from 'src/api';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate('/', { replace: true });
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await apiLogin({ email, password });
            // apiLogin may already save token; ensure token is set
            if (data?.access_token) localStorage.setItem('token', data.access_token);
            navigate('/', { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.detail || err?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white shadow p-6 rounded">
                <h1 className="text-2xl mb-4">Login</h1>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="w-full p-2 border mb-3"
                        required
                    />
                    <label className="block mb-2">Password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="w-full p-2 border mb-3"
                        required
                    />
                    {error && <div className="text-red-600 mb-2">{error}</div>}
                    <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-blue-600 text-white">
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>
                {/* add link to register page */}
                <div className="mt-3 text-sm">
                    Não tem conta? <Link to="/register" className="text-blue-600">Criar conta</Link>
                </div>
            </div>
        </div>
    );
}