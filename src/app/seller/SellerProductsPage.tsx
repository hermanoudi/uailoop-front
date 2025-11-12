import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, Eye, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import type { Product } from '../../types/product';
import ProductEditModal from '../../features/products/components/ProductEditModal';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get('/products/my-products', {
        params: {
          limit: 100,
        },
      });

      setProducts(response.data || []);
      setFilteredProducts(response.data || []);
    } catch (err: any) {
      console.error('Erro ao carregar produtos:', err);
      setError('Erro ao carregar produtos. Tente novamente.');
      toast.error('Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(
        (product) => product.is_available === (availabilityFilter === 'available')
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, availabilityFilter, products]);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      await loadProducts();
      toast.success('Produto excluído com sucesso!');
    } catch (err: any) {
      console.error('Erro ao excluir produto:', err);
      toast.error('Erro ao excluir produto. Tente novamente.');
    }
  };

  const handleModalSuccess = () => {
    loadProducts();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-uai"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Produtos</h1>
              <p className="text-gray-600 mt-1">
                Visualize, edite e gerencie seus produtos
              </p>
            </div>
            <Link
              to="/seller/products/new"
              className="flex items-center justify-center gap-2 bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg font-semibold"
            >
              <Plus className="w-5 h-5" />
              Novo Produto
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {/* Botão Novo Produto - Destacado */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <Link
              to="/seller/products/new"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-black px-8 py-3 rounded-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              <Plus className="w-6 h-6" />
              Cadastrar Novo Produto
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent appearance-none"
              >
                <option value="all">Todas as categorias</option>
                <option value="acougues">Açougues</option>
                <option value="padarias">Padarias</option>
                <option value="hortifruti">Hortifruti</option>
                <option value="limpeza">Limpeza</option>
                <option value="bebidas">Bebidas</option>
                <option value="pet">Pet Shop</option>
                <option value="diversos">Diversos</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="available">Disponíveis</option>
                <option value="unavailable">Indisponíveis</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Exibindo {filteredProducts.length} de {products.length} produto(s)
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {products.length === 0
                ? 'Nenhum produto cadastrado'
                : 'Nenhum produto encontrado'}
            </h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0
                ? 'Comece cadastrando seu primeiro produto para começar a vender'
                : 'Tente ajustar os filtros de busca'}
            </p>
            {products.length === 0 && (
              <Link
                to="/seller/products/new"
                className="inline-flex items-center gap-2 bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg font-semibold"
              >
                <Plus className="w-5 h-5" />
                Cadastrar Primeiro Produto
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-200">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.is_available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-green-uai">
                        R$ {Number(product.price).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Estoque</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {product.stock_quantity !== null
                          ? Number(product.stock_quantity).toFixed(0)
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* SKU Display */}
                  {product.sku && (
                    <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Código SKU</p>
                      <p className="text-sm font-mono font-semibold text-gray-900">
                        {product.sku}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Visualizar produto"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>

                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex items-center justify-center px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                      title="Editar produto"
                    >
                      <Edit className="w-4 h-4 text-green-600" />
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex items-center justify-center px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      title="Excluir produto"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedProduct && (
        <ProductEditModal
          product={selectedProduct}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
