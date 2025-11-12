import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Truck, ChevronRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { sellerService } from '../../sellers/services/seller.service';
import { fetchAddressFromCEP, formatCEP, formatCNPJ, formatPhone } from '../../../utils/cep';
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { SELLER_CATEGORIES, type SellerCreateInput } from '../../../types/seller';

type Step = 1 | 2 | 3;

export default function SellerOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SellerCreateInput>({
    defaultValues: {
      delivery_radius_km: 5,
      min_order_value: 0,
      delivery_fee: 0,
    },
  });

  const watchedCep = watch('cep');
  const watchedDeliveryRadius = watch('delivery_radius_km') || 5;

  // Fetch address when CEP is complete
  const handleCepBlur = async () => {
    if (!watchedCep || watchedCep.length < 8) return;

    setIsFetchingAddress(true);
    try {
      const addressData = await fetchAddressFromCEP(watchedCep);

      if (addressData) {
        setValue('street', addressData.logradouro);
        setValue('neighborhood', addressData.bairro);
        setValue('city', addressData.localidade);
        setValue('state', addressData.uf);
        toast.success('Endereço encontrado!');
      } else {
        toast.error('CEP não encontrado');
      }
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const onSubmit = async (data: SellerCreateInput) => {
    setIsSubmitting(true);
    try {
      await sellerService.createSeller(data);

      // Show success message with longer duration
      toast.success('Cadastro realizado com sucesso! Redirecionando...', {
        duration: 3000,
      });

      // Wait 2 seconds before redirecting so user can see success message
      setTimeout(() => {
        navigate('/seller/dashboard', { replace: true });
      }, 2000);
    } catch (error: any) {
      setIsSubmitting(false);

      // Show detailed error message
      let errorMessage = 'Erro ao cadastrar vendedor';

      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          // Handle validation errors from FastAPI
          errorMessage = error.response.data.detail
            .map((err: any) => err.msg || err.message)
            .join(', ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 5000, // Show error for longer
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep((currentStep + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-dark mb-4">
            Cadastro de Vendedor
          </h1>
          <p className="text-light-gray">
            Complete seu cadastro para começar a vender na UaiLoop
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  currentStep >= step
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-20 h-1 transition-colors ${
                    currentStep > step ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8 relative">
          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 rounded-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              <p className="mt-4 text-lg font-medium text-dark">
                Cadastrando seu negócio...
              </p>
              <p className="mt-2 text-sm text-light-gray">
                Aguarde enquanto configuramos tudo para você
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-dark">
                    Dados do Negócio
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Nome Fantasia *
                  </label>
                  <input
                    type="text"
                    {...register('business_name', {
                      required: 'Nome fantasia é obrigatório',
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ex: Padaria do João"
                  />
                  {errors.business_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    {...register('cnpj', {
                      required: 'CNPJ é obrigatório',
                      pattern: {
                        value: /^\d{14}$/,
                        message: 'CNPJ deve ter 14 dígitos',
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="12345678901234"
                    maxLength={14}
                  />
                  {errors.cnpj && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cnpj.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Categoria *
                  </label>
                  <select
                    {...register('category', {
                      required: 'Categoria é obrigatória',
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecione uma categoria</option>
                    {SELLER_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Descrição
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Conte um pouco sobre seu negócio..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Telefone Comercial
                    </label>
                    <input
                      type="tel"
                      {...register('business_phone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="31999887766"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Email Comercial
                    </label>
                    <input
                      type="email"
                      {...register('business_email')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="contato@meunegocia.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-dark">Endereço</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    CEP *
                  </label>
                  <input
                    type="text"
                    {...register('cep', {
                      required: 'CEP é obrigatório',
                      pattern: {
                        value: /^\d{8}$/,
                        message: 'CEP deve ter 8 dígitos',
                      },
                    })}
                    onBlur={handleCepBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="30110000"
                    maxLength={8}
                    disabled={isFetchingAddress}
                  />
                  {errors.cep && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cep.message}
                    </p>
                  )}
                  {isFetchingAddress && (
                    <p className="text-primary text-sm mt-1">
                      Buscando endereço...
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark mb-2">
                      Rua *
                    </label>
                    <input
                      type="text"
                      {...register('street', { required: 'Rua é obrigatória' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.street.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      {...register('number', { required: 'Número é obrigatório' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="123"
                    />
                    {errors.number && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.number.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    {...register('complement')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Loja 1, Sala 201, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      {...register('neighborhood', {
                        required: 'Bairro é obrigatório',
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.neighborhood && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.neighborhood.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      {...register('city', { required: 'Cidade é obrigatória' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Estado *
                    </label>
                    <input
                      type="text"
                      {...register('state', { required: 'Estado é obrigatório' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="MG"
                      maxLength={2}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Delivery Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-dark">
                    Configurações de Entrega
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Raio de Entrega: {watchedDeliveryRadius} km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    {...register('delivery_radius_km', { valueAsNumber: true })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 km</span>
                    <span>25 km</span>
                    <span>50 km</span>
                  </div>
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      📍 Você atenderá clientes em um raio de{' '}
                      <strong>{watchedDeliveryRadius} km</strong> do seu endereço
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Valor Mínimo do Pedido (R$)
                    </label>
                    <Controller
                      name="min_order_value"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Deixe 0 para não ter mínimo
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Taxa de Entrega (R$)
                    </label>
                    <Controller
                      name="delivery_fee"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Deixe 0 para entrega grátis
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-dark rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Voltar
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Próximo
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
