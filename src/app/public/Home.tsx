import { Link } from 'react-router-dom';
import { Check, Package, MapPin, CreditCard, TrendingUp, Shield, Star, Zap } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useSellers } from '../../features/sellers/hooks/useSellers';
import { useFeaturedOffers } from '../../features/offers/hooks/useOffers';
import SellerCard from '../../features/sellers/components/SellerCard';
import OfferCard from '../../features/offers/components/OfferCard';

export default function Home() {
  // Buscar ofertas em destaque (6 primeiras)
  const { offers, loading: loadingOffers } = useFeaturedOffers(6);

  // Buscar vendedores em destaque (3 primeiros)
  const { sellers, loading: loadingSellers } = useSellers({ size: 3 });

  return (
    <div className="bg-white">
      {/* Hero Section - Banner Grande */}
      <section
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1747006116196-fc20e136e4c0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1600')",
        }}
      >
        <div className="container-custom h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Faça parte do<br />
              <span className="text-primary">UaiLoop</span>
            </h1>
            <p className="text-2xl mb-8 leading-relaxed">
              Açougues, Padarias e Produtos de Limpeza<br />
              direto na sua porta todo mês
            </p>

            {/* Benefícios principais */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-primary" />
                <span className="text-lg">Produtos frescos e de qualidade premium</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-primary" />
                <span className="text-lg">Descontos exclusivos para assinantes</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-primary" />
                <span className="text-lg">Apoie vendedores locais da sua região</span>
              </div>
            </div>

            <Link to="/register">
              <Button size="lg" className="!bg-primary !text-white !text-xl !px-12 !py-6 hover:!bg-primary-dark">
                ASSINE JÁ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-dark mb-4">
            Como Funciona o UaiLoop
          </h2>
          <p className="text-xl text-center text-light-gray mb-16 max-w-3xl mx-auto">
            Conectamos você com os melhores vendedores locais através de assinaturas recorrentes
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Passo 1 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="relative">
                  <Package className="w-16 h-16 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-3">Escolha seu Plano</h3>
              <p className="text-light-gray text-lg">
                Navegue pelas categorias e escolha os vendedores e produtos que mais gosta
              </p>
            </div>

            {/* Passo 2 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="relative">
                  <CreditCard className="w-16 h-16 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-3">Faça sua Assinatura</h3>
              <p className="text-light-gray text-lg">
                Defina a frequência (semanal, quinzenal ou mensal) e forma de pagamento
              </p>
            </div>

            {/* Passo 3 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="relative">
                  <MapPin className="w-16 h-16 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-3">Receba em Casa</h3>
              <p className="text-light-gray text-lg">
                Produtos frescos entregues automaticamente na sua porta
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens de Ser Assinante */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-dark mb-16">
            Vantagens de Ser Assinante
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vantagem 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Economia Garantida</h3>
              <p className="text-light-gray">
                Descontos exclusivos de até 15% para assinantes em todos os produtos
              </p>
            </div>

            {/* Vantagem 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Produtos Frescos</h3>
              <p className="text-light-gray">
                Receba carnes, pães e produtos de limpeza sempre frescos e de qualidade
              </p>
            </div>

            {/* Vantagem 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Entrega no seu Bairro</h3>
              <p className="text-light-gray">
                Vendedores locais garantem entrega rápida e produtos da sua região
              </p>
            </div>

            {/* Vantagem 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Segurança e Qualidade</h3>
              <p className="text-light-gray">
                Todos os vendedores são verificados e avaliados pela comunidade
              </p>
            </div>

            {/* Vantagem 5 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🏪</span>
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Apoie o Comércio Local</h3>
              <p className="text-light-gray">
                Fortaleça a economia da sua região comprando de pequenos negócios
              </p>
            </div>

            {/* Vantagem 6 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">⏰</span>
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Praticidade Total</h3>
              <p className="text-light-gray">
                Cancele ou pause sua assinatura quando quiser, sem burocracia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Super Ofertas */}
      {!loadingOffers && offers.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-dark text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
                <Zap className="w-4 h-4" />
                PROMOÇÕES ATIVAS
              </div>
              <h2 className="text-4xl font-bold text-dark mb-4">
                Super Ofertas
              </h2>
              <p className="text-xl text-light-gray">
                Aproveite descontos incríveis por tempo limitado!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/offers">
                <Button size="lg" className="!bg-primary hover:!bg-primary-dark !text-white">
                  Ver Todas as Ofertas
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Vendedores em Destaque */}
      {!loadingSellers && sellers.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-4xl font-bold text-center text-dark mb-4">
              Vendedores em Destaque
            </h2>
            <p className="text-xl text-center text-light-gray mb-12">
              Conheça os vendedores mais bem avaliados da sua região
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {sellers.map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/sellers">
                <Button size="lg" variant="secondary">
                  Ver Todos os Vendedores
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categorias Principais - Cards Grandes */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-dark mb-4">
            Nossas Categorias
          </h2>
          <p className="text-xl text-center text-light-gray mb-16">
            Escolha entre as principais categorias de produtos locais
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Açougues */}
            <Link to="/products/acougues" className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <div
                  className="h-64 bg-cover bg-center relative"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&h=400&fit=crop')"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold text-white">🥩 Açougues</h3>
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                          PRINCIPAL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-light-gray mb-4">
                    Carnes frescas e de qualidade premium entregues semanalmente na sua casa
                  </p>
                  <Button variant="secondary" className="w-full">
                    Ver Açougues
                  </Button>
                </div>
              </div>
            </Link>

            {/* Padarias */}
            <Link to="/products/padarias" className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <div
                  className="h-64 bg-cover bg-center relative"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop')"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold text-white">🥖 Padarias</h3>
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                          PRINCIPAL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-light-gray mb-4">
                    Pães quentinhos e produtos de padaria frescos todos os dias
                  </p>
                  <Button variant="secondary" className="w-full">
                    Ver Padarias
                  </Button>
                </div>
              </div>
            </Link>

            {/* Limpeza */}
            <Link to="/products/limpeza" className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <div
                  className="h-64 bg-cover bg-center relative"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop')"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold text-white">🧹 Limpeza</h3>
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                          PRINCIPAL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-light-gray mb-4">
                    Produtos de limpeza essenciais entregues mensalmente
                  </p>
                  <Button variant="secondary" className="w-full">
                    Ver Produtos
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-dark mb-16">
            O Que Dizem Nossos Clientes
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Depoimento 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-dark mb-4 italic">
                "A carne sempre chega fresca e de ótima qualidade. Não troco mais!"
              </p>
              <p className="text-sm text-light-gray">
                <strong>João Silva</strong><br />
                Belo Horizonte, MG
              </p>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-dark mb-4 italic">
                "Pão quentinho todo dia sem sair de casa. Maravilhoso!"
              </p>
              <p className="text-sm text-light-gray">
                <strong>Maria Santos</strong><br />
                Contagem, MG
              </p>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-dark mb-4 italic">
                "Economizo tempo e dinheiro com os produtos de limpeza. Recomendo!"
              </p>
              <p className="text-sm text-light-gray">
                <strong>Carlos Oliveira</strong><br />
                Betim, MG
              </p>
            </div>

            {/* Depoimento 4 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-dark mb-4 italic">
                "Apoiar o comércio local nunca foi tão fácil. Adoro o UaiLoop!"
              </p>
              <p className="text-sm text-light-gray">
                <strong>Ana Paula</strong><br />
                Nova Lima, MG
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-5xl font-bold mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-2xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de clientes satisfeitos e comece a receber produtos frescos hoje mesmo
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="!bg-white !text-primary !border-white hover:!bg-gray-100 !text-xl !px-12 !py-6"
            >
              ASSINE AGORA
            </Button>
          </Link>
          <p className="mt-6 text-lg opacity-90">
            Sem fidelidade • Cancele quando quiser • Primeira entrega grátis
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-dark mb-16">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            <details className="bg-white p-6 rounded-xl shadow-md">
              <summary className="font-bold text-lg text-dark cursor-pointer">
                Como funciona a entrega?
              </summary>
              <p className="mt-4 text-light-gray">
                A entrega é feita pelos próprios vendedores locais da sua região. Você escolhe o dia e horário mais conveniente no momento da assinatura.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-md">
              <summary className="font-bold text-lg text-dark cursor-pointer">
                Posso cancelar a assinatura?
              </summary>
              <p className="mt-4 text-light-gray">
                Sim! Você pode cancelar ou pausar sua assinatura a qualquer momento, sem multas ou taxas de cancelamento.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-md">
              <summary className="font-bold text-lg text-dark cursor-pointer">
                Quais formas de pagamento são aceitas?
              </summary>
              <p className="mt-4 text-light-gray">
                Aceitamos cartão de crédito, débito e PIX. O pagamento é processado automaticamente na data combinada.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-md">
              <summary className="font-bold text-lg text-dark cursor-pointer">
                Como são escolhidos os vendedores?
              </summary>
              <p className="mt-4 text-light-gray">
                Todos os vendedores passam por um processo de verificação e são avaliados pelos clientes. Trabalhamos apenas com estabelecimentos de qualidade comprovada.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
