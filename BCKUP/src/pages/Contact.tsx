import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    motivo: '',
    mensagem: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.motivo.trim()) {
      newErrors.motivo = 'Motivo do contato é obrigatório';
    }

    if (formData.mensagem.length > 600) {
      newErrors.mensagem = 'Mensagem deve ter no máximo 600 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create email content
    const emailSubject = `Contato BS Suporte Tec - ${formData.motivo}`;
    const emailBody = `
Nome: ${formData.nome} ${formData.sobrenome}
E-mail: ${formData.email}
Telefone: ${formData.telefone}
Motivo: ${formData.motivo}

Mensagem:
${formData.mensagem}
    `;

    // Create mailto link
    const mailtoLink = `mailto:bs.suporte.tec@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;

    // Show success message
    toast({
      title: "Formulário enviado!",
      description: "Seu cliente de e-mail foi aberto com a mensagem. Obrigado pelo contato!",
    });

    // Reset form
    setFormData({
      nome: '',
      sobrenome: '',
      email: '',
      telefone: '',
      motivo: '',
      mensagem: ''
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'E-mail',
      info: 'bs.suporte.tec@gmail.com'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Telefone',
      info: '(75) 99982-3459'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Localização',
      info: 'Serrinha, BA'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Horário',
      info: 'Seg-Sex: 8h-18h | Sáb: 8h-12h'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Estamos prontos para ajudar você. Preencha o formulário abaixo ou utilize nossos canais de contato
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Formulário de Contato
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.nome ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="sobrenome" className="block text-sm font-medium text-gray-700 mb-2">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      id="sobrenome"
                      name="sobrenome"
                      value={formData.sobrenome}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Telefone/Celular *
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.telefone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(11) 99999-9999"
                  />
                  {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
                </div>

                <div>
                  <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
                    Qual é o motivo do contato? *
                  </label>
                  <select
                    id="motivo"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.motivo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione o motivo</option>
                    <option value="Orçamento">Solicitar Orçamento</option>
                    <option value="Dúvida Técnica">Dúvida Técnica</option>
                    <option value="Agendamento">Agendamento de Serviço</option>
                    <option value="Suporte">Suporte Técnico</option>
                    <option value="Reclamação">Reclamação</option>
                    <option value="Outros">Outros</option>
                  </select>
                  {errors.motivo && <p className="text-red-500 text-sm mt-1">{errors.motivo}</p>}
                </div>

                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={4}
                    value={formData.mensagem}
                    onChange={handleChange}
                    maxLength={600}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.mensagem ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Descreva sua necessidade ou dúvida..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.mensagem && <p className="text-red-500 text-sm">{errors.mensagem}</p>}
                    <p className="text-gray-500 text-sm ml-auto">
                      {formData.mensagem.length}/600 caracteres
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md font-semibold transition-colors flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Enviar Mensagem
                </button>
              </form>

              <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Aviso:</strong> A BS Suporte Tec garante a privacidade e segurança dos seus dados enviados. 
                  Ao enviar, você aceita nossa política de privacidade e comunicações.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Informações de Contato
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-primary/10 rounded-full p-3 mr-4">
                        <div className="text-primary">
                          {item.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600">{item.info}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-secondary rounded-lg shadow-lg p-8 text-white">
                <h3 className="text-xl font-bold mb-4">
                  Atendimento Rápido
                </h3>
                <p className="mb-4">
                  Para casos urgentes, entre em contato diretamente pelo telefone. 
                  Nosso suporte remoto está disponível 24 horas.
                </p>
                <a
                  href="tel:+5575999823459"
                  className="bg-white text-secondary hover:bg-gray-100 px-6 py-2 rounded-md font-semibold transition-colors inline-block"
                >
                  Ligar Agora
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
