
import React from 'react';
import { Link } from "react-router-dom";
import { Monitor, Wifi, MapPin, Clock, CheckCircle, Phone, } from 'lucide-react';

const Support = () => {
  const presentialFeatures = [
    'Diagnóstico no local',
    'Reparo em domicílio',
    'Instalação de equipamentos',
    'Consultoria presencial',
    'Treinamento de usuários'
  ];

  const remoteFeatures = [
    'Acesso remoto seguro',
    'Resolução imediata',
    'Configuração de sistemas',
    'Instalação de softwares',
    'Suporte técnico online'
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Opções de Suporte
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Escolha a modalidade de atendimento que melhor se adapta às suas necessidades
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Presential Support */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="bg-blue-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Suporte Presencial
                </h2>
                <p className="text-lg text-gray-600">
                  Atendimento técnico no local, com deslocamento da nossa equipe até você
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {presentialFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Horários de Atendimento
                </h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Segunda a Sexta: 8h às 18h</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Sábados: 8h às 12h</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Taxa de deslocamento:</strong> Consulte valores baseados na sua localização. 
                  Atendemos Serrinha e região.
                </p>
              </div>
              <Link
                to="/contato"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center block"
              >
                  Agendar Visita Presencial
              </Link>
            </div>

            {/* Remote Support */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="bg-green-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Wifi className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Suporte Remoto
                </h2>
                <p className="text-lg text-gray-600">
                  Atendimento técnico à distância, com acesso seguro ao seu equipamento
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {remoteFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Disponibilidade
                </h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>24 horas por dia</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>6 dias por semana</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Resposta em até 30 minutos</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-808">
                  <strong>Vantagem:</strong> Solução imediata sem custo de deslocamento. 
                  Ideal para problemas de software e configuração.
                </p>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                Iniciar Suporte Remoto
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-gray-600">
              Processo simples e eficiente para resolver seus problemas técnicos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Contato Inicial
              </h3>
              <p className="text-gray-600">
                Entre em contato conosco via telefone, WhatsApp ou formulário
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Diagnóstico
              </h3>
              <p className="text-gray-600">
                Avaliação inicial do problema e definição da melhor abordagem
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Execução
              </h3>
              <p className="text-gray-600">
                Realização do serviço com acompanhamento em tempo real
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Finalização
              </h3>
              <p className="text-gray-600">
                Teste final, orientações e garantia do serviço realizado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Precisa de Suporte Agora?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Nossa equipe está pronta para ajudar você
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contato"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Entrar em Contato
            </Link>
            <a
              href="tel:+5575999823459"
              className="border border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ligar Agora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;
