/**
 * SellerCard component - Displays a seller card
 */

import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import type { SellerListItem } from '../../../types/seller';
import Button from '../../../components/ui/Button';

interface SellerCardProps {
  seller: SellerListItem;
}

export default function SellerCard({ seller }: SellerCardProps) {
  const defaultLogo = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop';

  return (
    <Link to={`/seller/${seller.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-20 h-20 rounded-full bg-cover bg-center flex-shrink-0"
              style={{
                backgroundImage: `url('${seller.logo_url || defaultLogo}')`,
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-dark line-clamp-1 group-hover:text-primary transition-colors">
                  {seller.business_name}
                </h3>
                {seller.is_verified && (
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-dark">
                  {Number(seller.rating_average).toFixed(1)}
                </span>
                <span className="text-sm text-light-gray">
                  ({seller.rating_count} avaliações)
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-light-gray">
                <MapPin className="w-4 h-4" />
                <span>{seller.city}, {seller.state}</span>
              </div>
            </div>
          </div>

          {seller.description && (
            <p className="text-light-gray text-sm mb-4 line-clamp-2">
              {seller.description}
            </p>
          )}

          <Button variant="secondary" className="w-full">
            Ver Produtos
          </Button>
        </div>
      </div>
    </Link>
  );
}
