/**
 * OffersPage - Page to display all active offers
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Percent, TrendingUp } from 'lucide-react';
import { useOffers } from '../../features/offers/hooks/useOffers';
import OfferCard from '../../features/offers/components/OfferCard';
import Loading from '../../components/ui/Loading';

export default function OffersPage() {
  // Buscar todas as ofertas ativas
  const { offers, loading, error, total } = useOffers({
    is_active: true,
    limit: 100,
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container-custom py-10 px-4 md:px-6">
          <Link
            to="/"
            className="text-primary hover:underline inline-flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-dark text-white px-4 py-1 rounded-full text-xs font-bold mb-3">
                <Percent className="w-3 h-3" />
                PROMOÇÕES ATIVAS
              </div>
              <h1 className="text-4xl font-bold text-dark mb-2">Super Ofertas</h1>
              <p className="text-xl text-light-gray">
                Aproveite descontos incríveis em produtos selecionados
              </p>
            </div>
          </div>

          {!loading && (
            <div className="flex items-center gap-6 text-sm text-light-gray">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>
                  {total} {total === 1 ? 'oferta disponível' : 'ofertas disponíveis'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-dark" />
                <span>Descontos de até 50%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-16 px-4 md:px-6">
        {loading && (
          <Loading size="lg" text="Carregando ofertas..." />
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-dark font-semibold mb-2">Erro ao carregar ofertas</p>
            <p className="text-light-gray">{error}</p>
          </div>
        )}

        {!loading && !error && offers.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Zap className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">
              Nenhuma oferta disponível no momento
            </h2>
            <p className="text-light-gray mb-6">
              Fique de olho! Novas ofertas são adicionadas regularmente.
            </p>
            <Link
              to="/"
              className="text-primary hover:underline inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para home
            </Link>
          </div>
        )}

        {!loading && !error && offers.length > 0 && (
          <>
            {/* Info Banner */}
            <div className="bg-primary text-white rounded-xl p-8 mb-10 shadow-lg">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">⚡ Ofertas por Tempo Limitado</h3>
                  <p className="text-white/90">
                    Não perca! Estas ofertas podem expirar a qualquer momento.
                  </p>
                </div>
                <Zap className="w-16 h-16 opacity-20 hidden md:block" />
              </div>
            </div>

            {/* Ofertas Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>

            {/* Bottom Info */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-dark mb-3">
                  💡 Dica: Adicione produtos ao carrinho rapidamente
                </h3>
                <p className="text-light-gray">
                  Os preços promocionais são aplicados automaticamente no checkout.
                  Aproveite enquanto há estoque disponível!
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
