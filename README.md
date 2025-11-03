# UaiLoop Frontend

Interface web da plataforma UaiLoop - Sistema de assinaturas para vendedores locais.

## Stack Tecnológica

- **React 18.3** - Library UI
- **TypeScript 5.6** - Type safety
- **Vite 5.4** - Build tool
- **TailwindCSS 3.4** - Utility-first CSS
- **React Router 6** - Roteamento
- **Axios** - Cliente HTTP
- **Zustand** - Gerenciamento de estado
- **Lucide React** - Ícones

## Pré-requisitos

- Node.js 18+ ou 20+
- npm ou yarn
- **API Backend rodando** em http://localhost:8000 (veja uailoop-api/README.md)

## Instalação e Configuração

### 1. Entrar no diretório do projeto

```bash
cd /home/hermano/projetos/uailoop/uailoop-front
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

O arquivo `.env` já deve estar configurado com:

```env
VITE_API_URL=http://localhost:8000
VITE_API_VERSION=v1
```

Se o arquivo não existir, crie-o com o conteúdo acima.

### 4. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em: **http://localhost:5173**

## Verificar se está funcionando

### 1. Certifique-se que a API está rodando

Antes de iniciar o front-end, verifique se a API está respondendo:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/products/
```

Se a API não estiver rodando, vá para `uailoop-api/` e siga as instruções do README.md.

### 2. Abra o navegador

Acesse: http://localhost:5173

Você deve ver:
- Home page com produtos em destaque
- Produtos de açougues, padarias e limpeza
- Cards de vendedores

### 3. Navegar pelas categorias

Clique nas categorias no menu:
- **AÇOUGUES** - http://localhost:5173/products/acougues
- **PADARIAS** - http://localhost:5173/products/padarias
- **LIMPEZA** - http://localhost:5173/products/limpeza

Os produtos cadastrados no banco de dados devem aparecer.

## Estrutura do Projeto

```
uailoop-front/
├── src/
│   ├── app/                      # Páginas
│   │   ├── auth/                # Login, Register
│   │   ├── customer/            # Dashboard do cliente
│   │   ├── seller/              # Dashboard do vendedor
│   │   └── public/              # Home, ProductsCategory
│   │
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ui/                 # Button, Input, Loading, etc
│   │   └── layout/             # Header, Footer
│   │
│   ├── features/                # Features organizadas
│   │   ├── products/           # Produtos (services, hooks, components)
│   │   └── sellers/            # Vendedores (services, hooks, components)
│   │
│   ├── services/                # API integration
│   │   └── api.ts              # Axios configurado
│   │
│   ├── stores/                  # Zustand stores
│   │   └── auth.store.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── product.ts
│   │   └── vendor.ts
│   │
│   ├── lib/                     # Utilitários
│   │   └── formatters.ts       # Formatadores BR (CPF, CNPJ, moeda)
│   │
│   ├── App.tsx                  # App principal
│   └── main.tsx                 # Entry point
│
└── package.json
```

## Integração com a API

### Como funciona

O front-end está configurado para se comunicar com a API do back-end:

1. **Base URL:** Configurada em `.env` como `VITE_API_URL=http://localhost:8000`
2. **Axios:** Cliente HTTP configurado em `src/services/api.ts`
3. **Services:** Camada de serviços em `src/features/*/services/`
4. **Hooks:** React hooks customizados em `src/features/*/hooks/`

### Exemplo de uso

```typescript
// Hook para buscar produtos
import { useProducts } from '@/features/products/hooks/useProducts';

function ProductsPage() {
  const { products, loading, error } = useProducts({
    category: 'acougues',
    size: 20
  });

  if (loading) return <Loading />;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Tipos de Dados

O front-end utiliza TypeScript para garantir tipagem forte. Os tipos refletem exatamente o que a API retorna:

### Produtos

```typescript
interface ProductListItem {
  id: number;
  name: string;
  category: ProductCategory;
  price: number | string;  // API retorna string (Decimal)
  unit: string;
  image_url: string | null;
  is_available: boolean;
  vendor_id: number;
}
```

### Vendedores

```typescript
interface VendorListItem {
  id: number;
  business_name: string;
  category: string;
  description: string | null;
  city: string;
  state: string;
  logo_url: string | null;
  rating_average: number | string;  // API retorna string (Decimal)
  rating_count: number;
  is_verified: boolean;
}
```

**Nota:** A API retorna valores Decimal (price, rating_average) como strings no JSON. Os componentes convertem para número quando necessário.

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (porta 5173)

# Build
npm run build            # Build para produção
npm run preview          # Preview do build de produção

# Lint
npm run lint             # Verifica problemas de código
```

