import { useState, useEffect } from 'react';
import { Calendar, Package, User, AlertCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import type {
  Subscription,
  SubscriptionStatus,
} from '../../types';
import {
  SubscriptionStatusLabels,
  SubscriptionStatusColors,
  SubscriptionFrequencyLabels,
} from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function SellerSubscriptionsPage() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus | 'all'>('all');

  useEffect(() => {
    if (user) {
      if (user.seller_id) {
        loadSubscriptions();
      } else {
        // User is not a seller
        setLoading(false);
        toast.error('Você precisa ser um vendedor para acessar esta página');
      }
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      // Use seller-specific endpoint
      const data = await subscriptionService.listForSeller();
      setSubscriptions(data);
    } catch (error: any) {
      toast.error('Erro ao carregar assinaturas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = selectedStatus === 'all'
    ? subscriptions
    : subscriptions.filter((sub) => sub.status === selectedStatus);

  // Statistics
  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === SubscriptionStatus.ACTIVE).length,
    paused: subscriptions.filter(s => s.status === SubscriptionStatus.PAUSED).length,
    revenue: subscriptions
      .filter(s => s.status === SubscriptionStatus.ACTIVE)
      .reduce((sum, s) => sum + s.total_amount, 0),
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Assinaturas dos Clientes
          </h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Ativas</p>
                  <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                </div>
                <RefreshCw className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Pausadas</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.paused}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Receita Mensal</p>
                  <p className="text-2xl font-bold text-purple-900">
                    R$ {stats.revenue.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {Object.entries(SubscriptionStatusLabels).map(([status, label]) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as SubscriptionStatus)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="container-custom px-4 py-8">
        {filteredSubscriptions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {selectedStatus === 'all'
                ? 'Nenhuma assinatura encontrada'
                : `Nenhuma assinatura ${SubscriptionStatusLabels[selectedStatus as SubscriptionStatus].toLowerCase()}`}
            </h3>
            <p className="text-gray-500">
              As assinaturas dos seus clientes aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSubscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-gray-500" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        Cliente ID: {subscription.customer_id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          SubscriptionStatusColors[subscription.status]
                        }`}
                      >
                        {SubscriptionStatusLabels[subscription.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Entrega {SubscriptionFrequencyLabels[subscription.frequency]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>
                          Assinatura #{subscription.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {subscription.total_amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      /{subscription.frequency === 'daily' ? 'dia' : subscription.frequency === 'weekly' ? 'semana' : subscription.frequency === 'biweekly' ? 'quinzena' : 'mês'}
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Produtos:</h4>
                  <div className="space-y-1">
                    {subscription.products.map((product, index) => (
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
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Endereço de Entrega:</h4>
                  <p className="text-sm text-gray-600">
                    {subscription.delivery_address.street}, {subscription.delivery_address.number}
                    {subscription.delivery_address.complement && ` - ${subscription.delivery_address.complement}`}
                    <br />
                    {subscription.delivery_address.neighborhood}, {subscription.delivery_address.city} - {subscription.delivery_address.state}
                    <br />
                    CEP: {subscription.delivery_address.cep}
                  </p>
                </div>

                {/* Next Billing */}
                {subscription.status === SubscriptionStatus.ACTIVE && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <RefreshCw className="w-4 h-4" />
                      <span>
                        Próxima entrega:{' '}
                        {new Date(subscription.next_billing_date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {subscription.status === SubscriptionStatus.PAUSED && subscription.paused_at && (
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-yellow-800">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Pausada em:{' '}
                        {new Date(subscription.paused_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
