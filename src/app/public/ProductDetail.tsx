/**
 * ProductDetail page - Shows detailed information about a product
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, MapPin, Package, Truck, Shield, Heart } from 'lucide-react';
import { useProduct } from '../../features/products/hooks/useProduct';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../lib/formatters';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id ? parseInt(id) : null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  if (loading) {
    return (
      <div className="container-custom py-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-custom py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Produto não encontrado</h2>
          <p className="text-light-gray mb-6">{error || 'O produto que você está procurando não existe.'}</p>
          <Button onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`);
    // TODO: Implement cart functionality
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const defaultImage = 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&h=600&fit=crop';

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-light-gray">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/explore" className="hover:text-primary transition-colors">Produtos</Link>
            <span>/</span>
            <span className="text-dark">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-light-gray hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
              <img
                src={product.image_url || defaultImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!product.is_available && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="bg-red-500 text-white text-lg font-bold px-6 py-3 rounded-full">
                    INDISPONÍVEL
                  </span>
                </div>
              )}
            </div>

            {product.thumbnail_url && (
              <div className="flex gap-2">
                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary cursor-pointer">
                  <img
                    src={product.thumbnail_url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              {/* Category Badge */}
              <div className="inline-block bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {product.category}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-dark mb-4">{product.name}</h1>

              {/* Seller Info */}
              {product.seller_name && (
                <div className="flex items-center gap-2 mb-4 text-sm text-light-gray">
                  <MapPin className="w-4 h-4" />
                  <span>
                    Vendido e entregue por{' '}
                    <Link
                      to={`/seller/${product.seller_id}`}
                      className="font-semibold text-dark hover:text-primary transition-colors"
                    >
                      {product.seller_name}
                    </Link>
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="border-t border-b py-4 mb-4">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-lg text-light-gray">por {product.unit}</span>
                </div>

                {product.unit === 'kit' && (
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                    <Package className="w-4 h-4" />
                    Produto em Kit
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.is_available && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Quantidade:
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-dark hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-6 py-2 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 text-dark hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    {product.stock_quantity && (
                      <span className="text-sm text-light-gray">
                        {Number(product.stock_quantity)} {product.unit} disponível
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {product.is_available ? (
                <div className="flex gap-4 mb-6">
                  <Button
                    onClick={handleAddToCart}
                    variant="secondary"
                    className="flex-1"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    variant="primary"
                    className="flex-1"
                    size="lg"
                  >
                    Comprar Agora
                  </Button>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      isFavorite
                        ? 'border-red-500 bg-red-50 text-red-500'
                        : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 font-semibold text-center">
                    Produto temporariamente indisponível
                  </p>
                </div>
              )}

              {/* Benefits */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark">Entrega Local</p>
                    <p className="text-sm text-light-gray">Receba em casa de vendedores da sua região</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark">Compra Segura</p>
                    <p className="text-sm text-light-gray">Seus dados protegidos e vendedores verificados</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark">Produtos Frescos</p>
                    <p className="text-sm text-light-gray">Qualidade garantida direto do vendedor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="bg-white rounded-xl p-6 shadow-md mb-8">
            <h2 className="text-2xl font-bold text-dark mb-4">Descrição do Produto</h2>
            <div className="text-light-gray whitespace-pre-line leading-relaxed">
              {product.description}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-dark mb-4">Informações Adicionais</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-light-gray mb-1">Categoria</p>
              <p className="font-semibold text-dark">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-light-gray mb-1">Unidade de Venda</p>
              <p className="font-semibold text-dark">{product.unit}</p>
            </div>
            {product.tags && (
              <div className="md:col-span-2">
                <p className="text-sm text-light-gray mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-dark text-sm px-3 py-1 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
