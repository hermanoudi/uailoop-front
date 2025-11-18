/**
 * Checkout Page - Finalize order
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ShoppingBag, CreditCard, MapPin, User, Repeat, Check } from 'lucide-react';

import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../features/orders/services/order.service';
import { subscriptionService } from '../../services/subscriptionService';
import type { OrderCreate, PaymentMethod } from '../../types/order';
import type { SubscriptionCreate, DeliveryAddress } from '../../types/subscription';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { formatCurrency } from '../../lib/formatters';

const checkoutSchema = z.object({
  customer_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  customer_phone: z.string().min(10, 'Telefone inválido'),
  delivery_address: z.string().min(5, 'Endereço deve ter no mínimo 5 caracteres'),
  delivery_number: z.string().min(1, 'Número é obrigatório'),
  delivery_city: z.string().min(2, 'Cidade inválida'),
  delivery_state: z.string().length(2, 'Estado deve ter 2 caracteres (ex: MG)'),
  delivery_zipcode: z.string().min(8, 'CEP inválido'),
  delivery_instructions: z.string().optional(),
  payment_method: z.enum(['money', 'credit_card', 'debit_card', 'pix', 'online']),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: user?.full_name || '',
      customer_phone: user?.phone || '',
      delivery_city: user?.city || '',
      delivery_state: user?.state || '',
      delivery_zipcode: user?.cep || '',
      delivery_address: user?.street || '',
      delivery_number: user?.number || '',
      payment_method: 'pix',
    },
  });

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Carrinho Vazio</h2>
        <p className="text-gray-600 mb-6">
          Adicione produtos ao carrinho antes de finalizar o pedido.
        </p>
        <Button onClick={() => navigate('/products')}>
          Ver Produtos
        </Button>
      </div>
    );
  }

  // Get seller_id from first item (assuming all items are from same seller)
  const sellerId = cart.items[0].product.seller_id;

  // Calculate totals with subscription discount
  const calculatedTotals = useMemo(() => {
    let subtotal = 0;
    let subscriptionDiscount = 0;

    cart.items.forEach(item => {
      subtotal += item.subtotal;
      if (item.isSubscription) {
        // Apply 10% discount for subscription items
        subscriptionDiscount += item.subtotal * 0.1;
      }
    });

    const total = subtotal - subscriptionDiscount;

    return { subtotal, subscriptionDiscount, total };
  }, [cart.items]);

  // Check if cart has any subscription items
  const hasSubscriptions = cart.items.some(item => item.isSubscription);

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      toast.error('Você precisa estar logado para finalizar o pedido');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order first
      const orderData: OrderCreate = {
        seller_id: sellerId,
        items: cart.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        payment_method: data.payment_method as PaymentMethod,
        delivery_address: data.delivery_address,
        delivery_number: data.delivery_number,
        delivery_city: data.delivery_city,
        delivery_state: data.delivery_state.toUpperCase(),
        delivery_zipcode: data.delivery_zipcode.replace(/\D/g, ''),
        delivery_instructions: data.delivery_instructions || undefined,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone.replace(/\D/g, ''),
        notes: data.notes || undefined,
      };

      const order = await orderService.createOrder(orderData);

      // Create subscriptions for items marked as subscription
      const subscriptionItems = cart.items.filter(item => item.isSubscription);

      if (subscriptionItems.length > 0) {
        // Group by frequency (each frequency becomes a separate subscription)
        const subscriptionsByFrequency = subscriptionItems.reduce((acc, item) => {
          const freq = item.subscriptionFrequency!;
          if (!acc[freq]) {
            acc[freq] = [];
          }
          acc[freq].push(item);
          return acc;
        }, {} as Record<string, typeof subscriptionItems>);

        // Create a subscription for each frequency group
        for (const [frequency, items] of Object.entries(subscriptionsByFrequency)) {
          const deliveryAddressData: DeliveryAddress = {
            cep: data.delivery_zipcode.replace(/\D/g, ''),
            street: data.delivery_address,
            number: data.delivery_number,
            complement: data.delivery_instructions || undefined,
            neighborhood: '', // Could be added to form if needed
            city: data.delivery_city,
            state: data.delivery_state.toUpperCase(),
          };

          const subscriptionData: SubscriptionCreate = {
            seller_id: sellerId,
            source_order_id: order.id,
            frequency: frequency as any,
            products: items.map(item => ({
              product_id: item.product.id,
              quantity: item.quantity,
              price: Number(item.product.price),
            })),
            delivery_address: deliveryAddressData,
            payment_method: data.payment_method,
          };

          await subscriptionService.create(subscriptionData);
        }

        toast.success('Pedido e assinatura(s) criada(s) com sucesso!');
      } else {
        toast.success('Pedido realizado com sucesso!');
      }

      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.detail || 'Erro ao finalizar pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Pedido</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações do Cliente
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  {...register('customer_name')}
                  error={errors.customer_name?.message}
                />
                <Input
                  label="Telefone"
                  {...register('customer_phone')}
                  placeholder="(31) 99999-9999"
                  error={errors.customer_phone?.message}
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Endereço de Entrega
              </h2>
              <div className="space-y-4">
                <Input
                  label="CEP"
                  {...register('delivery_zipcode')}
                  placeholder="30140-001"
                  error={errors.delivery_zipcode?.message}
                />
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <Input
                      label="Endereço"
                      {...register('delivery_address')}
                      placeholder="Rua, avenida..."
                      error={errors.delivery_address?.message}
                    />
                  </div>
                  <Input
                    label="Número"
                    {...register('delivery_number')}
                    placeholder="123"
                    error={errors.delivery_number?.message}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Cidade"
                      {...register('delivery_city')}
                      error={errors.delivery_city?.message}
                    />
                  </div>
                  <Input
                    label="Estado"
                    {...register('delivery_state')}
                    placeholder="MG"
                    maxLength={2}
                    error={errors.delivery_state?.message}
                  />
                </div>
                <Input
                  label="Complemento / Ponto de referência"
                  {...register('delivery_instructions')}
                  placeholder="Opcional"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Forma de Pagamento
              </h2>
              <select
                {...register('payment_method')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="pix">PIX</option>
                <option value="money">Dinheiro</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="debit_card">Cartão de Débito</option>
              </select>
              {errors.payment_method && (
                <p className="text-red-500 text-sm mt-1">{errors.payment_method.message}</p>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Observações</h2>
              <textarea
                {...register('notes')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Alguma observação sobre o pedido?"
              />
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <div key={item.product.id}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                  {item.isSubscription && (
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                      <Repeat className="w-3 h-3" />
                      <span>Assinatura ativa - 10% de desconto</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatCurrency(calculatedTotals.subtotal)}</span>
              </div>
              {calculatedTotals.subscriptionDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Desconto de assinatura
                  </span>
                  <span className="font-semibold">-{formatCurrency(calculatedTotals.subscriptionDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Total</span>
                <span>{formatCurrency(calculatedTotals.total)}</span>
              </div>
            </div>

            <Button
              onClick={handleSubmit(onSubmit)}
              className="w-full mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Finalizando...' : 'Finalizar Pedido'}
            </Button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Ao finalizar, você concorda com nossos termos de uso
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
