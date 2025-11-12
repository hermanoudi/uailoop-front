/**
 * OfferCard component - Displays an offer/promotion card
 */

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { OfferListItem } from '../../../types/offer';
import type { Product, ProductListItem } from '../../../types/product';
import { formatCurrency } from '../../../lib/formatters';
import { useCart } from '../../../contexts/CartContext';
import Button from '../../../components/ui/Button';
import { productService } from '../../products/services/product.service';
import { Clock, Percent, DollarSign, ShoppingCart } from 'lucide-react';

interface OfferCardProps {
  offer: OfferListItem;
  product?: ProductListItem; // Opcional: se já tiver os dados do produto
}

// Tipo que aceita Product ou ProductListItem
type ProductData = Pick<Product, 'name' | 'image_url' | 'unit'>;

export default function OfferCard({ offer, product: productProp }: OfferCardProps) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductData | null>(productProp || null);
  const [loading, setLoading] = useState(!productProp);

  const defaultImage = 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop';

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (product) {
      // Create a ProductListItem with offer price
      const productWithOffer: ProductListItem = {
        id: offer.product_id,
        name: product.name || offer.title,
        description: offer.description,
        price: offer.offer_price, // Use offer price instead of regular price
        unit: product.unit || 'unidade',
        image_url: product.image_url,
        is_available: true,
      sku: null,
        category: 'outros' as any,
        seller_id: offer.seller_id,
        seller_name: offer.seller_name || null,
      };
      addToCart(productWithOffer);
    }
  };

  // Busca produto se não foi fornecido
  useEffect(() => {
    if (!productProp && offer.product_id) {
      const fetchProduct = async () => {
        try {
          const data = await productService.getProduct(offer.product_id);
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product for offer:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [offer.product_id, productProp]);

  // Calcula desconto em % se for oferta fixa
  const discountPercentage =
    offer.discount_percentage ||
    (offer.original_price > 0
      ? Math.round(((offer.original_price - offer.offer_price) / offer.original_price) * 100)
      : 0);

  // Calcula tempo restante
  const endDate = new Date(offer.end_date);
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (loading) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/product/${offer.product_id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border-2 border-primary">
        {/* Badge de oferta */}
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-dark text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            {offer.offer_type === 'percentage' ? (
              <>
                <Percent className="w-3 h-3" />
                {discountPercentage}% OFF
              </>
            ) : (
              <>
                <DollarSign className="w-3 h-3" />
                OFERTA
              </>
            )}
          </div>
        </div>

        {/* Imagem do produto */}
        <div
          className="h-48 bg-cover bg-center relative"
          style={{
            backgroundImage: `url('${product?.image_url || defaultImage}')`,
          }}
        >
          {/* Overlay de oferta */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <div className="p-4">
          {/* Título da oferta */}
          <h3 className="text-lg font-bold text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {offer.title || product?.name || 'Produto em oferta'}
          </h3>

          {/* Nome do produto (se diferente do título) */}
          {product?.name && offer.title !== product.name && (
            <p className="text-sm text-light-gray mb-2">{product.name}</p>
          )}

          {/* Tempo restante */}
          {daysLeft > 0 && daysLeft <= 7 && (
            <div className="flex items-center gap-1 text-xs text-dark font-semibold mb-3">
              <Clock className="w-3 h-3" />
              {daysLeft === 1 ? 'Último dia!' : `${daysLeft} dias restantes`}
            </div>
          )}

          {/* Preços */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(offer.original_price)}
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(offer.offer_price)}
              </span>
            </div>
            {product?.unit && (
              <p className="text-xs text-light-gray">por {product.unit}</p>
            )}
          </div>

          {/* Economia */}
          <div className="mb-3">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
              Economize {formatCurrency(offer.original_price - offer.offer_price)}
            </span>
          </div>

          {/* Botão */}
          <div className="flex items-center justify-between">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Aproveitar Oferta
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
