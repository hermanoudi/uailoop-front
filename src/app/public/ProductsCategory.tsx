/**
 * ProductsCategory - Page to display products by category
 */

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useProducts } from '../../features/products/hooks/useProducts';
import ProductCard from '../../features/products/components/ProductCard';
import Loading from '../../components/ui/Loading';
import type { ProductCategory } from '../../types/product';

const categoryInfo: Record<string, { title: string; icon: string; description: string }> = {
  acougues: {
    title: 'Açougues',
    icon: '🥩',
    description: 'Carnes frescas e de qualidade premium',
  },
  padarias: {
    title: 'Padarias',
    icon: '🥖',
    description: 'Pães quentinhos e produtos de padaria frescos',
  },
  limpeza: {
    title: 'Produtos de Limpeza',
    icon: '🧹',
    description: 'Produtos essenciais para a limpeza da sua casa',
  },
  hortifruti: {
    title: 'Hortifruti',
    icon: '🥬',
    description: 'Frutas e verduras frescas',
  },
  bebidas: {
    title: 'Bebidas',
    icon: '🥤',
    description: 'Bebidas para todas as ocasiões',
  },
  pet: {
    title: 'Pet Shop',
    icon: '🐾',
    description: 'Produtos para seu pet',
  },
  outros: {
    title: 'Outros',
    icon: '📦',
    description: 'Diversos produtos',
  },
};

export default function ProductsCategory() {
  const { category } = useParams<{ category: string }>();

  // Buscar produtos da categoria
  const { products, loading, error, total } = useProducts({
    category: category as ProductCategory,
    size: 50,
  });

  const info = category ? categoryInfo[category] : null;

  if (!info) {
    return (
      <div className="container-custom py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark mb-4">Categoria não encontrada</h1>
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
            <span className="text-6xl">{info.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-dark mb-2">{info.title}</h1>
              <p className="text-xl text-light-gray">{info.description}</p>
            </div>
          </div>
          {!loading && (
            <p className="mt-4 text-light-gray">
              {total} {total === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        {loading && (
          <Loading size="lg" text="Carregando produtos..." />
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold mb-2">Erro ao carregar produtos</p>
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">{info.icon}</span>
            <h2 className="text-2xl font-bold text-dark mb-2">
              Nenhum produto encontrado
            </h2>
            <p className="text-light-gray mb-6">
              Ainda não há produtos cadastrados nesta categoria.
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
