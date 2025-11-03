/**
 * OrderStatusTimeline - Visual timeline of order status changes
 */

import { useEffect, useState } from 'react';
import { Clock, Check, Package, Truck, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../../../services/api';

interface StatusHistoryEntry {
  id: number;
  order_id: number;
  old_status: string | null;
  new_status: string;
  changed_by_user_id: number | null;
  changed_by_role: string | null;
  notes: string | null;
  created_at: string;
}

interface OrderStatusTimelineProps {
  orderId: number;
}

const statusConfig = {
  pending: {
    label: 'Aguardando Confirmação',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
  },
  confirmed: {
    label: 'Confirmado',
    icon: Check,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
  },
  preparing: {
    label: 'Em Preparação',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
  },
  out_for_delivery: {
    label: 'Saiu para Entrega',
    icon: Truck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
  },
  delivered: {
    label: 'Entregue',
    icon: Check,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
  },
};

export function OrderStatusTimeline({ orderId }: OrderStatusTimelineProps) {
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [orderId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}/history`);
      setHistory(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar histórico');
      console.error('Error fetching order history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum histórico disponível
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Histórico do Pedido</h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Timeline items */}
        <div className="space-y-6">
          {history.map((entry, index) => {
            const config = statusConfig[entry.new_status as keyof typeof statusConfig];
            const Icon = config?.icon || Clock;
            const isFirst = index === 0;
            const isLast = index === history.length - 1;

            return (
              <div key={entry.id} className="relative flex gap-4">
                {/* Icon */}
                <div className={`
                  relative z-10 flex items-center justify-center
                  w-12 h-12 rounded-full border-4 border-white
                  ${config?.bgColor || 'bg-gray-100'}
                  ${isLast ? 'ring-4 ring-emerald-100' : ''}
                `}>
                  <Icon className={`h-6 w-6 ${config?.color || 'text-gray-600'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className={`
                    p-4 rounded-lg border-2
                    ${config?.borderColor || 'border-gray-200'}
                    ${isLast ? 'bg-white shadow-md' : 'bg-gray-50'}
                  `}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className={`font-semibold ${config?.color || 'text-gray-900'}`}>
                          {config?.label || entry.new_status}
                        </h4>

                        {entry.notes && (
                          <p className="mt-1 text-sm text-gray-600">
                            {entry.notes}
                          </p>
                        )}

                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            {formatDistanceToNow(new Date(entry.created_at), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>

                          {entry.changed_by_role && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                              {entry.changed_by_role === 'customer' && 'Cliente'}
                              {entry.changed_by_role === 'seller' && 'Vendedor'}
                              {entry.changed_by_role === 'system' && 'Sistema'}
                              {entry.changed_by_role === 'admin' && 'Administrador'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-gray-400">
                        {new Date(entry.created_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
