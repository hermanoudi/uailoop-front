/**
 * OrderDetailPage - View order details
 */

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, CreditCard, User, Phone, Package, FileText } from 'lucide-react';
import { useOrder } from '../../features/orders/hooks/useOrder';
import OrderStatusBadge from '../../features/orders/components/OrderStatusBadge';
import { OrderStatusTimeline } from '../../features/orders/components/OrderStatusTimeline';
import { formatCurrency } from '../../lib/formatters';
import Loading from '../../components/ui/Loading';

const paymentMethodLabels: Record<string, string> = {
  money: 'Dinheiro',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  pix: 'PIX',
  online: 'Online',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || '0');
  const { data: order, isLoading, error } = useOrder(orderId);

  console.log('OrderDetailPage - orderId:', orderId);
  console.log('OrderDetailPage - isLoading:', isLoading);
  console.log('OrderDetailPage - error:', error);
  console.log('OrderDetailPage - order:', order);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Loading />
      </div>
    );
  }

  if (error) {
    console.error('Error loading order:', error);
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar pedido</h2>
        <p className="text-gray-600 mb-4">
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
        <pre className="text-xs text-left bg-gray-100 p-4 rounded mb-4 overflow-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
        <Link to="/orders" className="text-primary hover:underline">
          Ver meus pedidos
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido não encontrado</h2>
        <p className="text-gray-600 mb-6">
          O pedido #{orderId} não existe ou você não tem permissão para visualizá-lo.
        </p>
        <Link to="/orders" className="text-primary hover:underline">
          Ver meus pedidos
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/orders"
        className="text-primary hover:underline inline-flex items-center gap-2 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para meus pedidos
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pedido #{order.id}</h1>
          <p className="text-gray-600 flex items-center gap-2 mt-2">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="md:col-span-2 space-y-6">
          {/* Items List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Itens do Pedido
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b last:border-b-0 pb-4 last:pb-0"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.product_unit} × {formatCurrency(item.unit_price)}
                    </p>
                    {item.was_on_offer && item.original_price && (
                      <p className="text-sm text-green-600">
                        Economia: {formatCurrency(item.original_price - item.unit_price)} por {item.product_unit}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{formatCurrency(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <OrderStatusTimeline orderId={order.id} />
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Endereço de Entrega
            </h2>
            <div className="text-gray-700 space-y-1">
              <p>{order.delivery_address}, {order.delivery_number}</p>
              <p>
                {order.delivery_city} - {order.delivery_state}
              </p>
              <p>CEP: {order.delivery_zipcode}</p>
              {order.delivery_instructions && (
                <p className="mt-3 text-sm text-gray-600">
                  <strong>Instruções:</strong> {order.delivery_instructions}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          {(order.notes || order.seller_notes) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Observações
              </h2>
              {order.notes && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700">Suas observações:</p>
                  <p className="text-gray-600">{order.notes}</p>
                </div>
              )}
              {order.seller_notes && (
                <div>
                  <p className="text-sm font-semibold text-gray-700">Observações do vendedor:</p>
                  <p className="text-gray-600">{order.seller_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(order.total_amount - order.delivery_fee)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxa de entrega</span>
                <span className="font-semibold">{formatCurrency(order.delivery_fee)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCard className="w-4 h-4" />
                <span>{paymentMethodLabels[order.payment_method] || order.payment_method}</span>
              </div>
              <div className="text-sm">
                <span className={`font-semibold ${
                  order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {order.payment_status === 'paid' ? 'Pago' : 'Pagamento pendente'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Dados do Cliente
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <strong>Nome:</strong> {order.customer_name}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {order.customer_phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