## Formatadores Brasileiros

O projeto inclui formatadores para padrões brasileiros em `src/lib/formatters.ts`:

```typescript
import { formatCurrency, formatCPF, formatPhone } from '@/lib/formatters';

// Formatar moeda
formatCurrency(89.90);        // "R$ 89,90"
formatCurrency("89.90");      // "R$ 89,90" (aceita string também)

// Formatar CPF
formatCPF('12345678901');     // "123.456.789-01"

// Formatar telefone
formatPhone('31987654321');   // "(31) 98765-4321"
```

## Problemas Comuns

### Produtos não aparecem

**Causa:** API não está rodando ou não tem dados

**Solução:**
```bash
# Verificar API
curl http://localhost:8000/api/v1/products/

# Se não retornar produtos, popular o banco
cd /home/hermano/projetos/uailoop/uailoop-api
sudo docker-compose exec api python /app/scripts/seed_data.py
```

### CORS Error

**Causa:** API não está configurada para aceitar requisições do front-end

**Solução:** Verifique se em `uailoop-api/docker-compose.yml` tem:
```yaml
environment:
  - BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

Se não tiver, adicione e reinicie a API:
```bash
cd /home/hermano/projetos/uailoop/uailoop-api
sudo docker-compose restart api
```

### Erro 404 Not Found

**Causa:** URL da API está incorreta no `.env`

**Solução:** Verifique o arquivo `.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_API_VERSION=v1
```

Após alterar o `.env`, reinicie o servidor de desenvolvimento:
```bash
# Ctrl+C para parar
npm run dev
```

### Port 5173 already in use

**Causa:** Já existe um processo rodando na porta 5173

**Solução:**
```bash
# Encontrar o processo
lsof -i :5173

# Matar o processo (substitua <PID> pelo número retornado)
kill -9 <PID>

# Iniciar novamente
npm run dev
```

### TypeError ao renderizar componentes

**Causa:** Tipos de dados incompatíveis (ex: tentar usar .toFixed() em string)

**Solução:** Os tipos já estão corrigidos para aceitar string | number nos campos que vêm como Decimal da API (price, rating_average). Se encontrar problemas, use:

```typescript
// Converter string para número antes de usar métodos numéricos
Number(vendor.rating_average).toFixed(1)
Number(product.price).toFixed(2)
```

### npm install falha

**Causa:** Cache do npm corrompido ou versão antiga do Node

**Solução:**
```bash
# Limpar cache do npm
npm cache clean --force

# Remover node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# Se o problema persistir, atualize o Node.js
node --version  # Deve ser 18+ ou 20+
```

## Rotas Disponíveis

### Públicas
- `/` - Home page
- `/products/:category` - Produtos por categoria
- `/product/:id` - Detalhes do produto
- `/seller/:id` - Perfil do vendedor
- `/login` - Login
- `/register` - Registro

### Protegidas (requerem autenticação)
- `/customer/dashboard` - Dashboard do cliente
- `/customer/subscriptions` - Minhas assinaturas
- `/customer/profile` - Meu perfil
- `/seller/dashboard` - Dashboard do vendedor
- `/seller/products` - Gerenciar produtos
- `/seller/orders` - Pedidos

## Desenvolvimento

### Adicionar nova página

1. Crie o arquivo em `src/app/public/` ou `src/app/customer/`
2. Adicione a rota em `src/App.tsx`
3. Use os hooks existentes para buscar dados

### Adicionar novo componente UI

1. Crie o arquivo em `src/components/ui/`
2. Siga o padrão dos componentes existentes (Button, Input, Card)
3. Use TailwindCSS para estilização
4. Exporte o componente

### Integrar novo endpoint da API

1. Adicione tipos em `src/types/`
2. Crie service em `src/features/*/services/`
3. Crie hook customizado em `src/features/*/hooks/`
4. Use o hook nos componentes

## Deploy

Para fazer deploy em produção:

1. Configure a URL da API de produção no `.env`:
```env
VITE_API_URL=https://api.uailoop.com
```

2. Faça o build:
```bash
npm run build
```

3. O resultado estará na pasta `dist/`

4. Faça deploy da pasta `dist/` em:
   - **Vercel:** `vercel --prod`
   - **Netlify:** `netlify deploy --prod --dir=dist`
   - **Servidor próprio:** Copie a pasta `dist/` para o servidor web

## Suporte

- Veja a documentação da API em: http://localhost:8000/api/v1/docs
- Para problemas com o back-end, consulte: `uailoop-api/README.md`
