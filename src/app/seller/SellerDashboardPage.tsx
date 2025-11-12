import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import dashboardService from '../../services/dashboard.service';
import type { DashboardFilters } from '../../types/dashboard.types';
import {
  formatCurrency,
  formatStatus,
  formatPaymentMethod,
  getStatusColor,
} from '../../types/dashboard.types';

const SellerDashboardPage = () => {
  const [filters, setFilters] = useState<DashboardFilters>({
    period_type: 'day',
    stuck_hours_threshold: 24,
    top_products_limit: 10,
  });

  // Set date range to last 30 days by default
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  });

  // Fetch dashboard metrics
  const {
    data: metrics,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['dashboard', filters, dateRange],
    queryFn: () =>
      dashboardService.getMetrics({
        ...filters,
        date_from: dateRange.start ? `${dateRange.start}T00:00:00` : undefined,
        date_to: dateRange.end ? `${dateRange.end}T23:59:59` : undefined,
      }),
  });

  // Calculate percentages for charts
  const statusPercentages = useMemo(() => {
    if (!metrics) return [];
    const total = metrics.total_orders;
    return metrics.orders_by_status.map((item) => ({
      ...item,
      percentage: total > 0 ? (item.orders_count / total) * 100 : 0,
    }));
  }, [metrics]);

  const paymentPercentages = useMemo(() => {
    if (!metrics) return [];
    const total = parseFloat(metrics.total_sales);
    return metrics.sales_by_payment_method.map((item) => ({
      ...item,
      percentage: total > 0 ? (parseFloat(item.total_amount) / total) * 100 : 0,
    }));
  }, [metrics]);

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-uai mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Erro ao carregar dashboard</h3>
          <p className="text-red-600">{(error as Error)?.message || 'Erro desconhecido'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard do Vendedor</h1>
          <p className="text-gray-600">Acompanhe suas vendas e pedidos em tempo real</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Period Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={filters.period_type}
              onChange={(e) =>
                setFilters({ ...filters, period_type: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-uai focus:border-green-uai"
            >
              <option value="day">Dia</option>
              <option value="week">Semana</option>
              <option value="month">Mês</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-uai focus:border-green-uai"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-uai focus:border-green-uai"
            />
          </div>

          {/* Stuck Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horas para Pedido Parado
            </label>
            <input
              type="number"
              min="1"
              value={filters.stuck_hours_threshold}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  stuck_hours_threshold: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-uai focus:border-green-uai"
            />
          </div>
        </div>
      </div>

      {metrics && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Sales */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold opacity-90">Vendas Totais</h3>
                <svg
                  className="w-8 h-8 opacity-80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(metrics.total_sales)}</p>
              <p className="text-sm opacity-80 mt-1">
                {metrics.total_orders} pedidos no período
              </p>
            </div>

            {/* Total Orders */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold opacity-90">Total de Pedidos</h3>
                <svg
                  className="w-8 h-8 opacity-80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold">{metrics.total_orders}</p>
              <p className="text-sm opacity-80 mt-1">Pedidos não cancelados</p>
            </div>

            {/* Average Order Value */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold opacity-90">Ticket Médio</h3>
                <svg
                  className="w-8 h-8 opacity-80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold">
                {formatCurrency(metrics.average_order_value)}
              </p>
              <p className="text-sm opacity-80 mt-1">Valor médio por pedido</p>
            </div>
          </div>

          {/* Stuck Orders Alert */}
          {metrics.stuck_orders.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-yellow-800 font-semibold">
                    {metrics.stuck_orders.length} pedido(s) parado(s) há mais de{' '}
                    {filters.stuck_hours_threshold} horas
                  </h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Estes pedidos precisam de atenção para evitar atrasos na entrega.
                  </p>
                  <Link
                    to="/seller/orders"
                    className="text-yellow-800 font-medium text-sm mt-2 inline-block hover:underline"
                  >
                    Ver todos os pedidos →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Stuck Orders Table */}
          {metrics.stuck_orders.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Pedidos Parados</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pedido
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Horas Parado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.stuck_orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {formatStatus(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                          {order.hours_in_status}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/orders/${order.id}`}
                            className="text-green-uai hover:text-green-700 font-medium"
                          >
                            Ver detalhes
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Orders by Status */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pedidos por Status</h2>
              <div className="space-y-3">
                {statusPercentages.map((item) => (
                  <div key={item.status}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {formatStatus(item.status)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.orders_count} ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-uai h-2 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatCurrency(item.total_amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales by Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Vendas por Método de Pagamento
              </h2>
              <div className="space-y-3">
                {paymentPercentages.map((item) => (
                  <div key={item.payment_method}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {formatPaymentMethod(item.payment_method)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.orders_count} ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatCurrency(item.total_amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Produtos Mais Vendidos</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade Vendida
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vezes Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receita Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.top_products.map((product, index) => (
                    <tr key={product.product_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-uai font-bold">{index + 1}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.product_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.quantity_sold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.times_ordered}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-uai">
                        {formatCurrency(product.total_revenue)}
                      </td>
                    </tr>
                  ))}
                  {metrics.top_products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Nenhum produto vendido no período
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orders by Period */}
          {metrics.orders_by_period.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Vendas por Período ({filters.period_type === 'day' ? 'Diário' : filters.period_type === 'week' ? 'Semanal' : 'Mensal'})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Período
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pedidos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.orders_by_period.slice(-10).map((period) => (
                      <tr key={period.date} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {period.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {period.orders_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-uai">
                          {formatCurrency(period.total_amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default SellerDashboardPage;
