
import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Wrench, Shield, Clock, CheckCircle, Star } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Wrench className="h-8 w-8 text-blue-400" />,
      title: 'Manutenção Especializada',
      description: 'Técnicos qualificados para reparo de notebooks e computadores'
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-400" />,
      title: 'Garantia de Qualidade',
      description: 'Todos os serviços com garantia e peças originais'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-400" />,
      title: 'Atendimento Rápido',
      description: 'Diagnóstico ágil e soluções eficientes'
    }
  ];

  const services = [
    'Reparo de Notebooks',
    'Manutenção de Computadores',
    'Troca de Telas',
    'Upgrade de Hardware',
    'Limpeza Interna',
    'Recuperação de Dados'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              BS Suporte Tec
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Especialistas em Manutenção de Notebooks e Computadores
            </p>
            <p className="text-lg text-gray-400 mb-10 max-w-3xl mx-auto">
              Soluções técnicas profissionais para seus equipamentos. 
              Atendimento especializado, qualidade garantida e preços justos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contato"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Solicitar Orçamento
              </Link>
              <Link
                to="/servicos"
                className="border border-gray-300 hover:bg-white hover:text-slate-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver Serviços
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher a BS Suporte Tec?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Principais Serviços
            </h2>
            <p className="text-lg text-gray-600">
              Oferecemos uma ampla gama de serviços técnicos especializados
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{service}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/servicos"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Todos os Serviços
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Precisa de Suporte Técnico?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Entre em contato conosco e receba um orçamento personalizado
          </p>
          <Link
            to="/contato"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Falar Conosco
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
