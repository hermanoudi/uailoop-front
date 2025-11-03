/**
 * OrdersPage - Customer orders history
 */

import { useState } from 'react';
import { Package, Filter, Search, Calendar, X } from 'lucide-react';
import { useOrders } from '../../features/orders/hooks/useOrders';
import OrderCard from '../../features/orders/components/OrderCard';
import Loading from '../../components/ui/Loading';
import type { OrderStatus } from '../../types/order';

const statusFilters: Array<{ value: OrderStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'confirmed', label: 'Confirmados' },
  { value: 'preparing', label: 'Em Preparação' },
  { value: 'out_for_delivery', label: 'Saiu para Entrega' },
  { value: 'delivered', label: 'Entregues' },
  { value: 'cancelled', label: 'Cancelados' },
];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  // Search states - temporary inputs
  const [searchInput, setSearchInput] = useState('');
  const [dateFromInput, setDateFromInput] = useState('');
  const [dateToInput, setDateToInput] = useState('');

  // Applied filters - used in query
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [dateError, setDateError] = useState('');

  // Get today's date in YYYY-MM-DD format for max date validation
  const today = new Date().toISOString().split('T')[0];

  // Helper functions for date conversion
  const formatDateToBR = (isoDate: string): string => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatDateToISO = (brDate: string): string => {
    if (!brDate) return '';
    const cleaned = brDate.replace(/\D/g, '');
    if (cleaned.length !== 8) return '';
    const day = cleaned.substring(0, 2);
    const month = cleaned.substring(2, 4);
    const year = cleaned.substring(4, 8);
    return `${year}-${month}-${day}`;
  };

  const handleDateInput = (value: string, setter: (value: string) => void) => {
    // Remove non-digits
    let cleaned = value.replace(/\D/g, '');

    // Limit to 8 digits
    if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);

    // Add slashes
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.substring(0, 2);
      if (cleaned.length >= 3) {
        formatted += '/' + cleaned.substring(2, 4);
        if (cleaned.length >= 5) {
          formatted += '/' + cleaned.substring(4);
        }
      }
    }

    setter(formatted);
  };

  const { data, isLoading, error } = useOrders({
    page,
    size: 10,
    status_filter: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro ao carregar pedidos</h2>
        <p className="text-gray-600">Tente novamente mais tarde</p>
      </div>
    );
  }

  const orders = data?.items || [];
  const hasOrders = orders.length > 0;

  const handleSearch = () => {
    setDateError('');

    // Convert BR dates to ISO for validation
    const dateFromISO = formatDateToISO(dateFromInput);
    const dateToISO = formatDateToISO(dateToInput);

    // Validate date format
    if (dateFromInput && dateFromInput.length > 0 && dateFromInput.length < 10) {
      setDateError('Data inicial inválida. Use o formato dd/MM/AAAA');
      return;
    }

    if (dateToInput && dateToInput.length > 0 && dateToInput.length < 10) {
      setDateError('Data final inválida. Use o formato dd/MM/AAAA');
      return;
    }

    // Validate date values
    if (dateFromISO) {
      const fromDate = new Date(dateFromISO);
      if (isNaN(fromDate.getTime())) {
        setDateError('Data inicial inválida');
        return;
      }
      if (dateFromISO > today) {
        setDateError('A data inicial não pode ser no futuro');
        return;
      }
    }

    if (dateToISO) {
      const toDate = new Date(dateToISO);
      if (isNaN(toDate.getTime())) {
        setDateError('Data final inválida');
        return;
      }
      if (dateToISO > today) {
        setDateError('A data final não pode ser no futuro');
        return;
      }
    }

    if (dateFromISO && dateToISO && dateFromISO > dateToISO) {
      setDateError('A data inicial não pode ser maior que a data final');
      return;
    }

    // Apply filters with ISO dates
    setSearchQuery(searchInput);
    setDateFrom(dateFromISO);
    setDateTo(dateToISO);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setDateFromInput('');
    setDateToInput('');
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setStatusFilter('all');
    setDateError('');
    setPage(1);
  };

  const hasActiveFilters = searchQuery || dateFrom || dateTo || statusFilter !== 'all';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Meus Pedidos</h1>
        <p className="text-gray-600">
          {data?.total || 0} {data?.total === 1 ? 'pedido' : 'pedidos'} encontrados
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-700">Buscar pedidos:</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search by order number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número do pedido
            </label>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ex: 123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Date from */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data inicial
            </label>
            <div className="relative">
              <input
                type="text"
                value={dateFromInput}
                onChange={(e) => handleDateInput(e.target.value, setDateFromInput)}
                placeholder="dd/MM/AAAA"
                maxLength={10}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              />
              <input
                type="date"
                max={today}
                onChange={(e) => {
                  if (e.target.value) {
                    setDateFromInput(formatDateToBR(e.target.value));
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 cursor-pointer"
                title="Abrir calendário"
              />
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Date to */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data final
            </label>
            <div className="relative">
              <input
                type="text"
                value={dateToInput}
                onChange={(e) => handleDateInput(e.target.value, setDateToInput)}
                placeholder="dd/MM/AAAA"
                maxLength={10}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              />
              <input
                type="date"
                max={today}
                onChange={(e) => {
                  if (e.target.value) {
                    setDateToInput(formatDateToBR(e.target.value));
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 cursor-pointer"
                title="Abrir calendário"
              />
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Error message */}
        {dateError && (
          <div className="mt-3 text-sm text-red-600 flex items-center gap-2">
            <X className="w-4 h-4" />
            {dateError}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-700">Filtrar por status:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setStatusFilter(filter.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                statusFilter === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {hasOrders ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}

          {/* Pagination */}
          {data && data.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 bg-white border rounded-lg">
                Página {page} de {data.pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Nenhum pedido encontrado
          </h2>
          <p className="text-gray-600">
            {statusFilter === 'all'
              ? 'Você ainda não fez nenhum pedido'
              : `Nenhum pedido com status "${statusFilters.find(f => f.value === statusFilter)?.label}"`}
          </p>
        </div>
      )}
    </div>
  );
}
