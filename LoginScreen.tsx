import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { PlatformLogo } from '../common/PlatformLogo';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  HardHat,
  Sparkles,
  Sun,
  Moon,
  KeyRound,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, register, availableAccounts } = useAuth();
  const { config, updateConfig } = useInventory();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('kaylapascoe04@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Supervisor de Campo');
  const [regDepartment, setRegDepartment] = useState('Obras y Montaje');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Credenciales inválidas.');
      }
    } catch {
      setErrorMessage('Ocurrió un error inesperado al intentar iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: 'almacen',
        roleTitle: regRole || 'Supervisor de Campo',
        department: regDepartment,
      });
      if (!res.success) {
        setErrorMessage(res.error || 'Error al crear la cuenta.');
      }
    } catch {
      setErrorMessage('Ocurrió un error al registrar el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickAccount = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => updateConfig({ darkMode: !config.darkMode })}
          aria-label="Cambiar modo oscuro"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          {config.darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo & Name */}
        <div className="flex flex-col items-center text-center">
          <PlatformLogo config={config} size="xl" />
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {config.companyName}
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {config.facilityName} · Sistema de Control de Herramientas, EPP y Custodia
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {/* Mode Switch Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-center rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Acceder con Correo
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-center rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Registrar Supervisor
            </button>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Correo Electrónico Corporativo
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@empresa.com"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Contraseña de Acceso
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 px-4 font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Verificando credenciales...</span>
                ) : (
                  <>
                    <span>Ingresar a la Plataforma</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ej: Ing. Patricia Vega"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nuevo.supervisor@empresa.com"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Cargo / Rol
                  </label>
                  <input
                    type="text"
                    required
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    placeholder="Ej: Supervisor SST"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Área
                  </label>
                  <input
                    type="text"
                    required
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="Ej: HSE"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Contraseña (mínimo 5 caracteres)
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 px-4 font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <span>Creando cuenta...</span> : <span>Registrar e Ingresar</span>}
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Panel */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
              <span className="font-semibold flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <KeyRound className="h-3 w-3 text-indigo-500" />
                Cuentas de Supervisores Preconfiguradas:
              </span>
              <span className="text-[10px] text-slate-400">Clic para cargar</span>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => fillQuickAccount('kaylapascoe04@gmail.com', 'admin123')}
                className="w-full flex items-center justify-between p-2 rounded-lg border border-indigo-500 bg-indigo-600 text-white hover:bg-indigo-700 text-left transition-colors shadow-2xs"
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>👑 Kayla Pascoe (Administradora)</span>
                  </div>
                  <div className="text-[11px] text-indigo-100">
                    kaylapascoe04@gmail.com (clave: admin123)
                  </div>
                </div>
                <span className="text-[10px] font-mono text-white font-bold bg-indigo-700 px-2 py-0.5 rounded">
                  Cargar
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickAccount('superadmin@plataforma.com', 'super123')}
                className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-300 bg-slate-900 text-white hover:bg-slate-800 text-left transition-colors dark:border-slate-700"
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>🟣 Super Admin Global</span>
                    <span className="text-[10px] font-normal text-slate-300">· Multiempresa</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    superadmin@plataforma.com (clave: super123)
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  Cargar
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickAccount('almacen@empresa.com', 'almacen123')}
                className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-300 text-left transition-colors dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    🏢 Constructora Atlas · Jefe Almacén
                  </div>
                  <div className="text-[11px] text-slate-500">
                    almacen@empresa.com · Ing. Rodrigo Cárdenas
                  </div>
                </div>
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  Cargar
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickAccount('admin@vanguardia.com', 'admin123')}
                className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-cyan-50/60 hover:border-cyan-300 text-left transition-colors dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    🏢 Vanguardia SpA · Admin Empresa
                  </div>
                  <div className="text-[11px] text-slate-500">
                    admin@vanguardia.com · Ing. Roberto Santana
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                  Cargar
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
