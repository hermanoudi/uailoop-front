/**
 * SearchProducts - Page to display search results
 */

import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { useProducts } from '../../features/products/hooks/useProducts';
import ProductCard from '../../features/products/components/ProductCard';
import Loading from '../../components/ui/Loading';

export default function SearchProducts() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Fetch products with search query
  const { products, loading, error, total } = useProducts({
    search: query,
    size: 50,
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-custom py-8">
          <Link
            to="/"
            className="text-primary hover:underline inline-flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-4">
            <SearchIcon className="w-12 h-12 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-dark mb-2">
                Resultados da busca
              </h1>
              {query && (
                <p className="text-xl text-light-gray">
                  Buscando por: <span className="font-semibold text-dark">"{query}"</span>
                </p>
              )}
            </div>
          </div>
          {!loading && (
            <div className="mt-4">
              <p className="text-light-gray">
                {total} {total === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        {loading && (
          <Loading size="lg" text="Buscando produtos..." />
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold mb-2">Erro ao buscar produtos</p>
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && !query && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <SearchIcon className="w-16 h-16 text-light-gray mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-dark mb-2">
              Digite algo para buscar
            </h2>
            <p className="text-light-gray mb-6">
              Use a barra de busca acima para encontrar produtos
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

        {!loading && !error && query && products.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <SearchIcon className="w-16 h-16 text-light-gray mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-dark mb-2">
              Nenhum produto encontrado
            </h2>
            <p className="text-light-gray mb-2">
              Não encontramos produtos para: <span className="font-semibold text-dark">"{query}"</span>
            </p>
            <p className="text-light-gray mb-6">
              Tente buscar com outras palavras-chave
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

        {!loading && !error && products.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
