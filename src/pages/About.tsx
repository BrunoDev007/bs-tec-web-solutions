import React from 'react';
import { Monitor, Users, Award, Clock, Facebook, Instagram } from 'lucide-react';
import { MessageCircle } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Users className="h-8 w-8" />, number: '500+', label: 'Clientes Atendidos' },
    { icon: <Award className="h-8 w-8" />, number: '5+', label: 'Anos de Experiência' },
    { icon: <Clock className="h-8 w-8" />, number: '24h', label: 'Suporte Disponível' },
    { icon: <Monitor className="h-8 w-8" />, number: '1000+', label: 'Equipamentos Reparados' }
  ];

  const values = [
    {
      title: 'Qualidade',
      description: 'Utilizamos apenas peças originais e oferecemos garantia em todos os nossos serviços.'
    },
    {
      title: 'Confiança',
      description: 'Transparência em todos os processos, desde o diagnóstico até a entrega do equipamento.'
    },
    {
      title: 'Agilidade',
      description: 'Diagnóstico rápido e soluções eficientes para minimizar o tempo sem seu equipamento.'
    },
    {
      title: 'Suporte',
      description: 'Atendimento personalizado e suporte contínuo mesmo após a conclusão do serviço.'
    }
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = '5575999823459'; // Número com código do país e DDD
    const message = 'Olá! Vim através do site e gostaria de saber mais sobre os serviços da BS Suporte Tec.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen pt-16 relative">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Quem Somos
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Conheça a BS Suporte Tec e nossa história de dedicação ao suporte técnico especializado
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A BS Suporte Tec nasceu da paixão pela tecnologia e do desejo de oferecer 
                soluções técnicas de qualidade para notebooks e computadores. Fundada por 
                profissionais experientes no ramo da informática, nossa empresa se consolidou 
                como referência em manutenção e suporte técnico.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Ao longo dos anos, desenvolvemos expertise em diversas marcas e modelos, 
                sempre priorizando a qualidade do atendimento, a transparência nos processos 
                e a satisfação de nossos clientes.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nossa missão é proporcionar soluções técnicas eficientes, prolongando a 
                vida útil de seus equipamentos e garantindo seu melhor desempenho.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Nossos Números
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center text-blue-600 mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <p className="text-lg text-gray-600">
              Os princípios que norteiam nosso trabalho e relacionamento com clientes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Siga-nos nas Redes Sociais
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Fique por dentro das novidades e dicas técnicas
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://facebook.com/bssuportetec"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 p-4 rounded-full hover:bg-gray-100 transition-colors group"
            >
              <Facebook className="h-8 w-8 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="https://instagram.com/bssuportetec"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 p-4 rounded-full hover:bg-gray-100 transition-colors group"
            >
              <Instagram className="h-8 w-8 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 hover:scale-110"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default About;
