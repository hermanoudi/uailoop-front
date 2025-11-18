import { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, Clock, RefreshCw, ShoppingBag, Repeat } from 'lucide-react';
import { deliveryService } from '../../services/deliveryService';
import type { DeliveryItem } from '../../services/deliveryService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function SellerDeliveriesPage() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysAhead, setDaysAhead] = useState(7);

  useEffect(() => {
    if (user) {
      if (user.seller_id) {
        loadDeliveries();
      } else {
        // User is not a seller
        setLoading(false);
        toast.error('Você precisa ser um vendedor para acessar esta página');
      }
    }
  }, [user, daysAhead]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const data = await deliveryService.getUpcoming(daysAhead);
      setDeliveries(data);
    } catch (error: any) {
      toast.error('Erro ao carregar entregas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Group deliveries by date
  const groupedDeliveries = deliveries.reduce((groups, delivery) => {
    const date = new Date(delivery.delivery_date).toLocaleDateString('pt-BR');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(delivery);
    return groups;
  }, {} as Record<string, DeliveryItem[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedDeliveries).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('-'));
    const dateB = new Date(b.split('/').reverse().join('-'));
    return dateA.getTime() - dateB.getTime();
  });

  const getTypeIcon = (type: string) => {
    if (type === 'subscription') {
      return <Repeat className="w-5 h-5 text-purple-600" />;
    }
    return <ShoppingBag className="w-5 h-5 text-blue-600" />;
  };

  const getTypeLabel = (type: string) => {
    if (type === 'subscription') {
      return 'Assinatura';
    }
    return 'Pedido';
  };

  const getTypeBadgeColor = (type: string) => {
    if (type === 'subscription') {
      return 'bg-purple-100 text-purple-700';
    }
    return 'bg-blue-100 text-blue-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Próximas Entregas
            </h1>
            <button
              onClick={loadDeliveries}
              className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
          </div>

          {/* Filter by days */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Mostrar entregas dos próximos:
            </span>
            <div className="flex gap-2">
              {[3, 7, 14, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setDaysAhead(days)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    daysAhead === days
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {days} dias
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total de Entregas</p>
                  <p className="text-2xl font-bold text-blue-900">{deliveries.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Pedidos</p>
                  <p className="text-2xl font-bold text-green-900">
                    {deliveries.filter(d => d.type === 'order').length}
                  </p>
                </div>
                <ShoppingBag className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Assinaturas</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {deliveries.filter(d => d.type === 'subscription').length}
                  </p>
                </div>
                <Repeat className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="container-custom px-4 py-8">
        {deliveries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma entrega programada
            </h3>
            <p className="text-gray-500">
              As entregas aparecerão aqui quando houver pedidos ou assinaturas ativas
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((date) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">{date}</h2>
                  <span className="text-sm text-gray-500">
                    ({groupedDeliveries[date].length} {groupedDeliveries[date].length === 1 ? 'entrega' : 'entregas'})
                  </span>
                </div>

                {/* Deliveries for this date */}
                <div className="space-y-4">
                  {groupedDeliveries[date].map((delivery) => (
                    <div
                      key={`${delivery.type}-${delivery.id}`}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getTypeIcon(delivery.type)}
                            <h3 className="text-lg font-semibold text-gray-900">
                              {getTypeLabel(delivery.type)} #{delivery.id}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(delivery.type)}`}>
                              {getTypeLabel(delivery.type)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p className="mb-1">Cliente: {delivery.customer_name}</p>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(delivery.delivery_date).toLocaleString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            R$ {delivery.total_amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {delivery.payment_method}
                          </div>
                        </div>
                      </div>

                      {/* Products */}
                      <div className="mb-4 bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Produtos:
                        </h4>
                        <div className="space-y-1">
                          {delivery.products.map((product, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-600">
                              <span>
                                {product.quantity}x {product.product_name}
                              </span>
                              <span>R$ {product.subtotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Endereço de Entrega:
                        </h4>
                        <p className="text-sm text-blue-800">
                          {delivery.delivery_address.street}, {delivery.delivery_address.number}
                          {delivery.delivery_address.complement && ` - ${delivery.delivery_address.complement}`}
                          <br />
                          {delivery.delivery_address.neighborhood}, {delivery.delivery_address.city} - {delivery.delivery_address.state}
                          <br />
                          CEP: {delivery.delivery_address.cep}
                        </p>
                      </div>

                      {delivery.notes && (
                        <div className="mt-4 text-sm text-gray-600 italic">
                          Obs: {delivery.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
