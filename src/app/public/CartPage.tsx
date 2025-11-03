/**
 * CartPage - Shopping cart page
 */

import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../features/cart/components/CartItem';
import { formatCurrency } from '../../lib/formatters';
import Button from '../../components/ui/Button';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom px-4 md:px-6 py-20">
          <Link
            to="/"
            className="text-primary hover:underline inline-flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para home
          </Link>

          <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-dark mb-3">Seu carrinho está vazio</h1>
            <p className="text-light-gray mb-8">
              Adicione produtos ao carrinho para continuar comprando
            </p>
            <Link to="/">
              <Button>Explorar Produtos</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            Continuar comprando
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-dark mb-2">Meu Carrinho</h1>
              <p className="text-light-gray">
                {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'itens'} no carrinho
              </p>
            </div>

            {cart.items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span className="hidden md:inline">Limpar carrinho</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-dark mb-6">Resumo do Pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-light-gray">
                  <span>Subtotal ({cart.totalItems} itens)</span>
                  <span>{formatCurrency(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-light-gray">
                  <span>Entrega</span>
                  <span className="text-primary font-semibold">A calcular</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-dark">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(cart.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full mb-3"
                onClick={() => navigate('/checkout')}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Finalizar Pedido
              </Button>

              <Link to="/">
                <Button variant="outline" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>

              {/* Info */}
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-dark font-semibold mb-2">
                  💡 Economize com assinaturas!
                </p>
                <p className="text-xs text-light-gray">
                  Assine produtos recorrentes e ganhe descontos exclusivos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
