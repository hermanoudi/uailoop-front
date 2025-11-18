import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LocationProvider } from './contexts/LocationContext';
import { MainLayout } from './components/layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
import Home from './app/public/Home';
import LoginPage from './app/public/LoginPage';
import RegisterPage from './app/public/RegisterPage';
import ForgotPasswordPage from './app/public/ForgotPasswordPage';
import ResetPasswordPage from './app/public/ResetPasswordPage';
import ProductsCategory from './app/public/ProductsCategory';
import ProductDetail from './app/public/ProductDetail';
import OffersPage from './app/public/OffersPage';
import SellerDetail from './app/public/SellerDetail';
import SellersPage from './app/public/SellersPage';
import CartPage from './app/public/CartPage';
import CheckoutPage from './app/public/CheckoutPage';
import OrdersPage from './app/public/OrdersPage';
import OrderDetailPage from './app/public/OrderDetailPage';
import SellerOrdersPage from './app/seller/SellerOrdersPage';
import SellerProductsPage from './app/seller/SellerProductsPage';
import SellerDashboardPage from './app/seller/SellerDashboardPage';
import SellerOnboarding from './features/seller/pages/SellerOnboarding';
import SellerProfilePage from './features/seller/pages/SellerProfilePage';
import ForSellersPage from './app/public/ForSellersPage';
import ProductCreatePage from './features/products/pages/ProductCreatePage';
import SubscriptionPlansPage from './app/SubscriptionPlansPage';
import SubscribePage from './app/SubscribePage';
import MySubscriptionsPage from './app/MySubscriptionsPage';
import SellerSubscriptionsPage from './app/seller/SellerSubscriptionsPage';
import SellerDeliveriesPage from './app/seller/SellerDeliveriesPage';
import SellerSubscriptionPlansPage from './app/seller/SellerSubscriptionPlansPage';
import SellerSubscriptionPlanFormPage from './app/seller/SellerSubscriptionPlanFormPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <LocationProvider>
            <NotificationProvider>
              <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#191414',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#1DB954',
                secondary: '#fff',
              },
            },
          }}
        />

      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<div className="container-custom py-20">Explorar (em construção)</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/for-sellers" element={<ForSellersPage />} />

          {/* Product Categories */}
          <Route path="/products/:category" element={<ProductsCategory />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Offers */}
          <Route path="/offers" element={<OffersPage />} />

          {/* Sellers */}
          <Route path="/sellers" element={<SellersPage />} />
          <Route path="/seller/:id" element={<SellerDetail />} />

          {/* Customer Dashboard - Protected */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute>
                <div className="container-custom py-20">Dashboard Cliente (em construção)</div>
              </ProtectedRoute>
            }
          />

          {/* Seller Onboarding - Protected */}
          <Route
            path="/seller/onboarding"
            element={
              <ProtectedRoute>
                <SellerOnboarding />
              </ProtectedRoute>
            }
          />

          {/* Seller Profile - Protected (Sellers Only) */}
          <Route
            path="/seller/profile"
            element={
              <ProtectedRoute requireSeller>
                <SellerProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Seller Dashboard - Protected (Sellers Only) */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute requireSeller>
                <SellerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Info Pages */}
          <Route path="/about" element={<div className="container-custom py-20">Sobre (em construção)</div>} />
          <Route path="/how-it-works" element={<div className="container-custom py-20">Como Funciona (em construção)</div>} />
          <Route path="/help" element={<div className="container-custom py-20">Ajuda (em construção)</div>} />
          <Route path="/faq" element={<div className="container-custom py-20">FAQ (em construção)</div>} />
          <Route path="/blog" element={<div className="container-custom py-20">Blog (em construção)</div>} />

          {/* Legal */}
          <Route path="/privacy" element={<div className="container-custom py-20">Privacidade (em construção)</div>} />
          <Route path="/terms" element={<div className="container-custom py-20">Termos (em construção)</div>} />
          <Route path="/cookies" element={<div className="container-custom py-20">Cookies (em construção)</div>} />

          {/* Cart */}
          <Route path="/cart" element={<CartPage />} />

          {/* Checkout - Protected */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          {/* Orders - Protected */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Seller Products - Protected (Sellers Only) */}
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute requireSeller>
                <SellerProductsPage />
              </ProtectedRoute>
            }
          />
          {/* Seller Product Create - Protected (Sellers Only) */}
          <Route
            path="/seller/products/new"
            element={
              <ProtectedRoute requireSeller>
                <ProductCreatePage />
              </ProtectedRoute>
            }
          />
          {/* Seller Orders - Protected (Sellers Only) */}
          <Route
            path="/seller/orders"
            element={
              <ProtectedRoute requireSeller>
                <SellerOrdersPage />
              </ProtectedRoute>
            }
          />

          {/* Subscription Plans - Public */}
          <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />

          {/* Subscribe to Plan - Protected */}
          <Route
            path="/subscribe/:planId"
            element={
              <ProtectedRoute>
                <SubscribePage />
              </ProtectedRoute>
            }
          />

          {/* My Subscriptions - Protected */}
          <Route
            path="/my-subscriptions"
            element={
              <ProtectedRoute>
                <MySubscriptionsPage />
              </ProtectedRoute>
            }
          />

          {/* Seller Subscriptions - Protected (Sellers Only) */}
          <Route
            path="/seller/subscriptions"
            element={
              <ProtectedRoute requireSeller>
                <SellerSubscriptionsPage />
              </ProtectedRoute>
            }
          />

          {/* Seller Deliveries - Protected (Sellers Only) */}
          <Route
            path="/seller/deliveries"
            element={
              <ProtectedRoute requireSeller>
                <SellerDeliveriesPage />
              </ProtectedRoute>
            }
          />

          {/* Seller Subscription Plans - Protected (Sellers Only) */}
          <Route
            path="/seller/subscription-plans"
            element={
              <ProtectedRoute requireSeller>
                <SellerSubscriptionPlansPage />
              </ProtectedRoute>
            }
          />

          {/* Seller Subscription Plans Create - Protected (Sellers Only) */}
          <Route
            path="/seller/subscription-plans/create"
            element={
              <ProtectedRoute requireSeller>
                <SellerSubscriptionPlanFormPage />
              </ProtectedRoute>
            }
          />

          {/* Seller Subscription Plans Edit - Protected (Sellers Only) */}
          <Route
            path="/seller/subscription-plans/edit/:planId"
            element={
              <ProtectedRoute requireSeller>
                <SellerSubscriptionPlanFormPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<div className="container-custom py-20 text-center"><h1 className="text-4xl font-bold">404 - Página não encontrada</h1></div>} />
        </Route>
      </Routes>
              </CartProvider>
            </NotificationProvider>
          </LocationProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
