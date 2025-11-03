/**
 * ProductCard component - Displays a product card
 */

import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { ProductListItem } from '../../../types/product';
import { formatCurrency } from '../../../lib/formatters';
import { useCart } from '../../../contexts/CartContext';
import Button from '../../../components/ui/Button';

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const defaultImage = 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop';

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
        <div
          className="h-48 bg-cover bg-center relative"
          style={{
            backgroundImage: `url('${product.image_url || defaultImage}')`,
          }}
        >
          {!product.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                INDISPONÍVEL
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-light-gray mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {product.seller_name && (
            <p className="text-xs text-light-gray mb-3">
              Vendido e entregue por <span className="font-semibold text-dark-gray">{product.seller_name}</span>
            </p>
          )}

          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(product.price)}
              </p>
              <p className="text-sm text-light-gray">por {product.unit}</p>
            </div>
            {product.is_available && (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
