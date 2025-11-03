/**
 * SellersPage - Page to display all sellers
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Store, TrendingUp, Award } from 'lucide-react';
import { useSellers } from '../../features/sellers/hooks/useSellers';
import SellerCard from '../../features/sellers/components/SellerCard';
import Loading from '../../components/ui/Loading';

export default function SellersPage() {
  const { sellers, loading, error, total } = useSellers({
    size: 100,
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container-custom px-4 md:px-6 py-10">
          <Link
            to="/"
            className="text-primary hover:underline inline-flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Store className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-dark text-white px-4 py-1 rounded-full text-xs font-bold mb-3">
                <Award className="w-3 h-3" />
                VENDEDORES LOCAIS
              </div>
              <h1 className="text-4xl font-bold text-dark mb-2">Vendedores em Destaque</h1>
              <p className="text-xl text-light-gray">
                Conheça os melhores vendedores da sua região
              </p>
            </div>
          </div>

          {!loading && (
            <div className="flex items-center gap-6 text-sm text-light-gray">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>
                  {total} {total === 1 ? 'vendedor disponível' : 'vendedores disponíveis'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-dark" />
                <span>Entregas locais e rápidas</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container-custom px-4 md:px-6 py-16">
        {loading && (
          <Loading size="lg" text="Carregando vendedores..." />
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-dark font-semibold mb-2">Erro ao carregar vendedores</p>
            <p className="text-light-gray">{error}</p>
          </div>
        )}

        {!loading && !error && sellers.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Store className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">
              Nenhum vendedor disponível no momento
            </h2>
            <p className="text-light-gray mb-6">
              Novos vendedores são cadastrados regularmente.
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

        {!loading && !error && sellers.length > 0 && (
          <>
            {/* Info Banner */}
            <div className="bg-primary text-white rounded-xl p-8 mb-10 shadow-lg">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">🏪 Apoie o Comércio Local</h3>
                  <p className="text-white/90">
                    Todos os vendedores são verificados e oferecem produtos de qualidade.
                  </p>
                </div>
                <Store className="w-16 h-16 opacity-20 hidden md:block" />
              </div>
            </div>

            {/* Sellers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sellers.map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))}
            </div>

            {/* Bottom Info */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-dark mb-3">
                  💡 Quer se tornar um vendedor?
                </h3>
                <p className="text-light-gray mb-6">
                  Cadastre seu negócio e comece a vender para clientes da sua região.
                </p>
                <Link
                  to="/for-sellers"
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                >
                  Seja um Vendedor
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
