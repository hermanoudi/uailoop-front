import { Link, useNavigate } from 'react-router-dom';
import { Search, User, MapPin, ShoppingCart, Menu, LogOut, LayoutDashboard, Package, Settings, BoxIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationBell } from '../../features/notifications/components';
import { CEPSelector } from '../location';

export default function Header() {
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showUserMenu]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-3">
        <div className="container-custom px-4 md:px-6 flex justify-between items-center text-sm">
          <p>Plataforma de Assinaturas para Vendedores Locais</p>
          <div className="flex gap-4">
            <Link to="/for-sellers" className="hover:underline">
              Seja um Vendedor
            </Link>
            <Link to="/help" className="hover:underline">
              Ajuda
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom px-4 md:px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <span className="text-2xl font-bold text-dark">
              Uai<span className="text-primary">Loop</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Busque por produtos ou vendedores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Location */}
            <div className="hidden md:block">
              <CEPSelector onCepChange={() => {
                // Reload page to fetch products for new location
                window.location.reload();
              }} />
            </div>

            {/* Account */}
            {isAuthenticated ? (
              <div className="hidden md:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 text-dark" />
                  <div className="text-left">
                    <p className="text-xs text-light-gray">Olá,</p>
                    <p className="text-sm font-medium text-dark truncate max-w-[120px]">
                      {user?.full_name?.split(' ')[0]}
                    </p>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-dark truncate">{user?.full_name}</p>
                      <p className="text-xs text-light-gray truncate">{user?.email}</p>
                    </div>

                    <Link
                      to={user?.is_seller ? '/seller/dashboard' : '/customer/dashboard'}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-dark" />
                      <span className="text-sm text-dark">
                        {user?.is_seller ? 'Dashboard Vendedor' : 'Minha Conta'}
                      </span>
                    </Link>

                    {user?.is_seller ? (
                      <>
                        <Link
                          to="/seller/profile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 text-dark" />
                          <span className="text-sm text-dark">Minha Conta</span>
                        </Link>
                        <Link
                          to="/seller/products"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <BoxIcon className="w-4 h-4 text-dark" />
                          <span className="text-sm text-dark">Gerenciar Produtos</span>
                        </Link>
                        <Link
                          to="/seller/orders"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package className="w-4 h-4 text-dark" />
                          <span className="text-sm text-dark">Gerenciar Pedidos</span>
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package className="w-4 h-4 text-dark" />
                        <span className="text-sm text-dark">Meus Pedidos</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-dark" />
                <div className="text-left">
                  <p className="text-xs text-light-gray">Minha Conta</p>
                  <p className="text-sm font-medium text-dark">Entrar</p>
                </div>
              </Link>
            )}

            {/* Notifications - Only show when authenticated */}
            {isAuthenticated && (
              <div className="hidden md:block">
                <NotificationBell />
              </div>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-12 h-12 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-dark" />
              {cart.totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center w-12 h-12 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-dark" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="border-t border-gray-200">
        <div className="container-custom px-4 md:px-6">
          <ul className="hidden md:flex items-center justify-center gap-8 py-5">
            <li>
              <Link
                to="/products/acougues"
                className="text-dark hover:text-primary font-medium transition-colors"
              >
                🥩 AÇOUGUES
              </Link>
            </li>
            <li>
              <Link
                to="/products/padarias"
                className="text-dark hover:text-primary font-medium transition-colors"
              >
                🥖 PADARIAS
              </Link>
            </li>
            <li>
              <Link
                to="/products/limpeza"
                className="text-dark hover:text-primary font-medium transition-colors"
              >
                🧹 LIMPEZA
              </Link>
            </li>
            <li>
              <Link
                to="/products/hortifruti"
                className="text-dark hover:text-primary font-medium transition-colors"
              >
                🥗 HORTIFRUTI
              </Link>
            </li>
            <li>
              <Link
                to="/products/bebidas"
                className="text-dark hover:text-primary font-medium transition-colors"
              >
                🥤 BEBIDAS
              </Link>
            </li>
            <li>
              <Link
                to="/products/pet"
                className="text-dark hover:text-primary font-medium transition-colors"
              >
                🐾 PET
              </Link>
            </li>
            <li>
              <Link
                to="/offers"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                SUPER OFERTAS
              </Link>
            </li>
          </ul>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-5 space-y-2">
              <Link
                to="/products/acougues"
                className="block py-2 text-dark hover:text-primary font-medium"
              >
                🥩 AÇOUGUES
              </Link>
              <Link
                to="/products/padarias"
                className="block py-2 text-dark hover:text-primary font-medium"
              >
                🥖 PADARIAS
              </Link>
              <Link
                to="/products/limpeza"
                className="block py-2 text-dark hover:text-primary font-medium"
              >
                🧹 LIMPEZA
              </Link>
              <Link
                to="/products/hortifruti"
                className="block py-2 text-dark hover:text-primary font-medium"
              >
                🥗 HORTIFRUTI
              </Link>
              <Link
                to="/products/bebidas"
                className="block py-2 text-dark hover:text-primary font-medium"
              >
                🥤 BEBIDAS
              </Link>
              <Link
                to="/products/pet"
                className="block py-2 text-dark hover:text-primary font-medium"
              >
                🐾 PET
              </Link>
              <Link
                to="/offers"
                className="block py-2 text-primary font-medium"
              >
                SUPER OFERTAS
              </Link>

              <div className="border-t pt-4 mt-4 space-y-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 py-2 text-dark hover:text-primary"
                >
                  <User className="w-5 h-5" />
                  Minha Conta
                </Link>
                <button className="flex items-center gap-2 py-2 text-dark hover:text-primary w-full text-left">
                  <MapPin className="w-5 h-5" />
                  Alterar Localização
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
