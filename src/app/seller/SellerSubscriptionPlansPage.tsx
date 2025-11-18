import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, RefreshCw, Calendar } from 'lucide-react';
import { subscriptionPlanService } from '../../services/subscriptionService';
import type { SubscriptionPlan, SubscriptionFrequency } from '../../types';
import { SubscriptionFrequencyLabels } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatBRL } from '../../utils/format';

export default function SellerSubscriptionPlansPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.seller_id) {
        loadPlans();
      } else {
        setLoading(false);
        toast.error('Você precisa ser um vendedor para acessar esta página');
      }
    }
  }, [user]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await subscriptionPlanService.list(false); // Load all plans including inactive
      setPlans(data);
    } catch (error: any) {
      toast.error('Erro ao carregar planos de assinatura');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId: number) => {
    if (!confirm('Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await subscriptionPlanService.delete(planId);
      toast.success('Plano excluído com sucesso');
      loadPlans();
    } catch (error: any) {
      toast.error('Erro ao excluir plano');
      console.error(error);
    }
  };

  const handleToggleActive = async (plan: SubscriptionPlan) => {
    try {
      await subscriptionPlanService.update(plan.id, {
        is_active: !plan.is_active,
      });
      toast.success(`Plano ${plan.is_active ? 'desativado' : 'ativado'} com sucesso`);
      loadPlans();
    } catch (error: any) {
      toast.error('Erro ao atualizar plano');
      console.error(error);
    }
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
              Meus Planos de Assinatura
            </h1>
            <div className="flex gap-3">
              <button
                onClick={loadPlans}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
              <button
                onClick={() => navigate('/seller/subscription-plans/create')}
                className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                <Plus className="w-4 h-4" />
                Criar Novo Plano
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total de Planos</p>
                  <p className="text-2xl font-bold text-blue-900">{plans.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Planos Ativos</p>
                  <p className="text-2xl font-bold text-green-900">
                    {plans.filter(p => p.is_active).length}
                  </p>
                </div>
                <RefreshCw className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Planos Inativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plans.filter(p => !p.is_active).length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div className="container-custom px-4 py-8">
        {plans.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum plano de assinatura cadastrado
            </h3>
            <p className="text-gray-500 mb-6">
              Crie seu primeiro plano de assinatura para permitir que clientes assinem seus produtos
            </p>
            <button
              onClick={() => navigate('/seller/subscription-plans/create')}
              className="inline-flex items-center gap-2 bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Criar Primeiro Plano
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${
                  !plan.is_active ? 'opacity-60' : ''
                }`}
              >
                {/* Plan Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    {plan.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {plan.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      plan.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {plan.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                {/* Frequency */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Entrega {SubscriptionFrequencyLabels[plan.frequency]}</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-green-600">
                    R$ {formatBRL(plan.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    /{plan.frequency === 'daily' ? 'dia' : plan.frequency === 'weekly' ? 'semana' : plan.frequency === 'biweekly' ? 'quinzena' : 'mês'}
                  </div>
                  {plan.delivery_fee && plan.delivery_fee > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      + R$ {formatBRL(plan.delivery_fee)} de entrega
                    </div>
                  )}
                  {plan.discount_percentage && plan.discount_percentage > 0 && (
                    <div className="text-xs text-green-600 mt-1">
                      {plan.discount_percentage}% de desconto
                    </div>
                  )}
                </div>

                {/* Products */}
                <div className="mb-4 bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Produtos ({plan.products.length}):
                  </h4>
                  <div className="space-y-1">
                    {plan.products.slice(0, 3).map((product, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        • {product.quantity}x produto ID: {product.product_id}
                      </div>
                    ))}
                    {plan.products.length > 3 && (
                      <div className="text-xs text-gray-500">
                        + {plan.products.length - 3} produtos
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/seller/subscription-plans/edit/${plan.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(plan)}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      plan.is_active
                        ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {plan.is_active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
