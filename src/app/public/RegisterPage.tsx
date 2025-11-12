/**
 * RegisterPage - User registration page
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, MapPin, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import type { RegisterData } from '../../types/auth';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // Check if registering as seller
  const searchParams = new URLSearchParams(window.location.search);
  const isSeller = searchParams.get('seller') === 'true';

  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    full_name: '',
    cpf: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    is_seller: isSeller,
  });

  const [step, setStep] = useState(1); // 1: Personal Info, 2: Address (only if not seller), 3: Account

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For sellers, only 1 step (basic info + account)
    // For customers, 3 steps (personal, address, account)
    const maxSteps = isSeller ? 1 : 3;

    if (step < maxSteps) {
      setStep(step + 1);
      return;
    }

    try {
      await register(formData);

      // If seller, redirect to onboarding
      if (isSeller) {
        navigate('/seller/onboarding', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom px-4 md:px-6 py-20">
        <Link
          to="/"
          className="text-primary hover:underline inline-flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para home
        </Link>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">U</span>
            </div>
            <h1 className="text-3xl font-bold text-dark mb-2">
              {isSeller ? 'Cadastro de Vendedor' : 'Criar sua conta'}
            </h1>
            <p className="text-light-gray">
              {isSeller ? (
                'Crie sua conta pessoal para gerenciar sua empresa'
              ) : (
                <>
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-primary hover:underline font-semibold">
                    Entrar
                  </Link>
                </>
              )}
            </p>
          </div>

          {/* Progress - Only show for customers */}
          {!isSeller && (
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="text-sm font-semibold hidden md:inline">Dados Pessoais</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="text-sm font-semibold hidden md:inline">Endereço</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span className="text-sm font-semibold hidden md:inline">Conta</span>
                </div>
              </div>
            </div>
          )}

          {/* Info banner for sellers */}
          {isSeller && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-8">
              <p className="text-sm text-primary text-center">
                <strong>Passo 1 de 2:</strong> Crie sua conta pessoal. No próximo passo, você cadastrará os dados da sua empresa (CNPJ, endereço, etc).
              </p>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Info or Simple Account (for sellers) */}
              {step === 1 && (
                <>
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-semibold text-dark mb-2">
                      {isSeller ? 'Seu Nome Completo *' : 'Nome Completo *'}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray w-5 h-5" />
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        placeholder={isSeller ? "Nome do responsável pela conta" : "Seu nome completo"}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    {isSeller && (
                      <p className="text-xs text-gray-500 mt-1">
                        Nome da pessoa que vai gerenciar a conta da empresa
                      </p>
                    )}
                  </div>

                  {/* For sellers: show email and password in step 1 */}
                  {isSeller && (
                    <>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-dark mb-2">
                          E-mail *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray w-5 h-5" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="seu@email.com"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-dark mb-2">
                          Senha *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray w-5 h-5" />
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* For customers: show CPF and phone */}
                  {!isSeller && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cpf" className="block text-sm font-semibold text-dark mb-2">
                          CPF *
                        </label>
                        <input
                          type="text"
                          id="cpf"
                          name="cpf"
                          value={formData.cpf}
                          onChange={handleChange}
                          required
                          placeholder="000.000.000-00"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-dark mb-2">
                          Telefone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray w-5 h-5" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(31) 99999-9999"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Address */}
              {step === 2 && (
                <>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label htmlFor="cep" className="block text-sm font-semibold text-dark mb-2">
                        CEP *
                      </label>
                      <input
                        type="text"
                        id="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        required
                        placeholder="30000-000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block text-sm font-semibold text-dark mb-2">
                        Rua *
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        placeholder="Nome da rua"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="number" className="block text-sm font-semibold text-dark mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        id="number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        required
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="complement" className="block text-sm font-semibold text-dark mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        id="complement"
                        name="complement"
                        value={formData.complement}
                        onChange={handleChange}
                        placeholder="Apto, Bloco, etc"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="neighborhood" className="block text-sm font-semibold text-dark mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      required
                      placeholder="Nome do bairro"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="city" className="block text-sm font-semibold text-dark mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Belo Horizonte"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-semibold text-dark mb-2">
                        Estado *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        placeholder="MG"
                        maxLength={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Account */}
              {step === 3 && (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-dark mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray w-5 h-5" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="seu@email.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-dark mb-2">
                      Senha *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray w-5 h-5" />
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                        minLength={6}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-light-gray mt-1">Mínimo de 6 caracteres</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="is_seller"
                      name="is_seller"
                      checked={formData.is_seller}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="is_seller" className="text-sm text-dark cursor-pointer">
                      Quero me cadastrar como <span className="font-semibold text-primary">vendedor</span>
                    </label>
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                {step > 1 && !isSeller && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading}
                >
                  {isSeller
                    ? loading
                      ? 'Criando conta...'
                      : 'Criar Conta e Continuar'
                    : step < 3
                    ? 'Continuar'
                    : loading
                    ? 'Criando conta...'
                    : 'Criar conta'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
