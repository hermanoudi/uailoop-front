import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, CreditCard, Calendar, Check } from 'lucide-react';
import { subscriptionPlanService, subscriptionService } from '../services/subscriptionService';
import type { SubscriptionPlan, SubscriptionFrequency } from '../types';
import { SubscriptionFrequencyLabels } from '../types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { formatBRL } from '../utils/format';

export default function SubscribePage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedFrequency, setSelectedFrequency] = useState<SubscriptionFrequency | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [deliveryAddress, setDeliveryAddress] = useState({
    cep: user?.cep || '',
    street: user?.street || '',
    number: user?.number || '',
    complement: user?.complement || '',
    neighborhood: user?.neighborhood || '',
    city: user?.city || '',
    state: user?.state || '',
  });

  useEffect(() => {
    if (!user) {
      toast.error('Faça login para assinar um plano');
      navigate('/login');
      return;
    }

    if (planId) {
      loadPlan();
    }
  }, [planId, user]);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const data = await subscriptionPlanService.getPublic(Number(planId));
      setPlan(data);
      // Set first available frequency as default
      if (data.available_frequencies && data.available_frequencies.length > 0) {
        setSelectedFrequency(data.available_frequencies[0]);
      }
    } catch (error: any) {
      toast.error('Plano não encontrado');
      navigate('/subscription-plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plan) return;

    // Validation
    if (!selectedFrequency) {
      toast.error('Selecione uma frequência de entrega');
      return;
    }

    if (!deliveryAddress.cep || !deliveryAddress.street || !deliveryAddress.number) {
      toast.error('Preencha todos os campos obrigatórios do endereço');
      return;
    }

    try {
      setSubmitting(true);

      await subscriptionService.createFromPlan(
        plan.id,
        deliveryAddress,
        paymentMethod
      );

      toast.success('Assinatura criada com sucesso!');
      navigate('/my-subscriptions');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao criar assinatura');
      console.error(error);
    } finally {
      setSubmitting(false);
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

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Finalizar Assinatura
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold">Endereço de Entrega</h2>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.cep}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, cep: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rua *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.number}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.complement || ''}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, complement: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.neighborhood}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      maxLength={2}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold">Forma de Pagamento</h2>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'pix', label: 'PIX' },
                  { value: 'credit_card', label: 'Cartão de Crédito' },
                  { value: 'debit_card', label: 'Cartão de Débito' },
                  { value: 'money', label: 'Dinheiro' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumo</h2>

              {/* Plan Info */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">{plan.name}</h3>

                {/* Frequency Selection */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência de Entrega *
                  </label>
                  <div className="space-y-2">
                    {plan.available_frequencies.map((freq) => (
                      <label
                        key={freq}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedFrequency === freq
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="frequency"
                          value={freq}
                          checked={selectedFrequency === freq}
                          onChange={() => setSelectedFrequency(freq)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-900">
                            {SubscriptionFrequencyLabels[freq]}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Discount Badge - More Prominent */}
                {plan.discount_percentage && plan.discount_percentage > 0 && (
                  <div className="bg-yellow-50 rounded-lg px-3 py-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        {plan.discount_percentage}% de Desconto Aplicado
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>{plan.products.length} produto(s)</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {formatBRL(Number(plan.price))}</span>
                </div>

                {plan.delivery_fee !== null && plan.delivery_fee !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxa de entrega</span>
                    <span className="font-medium">R$ {formatBRL(Number(plan.delivery_fee))}</span>
                  </div>
                )}

                {plan.discount_percentage && plan.discount_percentage > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto ({Number(plan.discount_percentage)}%)</span>
                    <span>-R$ {formatBRL((Number(plan.price) * Number(plan.discount_percentage)) / 100)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-green-600">
                    R$ {formatBRL(
                      Number(plan.price) -
                      (plan.discount_percentage ? (Number(plan.price) * Number(plan.discount_percentage)) / 100 : 0) +
                      (Number(plan.delivery_fee) || 0)
                    )}
                  </span>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2 text-sm text-green-800 mb-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Renovação automática</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-green-800 mb-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Cancele quando quiser</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-green-800">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Pause sua assinatura a qualquer momento</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Processando...' : 'Confirmar Assinatura'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
