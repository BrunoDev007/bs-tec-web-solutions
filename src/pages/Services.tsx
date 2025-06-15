
import React from 'react';
import { Monitor, Laptop, HardDrive, Cpu, Shield, Wrench, Cloud, Clock } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Laptop className="h-12 w-12 text-blue-500" />,
      title: 'Manutenção de Notebooks',
      description: 'Reparo completo de notebooks, incluindo troca de teclado, tela, bateria e componentes internos.',
      features: ['Diagnóstico gratuito', 'Peças originais', 'Garantia de 90 dias']
    },
    {
      icon: <Monitor className="h-12 w-12 text-blue-500" />,
      title: 'Reparo de Computadores Desktop',
      description: 'Manutenção completa de computadores desktop, desde problemas de hardware até otimização de sistema.',
      features: ['Limpeza interna', 'Troca de componentes', 'Otimização de performance']
    },
    {
      icon: <HardDrive className="h-12 w-12 text-blue-500" />,
      title: 'Recuperação de Dados',
      description: 'Recuperação de arquivos importantes em HDs, SSDs e dispositivos de armazenamento danificados.',
      features: ['Análise sem custo', 'Recuperação segura', 'Confidencialidade garantida']
    },
    {
      icon: <Cpu className="h-12 w-12 text-blue-500" />,
      title: 'Upgrade de Hardware',
      description: 'Melhore o desempenho do seu equipamento com upgrades de memória, HD, SSD e placa de vídeo.',
      features: ['Consultoria técnica', 'Instalação profissional', 'Compatibilidade garantida']
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-500" />,
      title: 'Remoção de Vírus e Malware',
      description: 'Limpeza completa do sistema, remoção de vírus, malware e otimização de segurança.',
      features: ['Varredura completa', 'Proteção antivírus', 'Backup de segurança']
    },
    {
      icon: <Wrench className="h-12 w-12 text-blue-500" />,
      title: 'Manutenção Preventiva',
      description: 'Serviços de manutenção preventiva para evitar problemas futuros e prolongar a vida útil.',
      features: ['Limpeza periódica', 'Verificação de componentes', 'Relatório técnico']
    },
    {
      icon: <Cloud className="h-12 w-12 text-blue-500" />,
      title: 'Backup e Migração',
      description: 'Serviços de backup de dados e migração de sistemas para novos equipamentos.',
      features: ['Backup automático', 'Migração segura', 'Sincronização de dados']
    },
    {
      icon: <Clock className="h-12 w-12 text-blue-500" />,
      title: 'Suporte Técnico 24h',
      description: 'Suporte técnico remoto disponível 24 horas para resolver problemas urgentes.',
      features: ['Acesso remoto', 'Disponibilidade 24h', 'Solução imediata']
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Serviços Prestados
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Oferecemos uma ampla gama de serviços técnicos especializados para notebooks e computadores, 
            com qualidade profissional e garantia em todos os trabalhos realizados.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  {service.icon}
                  <h3 className="text-2xl font-bold text-gray-900 ml-4">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Precisa de Algum Destes Serviços?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Entre em contato conosco para um orçamento personalizado e sem compromisso
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contato"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Solicitar Orçamento
            </a>
            <a
              href="/suporte"
              className="border border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Opções de Suporte
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
