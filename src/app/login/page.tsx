'use client';

import { authClient } from '@/lib/auth-client';
import { useState } from 'react';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function signIn() {
        setError('');
        setLoading(true);
        try {
            const result = await authClient.signIn.social({ provider: 'oidc', callbackURL: '/' });
            if (result.error) setError(result.error.message || 'Unable to sign in. Please try again.');
        } catch {
            setError('Unable to sign in. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className='flex min-h-screen items-center justify-center bg-black p-6 text-white'>
            <div className='w-full max-w-sm space-y-5 rounded-lg border border-white/10 p-8'>
                <h1 className='text-2xl font-semibold'>GPT Image Playground</h1>
                <p className='text-white/70'>Sign in with your account to create and manage images.</p>
                {error && <p role='alert' className='text-red-400'>{error}</p>}
                <button type='button' onClick={signIn} disabled={loading} className='w-full rounded bg-white px-4 py-2 font-medium text-black disabled:opacity-50'>
                    {loading ? 'Redirecting…' : 'Sign in'}
                </button>
            </div>
        </main>
    );
}
