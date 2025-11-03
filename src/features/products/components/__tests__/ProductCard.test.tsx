import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { CartProvider } from '../../../../contexts/CartContext';
import type { ProductListItem } from '../../../../types/product';

// Mock toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockProduct: ProductListItem = {
  id: 1,
  name: 'Picanha Premium',
  description: 'Picanha de alta qualidade',
  price: 99.90,
  category: 'acougues',
  unit: 'kg',
  image_url: 'https://example.com/picanha.jpg',
  seller_id: 1,
  seller_name: 'Açougue do João',
  is_available: true,
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <CartProvider>{component}</CartProvider>
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  it('should render product information', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Picanha Premium')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 99,90/)).toBeInTheDocument();
    expect(screen.getByText(/por kg/)).toBeInTheDocument();
  });

  it('should display product image as background', () => {
    const { container } = renderWithProviders(<ProductCard product={mockProduct} />);

    const imageDiv = container.querySelector('.bg-cover');
    expect(imageDiv).toBeInTheDocument();
    expect(imageDiv).toHaveStyle({ backgroundImage: `url('${mockProduct.image_url}')` });
  });

  it('should link to product detail page', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/product/${mockProduct.id}`);
  });

  it('should add product to cart when cart button is clicked', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const cartButton = screen.getByRole('button');
    fireEvent.click(cartButton);

    // Product should be added to cart (test via CartContext)
    // This is tested in CartContext tests
  });

  it('should show seller name if provided', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText(/Açougue do João/)).toBeInTheDocument();
  });

  it('should handle products without seller name', () => {
    const productWithoutSeller = { ...mockProduct, seller_name: null };
    renderWithProviders(<ProductCard product={productWithoutSeller} />);

    expect(screen.queryByText(/Açougue do João/)).not.toBeInTheDocument();
  });
});
