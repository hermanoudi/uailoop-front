/**
 * SellerDetail - Page to display seller details and their products
 */

import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle,
  Phone,
  Mail,
  Globe,
  Truck,
  Package,
  ShoppingBag,
  Award,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { useSeller } from '../../features/sellers/hooks/useSeller';
import { useProducts } from '../../features/products/hooks/useProducts';
import ProductCard from '../../features/products/components/ProductCard';
import Loading from '../../components/ui/Loading';
import { formatCurrency } from '../../lib/formatters';

export default function SellerDetail() {
  const { id } = useParams<{ id: string }>();

  const { seller, loading: loadingSeller, error: errorSeller } = useSeller(id!);
  const { products, loading: loadingProducts } = useProducts({
    seller_id: Number(id),
    size: 50,
  });

  const defaultBanner = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=400&fit=crop';
  const defaultLogo = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop';

  if (loadingSeller) {
    return (
      <div className="container-custom py-20">
        <Loading size="lg" text="Carregando vendedor..." />
      </div>
    );
  }

  if (errorSeller || !seller) {
    return (
      <div className="container-custom py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-dark mb-2">Vendedor não encontrado</h2>
          <p className="text-light-gray mb-6">{errorSeller || 'O vendedor que você procura não existe.'}</p>
          <Link
            to="/"
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para home
          </Link>
        </div>
      </div>
    );
  }

  const totalProducts = products.length;
  const ratingValue = Number(seller.rating_average);
  const ratingCount = seller.rating_count;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div
        className="h-48 md:h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('${seller.banner_url || defaultBanner}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Seller Main Info */}
      <div className="bg-white border-b shadow-sm -mt-16 relative z-10">
        <div className="container-custom px-4 md:px-6 py-8">
          <Link
            to="/"
            className="text-primary hover:underline inline-flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          <div className="grid md:grid-cols-12 gap-6">
            {/* Left Column - Logo and Basic Info */}
            <div className="md:col-span-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Logo */}
                <div
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-cover bg-center shadow-xl border-4 border-white flex-shrink-0"
                  style={{
                    backgroundImage: `url('${seller.logo_url || defaultLogo}')`,
                  }}
                />

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-dark">{seller.business_name}</h1>
                    {seller.is_verified && (
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-7 h-7 text-primary" />
                        <span className="text-xs text-primary font-semibold">Verificado</span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        <span className="text-2xl font-bold text-dark">
                          {ratingValue.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-light-gray">
                        ({ratingCount} {ratingCount === 1 ? 'avaliação' : 'avaliações'})
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-light-gray mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {seller.city}, {seller.state}
                    </span>
                  </div>

                  {/* Contact Info Compact */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {seller.business_phone && (
                      <a
                        href={`tel:${seller.business_phone}`}
                        className="flex items-center gap-2 text-light-gray hover:text-primary transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{seller.business_phone}</span>
                      </a>
                    )}
                    {seller.business_email && (
                      <a
                        href={`mailto:${seller.business_email}`}
                        className="flex items-center gap-2 text-light-gray hover:text-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </a>
                    )}
                    {seller.website && (
                      <a
                        href={seller.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-light-gray hover:text-primary transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Statistics */}
            <div className="md:col-span-4">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Reputação do Vendedor
                </h3>

                {/* Stat Item */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-light-gray">
                    <Package className="w-4 h-4" />
                    <span>Produtos</span>
                  </div>
                  <span className="font-bold text-dark">{totalProducts}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-light-gray">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Avaliações</span>
                  </div>
                  <span className="font-bold text-dark">{ratingCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-light-gray">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Satisfação</span>
                  </div>
                  <span className="font-bold text-primary">{Math.round((ratingValue / 5) * 100)}%</span>
                </div>

                {seller.is_verified && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-semibold">Vendedor Verificado</span>
                    </div>
                    <p className="text-xs text-light-gray mt-1">
                      Este vendedor foi verificado pela plataforma
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container-custom px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="md:col-span-8">
            {/* Description */}
            {seller.description && (
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <h2 className="text-xl font-bold text-dark mb-3">Sobre o Vendedor</h2>
                <p className="text-light-gray leading-relaxed">{seller.description}</p>
              </div>
            )}

            {/* Products Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-dark mb-2">
                  Produtos Disponíveis
                </h2>
                <p className="text-light-gray">
                  {totalProducts} {totalProducts === 1 ? 'produto' : 'produtos'} à venda
                </p>
              </div>

              {loadingProducts && (
                <div className="py-12">
                  <Loading size="lg" text="Carregando produtos..." />
                </div>
              )}

              {!loadingProducts && products.length === 0 && (
                <div className="py-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    Nenhum produto disponível
                  </h3>
                  <p className="text-light-gray">
                    Este vendedor ainda não cadastrou produtos.
                  </p>
                </div>
              )}

              {!loadingProducts && products.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="md:col-span-4 space-y-6">
            {/* Delivery Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Informações de Entrega
              </h3>

              <div className="space-y-4">
                {seller.delivery_radius_km && (
                  <div>
                    <p className="text-xs text-light-gray mb-1">Raio de Entrega</p>
                    <p className="font-semibold text-dark">{seller.delivery_radius_km} km</p>
                  </div>
                )}

                {seller.min_order_value && (
                  <div>
                    <p className="text-xs text-light-gray mb-1">Pedido Mínimo</p>
                    <p className="font-semibold text-dark">
                      {formatCurrency(Number(seller.min_order_value))}
                    </p>
                  </div>
                )}

                {seller.delivery_fee !== null && seller.delivery_fee !== undefined && (
                  <div>
                    <p className="text-xs text-light-gray mb-1">Taxa de Entrega</p>
                    <p className="font-semibold text-dark">
                      {Number(seller.delivery_fee) === 0
                        ? 'Frete Grátis'
                        : formatCurrency(Number(seller.delivery_fee))}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Benefits */}
            <div className="bg-primary/5 rounded-xl p-6">
              <h3 className="font-bold text-dark mb-4">Vantagens de Comprar Aqui</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">Produtos Frescos</p>
                    <p className="text-xs text-light-gray">Entrega rápida e local</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">Entrega Rápida</p>
                    <p className="text-xs text-light-gray">Na sua região</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <ThumbsUp className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">Qualidade Garantida</p>
                    <p className="text-xs text-light-gray">Produtos selecionados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Localização
              </h3>
              <p className="text-sm text-light-gray leading-relaxed">
                {seller.street}, {seller.number}
                {seller.complement && ` - ${seller.complement}`}
                <br />
                {seller.neighborhood}
                <br />
                {seller.city}/{seller.state}
                <br />
                CEP: {seller.cep}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
