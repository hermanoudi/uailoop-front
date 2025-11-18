import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Package, Clock, TrendingDown, ShoppingCart } from 'lucide-react';
import { subscriptionPlanService } from '../services/subscriptionService';
import type { SubscriptionPlan } from '../types';
import { SubscriptionFrequencyLabels } from '../types';
import toast from 'react-hot-toast';
import { formatBRL } from '../utils/format';

export default function SubscriptionPlansPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('seller_id');

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, [sellerId]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await subscriptionPlanService.listPublic(
        sellerId ? Number(sellerId) : undefined
      );
      setPlans(data);
    } catch (error: any) {
      toast.error('Erro ao carregar planos de assinatura');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (planId: number) => {
    // Redirect to checkout/subscription page with plan selected
    navigate(`/subscribe/${planId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-12">
        <div className="container-custom px-4">
          <h1 className="text-4xl font-bold mb-4">Planos de Assinatura</h1>
          <p className="text-lg text-green-50">
            Receba seus produtos favoritos regularmente com economia e praticidade
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="container-custom px-4 py-12">
        {plans.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum plano disponível
            </h3>
            <p className="text-gray-500">
              Ainda não há planos de assinatura cadastrados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Plan Image */}
                {plan.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={plan.image_url}
                      alt={plan.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>

                  {/* Seller Info */}
                  {plan.seller_name && (
                    <p className="text-sm text-gray-600 mb-3">
                      Vendido e entregue por <span className="font-medium text-gray-900">{plan.seller_name}</span>
                    </p>
                  )}

                  {/* Available Frequencies */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        Frequências disponíveis:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plan.available_frequencies.map((freq) => (
                        <span
                          key={freq}
                          className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
                        >
                          {SubscriptionFrequencyLabels[freq]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  {plan.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {plan.description}
                    </p>
                  )}

                  {/* Products Count */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Package className="w-4 h-4" />
                    <span>{plan.products.length} produto(s) incluído(s)</span>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        R$ {formatBRL(Number(plan.price))}
                      </span>
                    </div>

                    {plan.discount_percentage && plan.discount_percentage > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingDown className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          {plan.discount_percentage}% de desconto
                        </span>
                      </div>
                    )}

                    {plan.delivery_fee !== null && plan.delivery_fee !== undefined && (
                      <p className="text-sm text-gray-500 mt-2">
                        + R$ {formatBRL(Number(plan.delivery_fee))} de entrega
                      </p>
                    )}
                  </div>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className="w-full bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Assinar Agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="container-custom px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Vantagens das Assinaturas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Praticidade</h3>
              <p className="text-gray-600">
                Receba seus produtos regularmente sem precisar fazer novos pedidos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Economia</h3>
              <p className="text-gray-600">
                Descontos exclusivos em planos de assinatura
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexibilidade</h3>
              <p className="text-gray-600">
                Pause, cancele ou altere sua assinatura quando quiser
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
