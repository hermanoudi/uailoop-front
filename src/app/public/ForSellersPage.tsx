import { Link } from 'react-router-dom';
import { Check, TrendingUp, Users, MapPin, Package, DollarSign, Clock, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

export default function ForSellersPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(29, 185, 84, 0.9), rgba(29, 185, 84, 0.9)), url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=600&fit=crop')",
        }}
      >
        <div className="container-custom h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Venda Mais com o<br />
              <span className="text-dark">UaiLoop</span>
            </h1>
            <p className="text-2xl mb-8 leading-relaxed">
              Conecte-se com clientes da sua região através de assinaturas recorrentes
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-dark" />
                <span className="text-lg">Receba pagamentos recorrentes automaticamente</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-dark" />
                <span className="text-lg">Defina sua área de atuação e raio de entrega</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-dark" />
                <span className="text-lg">Sem mensalidade - só pague quando vender</span>
              </div>
            </div>

            {isAuthenticated ? (
              user?.is_seller ? (
                <Link to="/seller/dashboard">
                  <Button size="lg" className="!bg-dark !text-white !text-xl !px-12 !py-6 hover:!bg-gray-800">
                    IR PARA MEU DASHBOARD
                  </Button>
                </Link>
              ) : (
                <Link to="/seller/onboarding">
                  <Button size="lg" className="!bg-dark !text-white !text-xl !px-12 !py-6 hover:!bg-gray-800">
                    COMEÇAR AGORA - GRÁTIS
                  </Button>
                </Link>
              )
            ) : (
              <Link to="/register?seller=true">
                <Button size="lg" className="!bg-dark !text-white !text-xl !px-12 !py-6 hover:!bg-gray-800">
                  CRIAR CONTA E COMEÇAR
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-dark mb-4">
            Por Que Vender no UaiLoop?
          </h2>
          <p className="text-xl text-center text-light-gray mb-16 max-w-3xl mx-auto">
            Aumente suas vendas e fidelize clientes com nossa plataforma de assinaturas
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefício 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Receita Recorrente</h3>
              <p className="text-light-gray">
                Receba pagamentos automáticos todo mês dos seus clientes assinantes
              </p>
            </div>

            {/* Benefício 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Clientes Fiéis</h3>
              <p className="text-light-gray">
                Crie uma base de clientes recorrentes e previsível para seu negócio
              </p>
            </div>

            {/* Benefício 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Área Local</h3>
              <p className="text-light-gray">
                Defina seu raio de entrega e atenda apenas sua região
              </p>
            </div>

            {/* Benefício 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Package className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Fácil Gestão</h3>
              <p className="text-light-gray">
                Gerencie produtos, pedidos e entregas em um só lugar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-dark mb-4">
            Como Começar a Vender
          </h2>
          <p className="text-xl text-center text-light-gray mb-16 max-w-3xl mx-auto">
            Em 3 passos simples você já pode começar a receber pedidos
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Passo 1 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="relative">
                  <Shield className="w-16 h-16 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-3">Cadastre-se</h3>
              <p className="text-light-gray text-lg">
                Crie sua conta e complete o cadastro do seu negócio em poucos minutos
              </p>
            </div>

            {/* Passo 2 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="relative">
                  <Package className="w-16 h-16 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-3">Cadastre Produtos</h3>
              <p className="text-light-gray text-lg">
                Adicione seus produtos com fotos, preços e descrições detalhadas
              </p>
            </div>

            {/* Passo 3 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="relative">
                  <DollarSign className="w-16 h-16 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-3">Comece a Vender</h3>
              <p className="text-light-gray text-lg">
                Receba pedidos automaticamente e gerencie entregas pelo painel
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Taxas */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-dark mb-4">
            Taxas Transparentes
          </h2>
          <p className="text-xl text-center text-light-gray mb-16 max-w-3xl mx-auto">
            Sem mensalidade. Você só paga quando vender.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-4 border-primary">
              <div className="text-6xl font-bold text-primary mb-4">8%</div>
              <p className="text-2xl font-semibold text-dark mb-6">por venda realizada</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 justify-center">
                  <Check className="w-6 h-6 text-primary" />
                  <span className="text-lg text-light-gray">Sem mensalidade</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <Check className="w-6 h-6 text-primary" />
                  <span className="text-lg text-light-gray">Sem taxa de cadastro</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <Check className="w-6 h-6 text-primary" />
                  <span className="text-lg text-light-gray">Sem limite de produtos</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <Check className="w-6 h-6 text-primary" />
                  <span className="text-lg text-light-gray">Receba em até 2 dias úteis</span>
                </div>
              </div>

              <p className="text-sm text-light-gray">
                *Exemplo: Em uma venda de R$ 100,00, você recebe R$ 92,00
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias Aceitas */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-dark mb-16">
            Categorias Aceitas
          </h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <span className="text-5xl mb-3 block">🥩</span>
              <h3 className="font-semibold text-dark">Açougues</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <span className="text-5xl mb-3 block">🥖</span>
              <h3 className="font-semibold text-dark">Padarias</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <span className="text-5xl mb-3 block">🧹</span>
              <h3 className="font-semibold text-dark">Produtos de Limpeza</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <span className="text-5xl mb-3 block">🥗</span>
              <h3 className="font-semibold text-dark">Hortifruti</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <span className="text-5xl mb-3 block">🥤</span>
              <h3 className="font-semibold text-dark">Bebidas</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <span className="text-5xl mb-3 block">🐾</span>
              <h3 className="font-semibold text-dark">Pet Shop</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <span className="text-5xl mb-3 block">📦</span>
              <h3 className="font-semibold text-dark">Outros</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-5xl font-bold mb-6">
            Pronto para Aumentar suas Vendas?
          </h2>
          <p className="text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se aos vendedores que já estão crescendo com o UaiLoop
          </p>

          {isAuthenticated ? (
            user?.is_seller ? (
              <Link to="/seller/dashboard">
                <Button
                  size="lg"
                  className="!bg-dark !text-white !border-dark hover:!bg-gray-800 !text-xl !px-12 !py-6"
                >
                  ACESSAR DASHBOARD
                </Button>
              </Link>
            ) : (
              <Link to="/seller/onboarding">
                <Button
                  size="lg"
                  className="!bg-dark !text-white !border-dark hover:!bg-gray-800 !text-xl !px-12 !py-6"
                >
                  COMEÇAR AGORA - GRÁTIS
                </Button>
              </Link>
            )
          ) : (
            <Link to="/register?seller=true">
              <Button
                size="lg"
                className="!bg-dark !text-white !border-dark hover:!bg-gray-800 !text-xl !px-12 !py-6"
              >
                CRIAR CONTA GRÁTIS
              </Button>
            </Link>
          )}

          <p className="mt-6 text-lg opacity-90">
            <Clock className="w-5 h-5 inline mr-2" />
            Cadastro leva menos de 5 minutos
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container-custom max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-dark mb-16">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            <details className="bg-white p-6 rounded-xl shadow-md">
              <summary className="font-bold text-lg text-dark cursor-pointer">
                Preciso ter CNPJ para vender?
              </summary>
              <p className="mt-4 text-light-gray">
                Sim, é necessário ter um CNPJ ativo para se cadastrar como vendedor na plataforma.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-md">
              <summary className="font-bold text-lg text-dark cursor-pointer">
                Como funciona o pagamento?
              </summary>
              <p className="mt-4 text-light-gray">
                O cliente paga no momento da assinatura e você recebe automaticamente em até 2 dias úteis, já descontada a taxa de 8%.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-md">
              <summary className="font-bold text-lg text-dark cursor-pointer">
                Posso definir minha área de entrega?
              </summary>
              <p className="mt-4 text-light-gray">
                Sim! Você define o raio de entrega (1 a 50 km) a partir do seu endereço. Apenas clientes nessa área verão seus produtos.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-md">
              <summary className="font-bold text-lg text-dark cursor-pointer">
                Posso cancelar minha conta quando quiser?
              </summary>
              <p className="mt-4 text-light-gray">
                Sim, você pode cancelar sua conta de vendedor a qualquer momento, sem multas ou taxas de cancelamento.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-md">
              <summary className="font-bold text-lg text-dark cursor-pointer">
                Quantos produtos posso cadastrar?
              </summary>
              <p className="mt-4 text-light-gray">
                Não há limite! Você pode cadastrar quantos produtos quiser sem nenhum custo adicional.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
