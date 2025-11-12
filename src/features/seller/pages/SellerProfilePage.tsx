import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import {
  Building2,
  MapPin,
  Truck,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  Globe,
  MapPinned,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { sellerService } from '../../sellers/services/seller.service';
import { fetchAddressFromCEP, formatCNPJ } from '../../../utils/cep';
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { SELLER_CATEGORIES, type Seller, type SellerCreateInput } from '../../../types/seller';

export default function SellerProfilePage() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SellerCreateInput>();

  const watchedCep = watch('cep');

  // Load seller data
  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    try {
      setIsLoading(true);
      const data = await sellerService.getMySeller();
      setSeller(data);

      // Set form values
      reset({
        business_name: data.business_name,
        cnpj: data.cnpj,
        description: data.description || '',
        category: data.category,
        business_phone: data.business_phone || '',
        business_email: data.business_email || '',
        website: data.website || '',
        cep: data.cep,
        street: data.street,
        number: data.number,
        complement: data.complement || '',
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        delivery_radius_km: Number(data.delivery_radius_km) || 5,
        min_order_value: Number(data.min_order_value) || 0,
        delivery_fee: Number(data.delivery_fee) || 0,
      });
    } catch (error: any) {
      toast.error('Erro ao carregar dados do vendedor');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      const updatedSeller = await sellerService.updateMySeller(data);
      setSeller(updatedSeller);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao atualizar perfil';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (seller) {
      reset({
        business_name: seller.business_name,
        cnpj: seller.cnpj,
        description: seller.description || '',
        category: seller.category,
        business_phone: seller.business_phone || '',
        business_email: seller.business_email || '',
        website: seller.website || '',
        cep: seller.cep,
        street: seller.street,
        number: seller.number,
        complement: seller.complement || '',
        neighborhood: seller.neighborhood,
        city: seller.city,
        state: seller.state,
        delivery_radius_km: Number(seller.delivery_radius_km) || 5,
        min_order_value: Number(seller.min_order_value) || 0,
        delivery_fee: Number(seller.delivery_fee) || 0,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-dark">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500">Erro ao carregar perfil do vendedor</p>
        </div>
      </div>
    );
  }

  const watchedDeliveryRadius = watch('delivery_radius_km') || 5;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-dark mb-2">Minha Conta</h1>
            <p className="text-light-gray">
              Gerencie as informações do seu negócio
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              Editar Perfil
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-dark rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Account Status */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="text-lg font-semibold text-dark mb-4">
                Status da Conta
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-light-gray">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      seller.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {seller.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-light-gray">Verificado:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      seller.is_verified
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {seller.is_verified ? 'Sim' : 'Não'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-light-gray">Avaliação:</span>
                  <span className="text-sm font-medium text-dark">
                    ⭐ {Number(seller.rating_average).toFixed(1)} ({seller.rating_count}{' '}
                    {seller.rating_count === 1 ? 'avaliação' : 'avaliações'})
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <span className="text-xs text-light-gray">
                    Cadastrado em{' '}
                    {new Date(seller.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Profile Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Business Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-dark">
                    Dados do Negócio
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Nome Fantasia *
                    </label>
                    <input
                      type="text"
                      {...register('business_name', {
                        required: 'Nome fantasia é obrigatório',
                      })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                    />
                    {errors.business_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.business_name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        CNPJ *
                      </label>
                      <input
                        type="text"
                        value={formatCNPJ(seller.cnpj)}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                      <p className="text-xs text-light-gray mt-1">
                        CNPJ não pode ser alterado
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Categoria *
                      </label>
                      <select
                        {...register('category', {
                          required: 'Categoria é obrigatória',
                        })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                      >
                        {SELLER_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Descrição
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="Conte um pouco sobre seu negócio..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Telefone Comercial
                      </label>
                      <input
                        type="tel"
                        {...register('business_phone')}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="31999887766"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email Comercial
                      </label>
                      <input
                        type="email"
                        {...register('business_email')}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="contato@meunegocia.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        <Globe className="w-4 h-4 inline mr-1" />
                        Website
                      </label>
                      <input
                        type="url"
                        {...register('website')}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="https://meusite.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-dark">Endereço</h2>
                </div>

                <div className="space-y-4">
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
                      disabled={!isEditing || isFetchingAddress}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="30110000"
                      maxLength={8}
                    />
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
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        {...register('number', { required: 'Número é obrigatório' })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      {...register('complement')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
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
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        {...register('city', { required: 'Cidade é obrigatória' })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Estado *
                      </label>
                      <input
                        type="text"
                        {...register('state', { required: 'Estado é obrigatório' })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="MG"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  {seller.latitude && seller.longitude && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MapPinned className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Coordenadas Geográficas
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            Lat: {Number(seller.latitude).toFixed(6)}, Lon:{' '}
                            {Number(seller.longitude).toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-dark">
                    Configurações de Entrega
                  </h2>
                </div>

                <div className="space-y-4">
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
                      disabled={!isEditing}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1 km</span>
                      <span>25 km</span>
                      <span>50 km</span>
                    </div>
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        📍 Você atende clientes em um raio de{' '}
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
                            disabled={!isEditing}
                            className="disabled:bg-gray-50 disabled:text-gray-600"
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
                            disabled={!isEditing}
                            className="disabled:bg-gray-50 disabled:text-gray-600"
                          />
                        )}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Deixe 0 para entrega grátis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
