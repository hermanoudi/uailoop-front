import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, PlayCircle, PauseCircle, XCircle, RefreshCw, Plus } from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import type {
  Subscription,
  SubscriptionStatus,
} from '../types';
import {
  SubscriptionStatusLabels,
  SubscriptionStatusColors,
  SubscriptionFrequencyLabels,
} from '../types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function MySubscriptionsPage() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus | 'all'>('all');

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.list();
      setSubscriptions(data);
    } catch (error: any) {
      toast.error('Erro ao carregar assinaturas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async (subscriptionId: number) => {
    if (!confirm('Deseja realmente pausar esta assinatura?')) return;

    try {
      await subscriptionService.pause(subscriptionId);
      toast.success('Assinatura pausada com sucesso');
      loadSubscriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao pausar assinatura');
    }
  };

  const handleResume = async (subscriptionId: number) => {
    try {
      await subscriptionService.resume(subscriptionId);
      toast.success('Assinatura reativada com sucesso');
      loadSubscriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao reativar assinatura');
    }
  };

  const handleCancel = async (subscriptionId: number) => {
    if (!confirm('Deseja realmente cancelar esta assinatura? Esta ação não pode ser desfeita.')) return;

    try {
      await subscriptionService.cancel(subscriptionId);
      toast.success('Assinatura cancelada');
      loadSubscriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao cancelar assinatura');
    }
  };

  const filteredSubscriptions = selectedStatus === 'all'
    ? subscriptions
    : subscriptions.filter((sub) => sub.status === selectedStatus);

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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Minhas Assinaturas</h1>
            <Link
              to="/subscription-plans"
              className="inline-flex items-center gap-2 bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Nova Assinatura
            </Link>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 mt-6 flex-wrap">
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
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {selectedStatus === 'all'
                ? 'Nenhuma assinatura encontrada'
                : `Nenhuma assinatura ${SubscriptionStatusLabels[selectedStatus as SubscriptionStatus].toLowerCase()}`}
            </h3>
            <p className="text-gray-500 mb-6">
              Assine um plano para receber produtos regularmente
            </p>
            <Link
              to="/subscription-plans"
              className="inline-flex items-center gap-2 bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Explorar Planos
            </Link>
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
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Assinatura #{subscription.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          SubscriptionStatusColors[subscription.status]
                        }`}
                      >
                        {SubscriptionStatusLabels[subscription.status]}
                      </span>
                    </div>
                    {/* Frequency Badge - More Prominent */}
                    <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800 text-sm">
                        Entrega {SubscriptionFrequencyLabels[subscription.frequency]}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {subscription.total_amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      /{subscription.frequency === 'weekly' ? 'semana' : subscription.frequency === 'biweekly' ? 'quinzena' : 'mês'}
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-4">
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

                {/* Next Billing */}
                {subscription.status === SubscriptionStatus.ACTIVE && (
                  <div className="bg-green-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <RefreshCw className="w-4 h-4" />
                      <span>
                        Próxima cobrança:{' '}
                        {new Date(subscription.next_billing_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {subscription.status === SubscriptionStatus.ACTIVE && (
                    <>
                      <button
                        onClick={() => handlePause(subscription.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
                      >
                        <PauseCircle className="w-4 h-4" />
                        Pausar
                      </button>
                      <button
                        onClick={() => handleCancel(subscription.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancelar
                      </button>
                    </>
                  )}

                  {subscription.status === SubscriptionStatus.PAUSED && (
                    <>
                      <button
                        onClick={() => handleResume(subscription.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Reativar
                      </button>
                      <button
                        onClick={() => handleCancel(subscription.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
