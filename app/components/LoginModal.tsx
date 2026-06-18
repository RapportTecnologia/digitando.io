'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, Mail, User as UserIcon, ArrowRight } from 'lucide-react';
import { useSession } from '@/app/context/SessionContext';

export default function LoginModal() {
  const { login } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = 'Informe seu nome';
    if (!email.trim()) {
      next.email = 'Informe seu e-mail';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'E-mail inválido';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      login(name, email);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ background: 'var(--surface)', color: 'var(--text)' }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
            style={{ background: 'var(--accent)' }}
          >
            <Keyboard className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Digitando.io</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Aprenda a digitar de forma divertida e gamificada
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nome</label>
            <div className="relative">
              <UserIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                autoFocus
                className="w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none transition focus:ring-2"
                style={{
                  background: 'var(--bg)',
                  borderColor: errors.name ? 'var(--error)' : 'var(--key-border)',
                  color: 'var(--text)',
                }}
              />
            </div>
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">E-mail</label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                className="w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none transition focus:ring-2"
                style={{
                  background: 'var(--bg)',
                  borderColor: errors.email ? 'var(--error)' : 'var(--key-border)',
                  color: 'var(--text)',
                }}
              />
            </div>
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>
                {errors.email}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            Começar a treinar
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-xs text-center mt-5" style={{ color: 'var(--text-muted)' }}>
          Seus dados ficam apenas neste navegador. Use o mesmo e-mail para retomar de onde parou.
        </p>
      </motion.div>
    </div>
  );
}
