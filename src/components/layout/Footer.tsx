import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-20">
      {/* Main Footer */}
      <div className="container-custom px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="text-2xl font-bold">
                Uai<span className="text-primary">Loop</span>
              </span>
            </div>
            <p className="text-light-gray text-sm leading-relaxed">
              Conectando vendedores locais com consumidores através de assinaturas recorrentes.
              Apoie o comércio local e receba produtos frescos na sua porta.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-gray rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-gray rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-gray rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-light-gray hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-light-gray hover:text-primary transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/for-sellers" className="text-light-gray hover:text-primary transition-colors">
                  Seja um Vendedor
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-light-gray hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-light-gray hover:text-primary transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/alimentos" className="text-light-gray hover:text-primary transition-colors">
                  Alimentos
                </Link>
              </li>
              <li>
                <Link to="/products/bebidas" className="text-light-gray hover:text-primary transition-colors">
                  Bebidas
                </Link>
              </li>
              <li>
                <Link to="/products/pet" className="text-light-gray hover:text-primary transition-colors">
                  Pet
                </Link>
              </li>
              <li>
                <Link to="/products/limpeza" className="text-light-gray hover:text-primary transition-colors">
                  Limpeza
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-light-gray hover:text-primary transition-colors">
                  Super Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-light-gray">Email</p>
                  <a
                    href="mailto:contato@uailoop.com.br"
                    className="text-white hover:text-primary transition-colors"
                  >
                    contato@uailoop.com.br
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-light-gray">Telefone</p>
                  <a
                    href="tel:+5531999999999"
                    className="text-white hover:text-primary transition-colors"
                  >
                    (31) 99999-9999
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-light-gray">Endereço</p>
                  <p className="text-white">
                    Belo Horizonte, MG<br />
                    Brasil
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-gray">
        <div className="container-custom px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-light-gray text-sm text-center md:text-left">
              © {currentYear} UaiLoop. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-light-gray hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/terms" className="text-light-gray hover:text-primary transition-colors">
                Termos de Uso
              </Link>
              <Link to="/cookies" className="text-light-gray hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
