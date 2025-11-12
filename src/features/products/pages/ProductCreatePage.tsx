import { useState } from 'react';
import { Controller } from'react-hook-form';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  DollarSign,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { formatCurrency } from '../../../utils/currency';
import { productService, type CreateProductInput } from '../services/product.service';
// import type { ProductCategory } from '../../../types/product';

const PRODUCT_CATEGORIES = [
  { value: 'acougues', label: '🥩 Açougues', icon: '🥩' },
  { value: 'padarias', label: '🥖 Padarias', icon: '🥖' },
  { value: 'limpeza', label: '🧹 Limpeza', icon: '🧹' },
  { value: 'hortifruti', label: '🥗 Hortifruti', icon: '🥗' },
  { value: 'bebidas', label: '🥤 Bebidas', icon: '🥤' },
  { value: 'pet', label: '🐾 Pet', icon: '🐾' },
  { value: 'outros', label: '📦 Outros', icon: '📦' },
] as const;

const UNITS = [
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'l', label: 'Litro (l)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'unidade', label: 'Unidade' },
  { value: 'pacote', label: 'Pacote' },
  { value: 'caixa', label: 'Caixa' },
  { value: 'bandeja', label: 'Bandeja' },
  { value: 'dúzia', label: 'Dúzia' },
  { value: 'metro', label: 'Metro (m)' },
];

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProductInput>({
    defaultValues: {
      is_available: true,
      stock_quantity: 0,
      price: 0,
    },
  });

  const watchedPrice = watch('price');
  const watchedUnit = watch('unit');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas imagens');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // In a real app, you would upload the image to a storage service
        // For now, we'll just use the data URL
        setValue('image_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue('image_url', undefined);
  };

  const onSubmit = async (data: CreateProductInput) => {
    setIsSubmitting(true);
    try {
      // Convert price to number
      const productData = {
        ...data,
        price: Number(data.price),
        stock_quantity: data.stock_quantity ? Number(data.stock_quantity) : undefined,
      };

      await productService.createProduct(productData);

      toast.success('Produto cadastrado com sucesso!', {
        duration: 3000,
      });

      // Redirect to products page after 1 second
      setTimeout(() => {
        navigate('/seller/products', { replace: true });
      }, 1000);
    } catch (error: any) {
      setIsSubmitting(false);

      let errorMessage = 'Erro ao cadastrar produto';

      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail
            .map((err: any) => err.msg || err.message)
            .join(', ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 5000,
      });
    }
  };

  const handleCancel = () => {
    navigate('/seller/products');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Cadastrar Produto</h1>
          <p className="text-light-gray">
            Adicione um novo produto ao seu catálogo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-dark">
                Informações Básicas
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Nome do produto é obrigatório',
                    minLength: {
                      value: 3,
                      message: 'Nome deve ter no mínimo 3 caracteres',
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Picanha Premium"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
                  placeholder="Descreva seu produto, origem, qualidade, etc..."
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Uma boa descrição ajuda os clientes a conhecerem melhor seu produto
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  <option value="">Selecione uma categoria</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Código SKU
                </label>
                <input
                  type="text"
                  {...register('sku')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: PROD-001, ABC123"
                  disabled={isSubmitting}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Código alfanumérico único para identificar este produto (opcional)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Tags (palavras-chave)
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: orgânico, fresco, premium (separadas por vírgula)"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tags ajudam os clientes a encontrar seu produto nas buscas
                </p>
              </div>
            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-dark">
                Preço e Estoque
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Preço (R$) *
                  </label>
                  <Controller
                    name="price"
                    control={control}
                    rules={{
                      required: 'Preço é obrigatório',
                      min: {
                        value: 0.01,
                        message: 'Preço deve ser maior que zero',
                      },
                    }}
                    render={({ field }) => (
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.price?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Unidade *
                  </label>
                  <select
                    {...register('unit', {
                      required: 'Unidade é obrigatória',
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  >
                    <option value="">Selecione a unidade</option>
                    {UNITS.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
                  )}
                </div>
              </div>

              {watchedPrice && watchedUnit && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium">
                    Preço de venda:{' '}
                    <span className="text-lg text-blue-700">
                      {formatCurrency(watchedPrice)} / {watchedUnit}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Quantidade em Estoque
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('stock_quantity')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe vazio ou 0 se não controlar estoque
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_available"
                  {...register('is_available')}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  disabled={isSubmitting}
                />
                <label htmlFor="is_available" className="text-sm font-medium text-dark">
                  Produto disponível para venda
                </label>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-dark">Imagem do Produto</h2>
            </div>

            <div className="space-y-4">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Clique para fazer upload ou arraste uma imagem
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    PNG, JPG ou WEBP até 5MB
                  </p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <span className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer inline-block">
                      Selecionar Imagem
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 text-dark rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-lg font-medium text-dark text-center">
                Cadastrando produto...
              </p>
              <p className="mt-2 text-sm text-light-gray text-center">
                Aguarde um momento
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
