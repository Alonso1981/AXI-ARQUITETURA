import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Camera, Layout, FileText, Send, Loader2, AlertCircle, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, limit, query, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useSettings } from '../SettingsContext';
import WhatsAppButton from '../components/WhatsAppButton';
import Editable from '../components/Editable';

interface Style {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
}

import AdminEditStatus from '../components/AdminEditStatus';

export default function Home({ user }: { user: any }) {
  const settings = useSettings();
  const [featuredStyles, setFeaturedStyles] = useState<Style[]>([]);
  const [loadingStyles, setLoadingStyles] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStyles() {
      try {
        const q = query(collection(db, 'styles'), limit(6));
        const querySnapshot = await getDocs(q);
        const stylesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Style[];
        setFeaturedStyles(stylesData);
      } catch (error) {
        console.error("Error fetching styles:", error);
      } finally {
        setLoadingStyles(false);
      }
    }
    fetchStyles();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addDoc(collection(db, 'leads'), {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        city: formData.get('city'),
        projectType: formData.get('projectType'),
        area: formData.get('area'),
        description: formData.get('description'),
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setSubmitSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error submitting lead:", error);
      setSubmitError("Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const processSteps = [
    { id: 1, title: "Entendimento", desc: "Escuta ativa das necessidades e sonhos do cliente.", icon: <MessageCircle size={24} /> },
    { id: 2, title: "Viabilidade", desc: "Estudo técnico do terreno e legislações locais.", icon: <Layout size={24} /> },
    { id: 3, title: "Conceito", desc: "Criação da identidade visual e espacial do projeto.", icon: <FileText size={24} /> },
    { id: 4, title: "Projeto", desc: "Desenvolvimento técnico detalhado e executivo.", icon: <CheckCircle2 size={24} /> },
    { id: 5, title: "Aprovação", desc: "Gestão de trâmites nos órgãos públicos competentes.", icon: <Send size={24} /> },
    { id: 6, title: "Acompanhamento", desc: "Suporte técnico durante a execução da obra.", icon: <Camera size={24} /> },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Editable 
            value={settings.heroImage} 
            onSave={(val) => settings.updateSettings({ heroImage: val })}
            type="image"
            isAdmin={!!user}
            className="w-full h-full"
            editButtonClassName="top-24 right-6 !z-[60]"
          />
          <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pointer-events-none">
          <motion.div 
            drag={!!user}
            dragMomentum={false}
            onDragEnd={(_e, info) => {
              settings.updateSettings({
                heroTitlePosition: {
                  x: (settings.heroTitlePosition?.x || 0) + info.offset.x,
                  y: (settings.heroTitlePosition?.y || 0) + info.offset.y
                }
              });
            }}
            initial={false}
            animate={{ 
              x: settings.heroTitlePosition?.x || 0, 
              y: settings.heroTitlePosition?.y || 0,
              opacity: 1
            }}
            transition={{ duration: 0.8, opacity: { duration: 0.8 } }}
            className={`font-bold tracking-tighter mb-6 pointer-events-auto ${user ? 'cursor-move' : ''}`}
          >
            <Editable 
              key="hero-title"
              value={settings.heroTitle} 
              onSave={(val) => settings.updateSettings({ heroTitle: val })}
              isAdmin={!!user}
              fontSize={settings.heroLogoFontSize}
              onFontSizeChange={(size) => settings.updateSettings({ heroLogoFontSize: size })}
            />
          </motion.div>
          <motion.div 
            drag={!!user}
            dragMomentum={false}
            onDragEnd={(_e, info) => {
              settings.updateSettings({
                taglinePosition: {
                  x: (settings.taglinePosition?.x || 0) + info.offset.x,
                  y: (settings.taglinePosition?.y || 0) + info.offset.y
                }
              });
            }}
            initial={false}
            animate={{ 
              x: settings.taglinePosition?.x || 0, 
              y: settings.taglinePosition?.y || 0,
              opacity: 1
            }}
            transition={{ duration: 0.8, opacity: { duration: 0.8 }, delay: 0.2 }}
            className={`text-xl md:text-3xl font-light tracking-wide mb-12 text-zinc-300 pointer-events-auto ${user ? 'cursor-move' : ''}`}
          >
            <Editable 
              key="hero-tagline"
              value={settings.tagline} 
              onSave={(val) => settings.updateSettings({ tagline: val })}
              isAdmin={!!user}
            />
          </motion.div>
          
          <motion.div 
            drag={!!user}
            dragMomentum={false}
            onDragEnd={(_e, info) => {
              settings.updateSettings({
                heroButtonsPosition: {
                  x: (settings.heroButtonsPosition?.x || 0) + info.offset.x,
                  y: (settings.heroButtonsPosition?.y || 0) + info.offset.y
                }
              });
            }}
            initial={false}
            animate={{ 
              x: settings.heroButtonsPosition?.x || 0, 
              y: settings.heroButtonsPosition?.y || 0,
              opacity: 1
            }}
            transition={{ duration: 0.8, opacity: { duration: 0.8 }, delay: 0.4 }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto ${user ? 'cursor-move' : ''}`}
          >
            <Link to="/portfolio" className="bg-white text-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all w-full md:w-auto">
              Conhecer Projetos
            </Link>
            <Link to="/estilos" className="border border-white/30 backdrop-blur-sm text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all w-full md:w-auto">
              Explorar Estilos
            </Link>
            <Link to="/contato" className="text-white text-sm font-bold uppercase tracking-widest hover:underline underline-offset-8 transition-all">
              Entrar em contato
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-px h-12 bg-white"></div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-400 mb-4">Sobre o Escritório</h2>
            <div className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 leading-tight">
              <Editable 
                value={settings.aboutTitle} 
                onSave={(val) => settings.updateSettings({ aboutTitle: val })}
                isAdmin={!!user}
              />
            </div>
            <div className="text-zinc-600 text-lg leading-relaxed mb-8">
              <Editable 
                value={settings.description} 
                onSave={(val) => settings.updateSettings({ description: val })}
                type="textarea"
                isAdmin={!!user}
              />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="block text-4xl font-bold mb-2">15+</span>
                <span className="text-xs uppercase tracking-widest text-zinc-500">Anos de Experiência</span>
              </div>
              <div>
                <span className="block text-4xl font-bold mb-2">200+</span>
                <span className="text-xs uppercase tracking-widest text-zinc-500">Projetos Executados</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <Editable 
              value={settings.aboutImage} 
              onSave={(val) => settings.updateSettings({ aboutImage: val })}
              type="image"
              isAdmin={!!user}
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Estilos Section */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-400 mb-4">Estilos Arquitetônicos</h2>
              <div className="text-4xl md:text-5xl font-bold tracking-tighter">
                <Editable 
                  value={settings.stylesTitle} 
                  onSave={(val) => settings.updateSettings({ stylesTitle: val })}
                  isAdmin={!!user}
                />
              </div>
            </div>
            <Link to="/estilos" className="group flex items-center space-x-2 text-sm font-bold uppercase tracking-widest">
              <span>Ver todos os estilos</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {loadingStyles ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-zinc-400" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredStyles.map((style, idx) => (
                <motion.div
                  key={style.id || style.slug + idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative aspect-[3/4] overflow-hidden bg-zinc-900 rounded-xl"
                >
                  <img 
                    src={style.images[0]} 
                    alt={style.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    {user && (
                      <Link 
                        to="/admin/estilos" 
                        className="absolute top-4 right-4 p-3 bg-black/60 text-white rounded-full backdrop-blur-md border border-white/20 shadow-xl hover:scale-110 transition-all z-20"
                        title="Editar Estilos"
                      >
                        <Pencil size={18} />
                      </Link>
                    )}
                    <h4 className="text-2xl font-bold text-white mb-2">{style.title}</h4>
                    <p className="text-zinc-300 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {style.description}
                    </p>
                    <Link 
                      to={`/estilos/${style.slug}`}
                      className="text-white text-xs font-bold uppercase tracking-widest flex items-center space-x-2"
                    >
                      <span>Explorar Estilo</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Render Express Section */}
      <section className="py-32 bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-l from-white/20 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-white text-black px-4 py-1 text-[10px] font-bold uppercase tracking-widest mb-6">
                Novo Serviço
              </div>
              <div className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
                <Editable 
                  value={settings.renderExpressTitle} 
                  onSave={(val) => settings.updateSettings({ renderExpressTitle: val })}
                  isAdmin={!!user}
                />
              </div>
              <div className="text-zinc-400 text-lg mb-10">
                <Editable 
                  value={settings.renderExpressDescription} 
                  onSave={(val) => settings.updateSettings({ renderExpressDescription: val })}
                  type="textarea"
                  isAdmin={!!user}
                />
              </div>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center space-x-3 text-zinc-300">
                  <CheckCircle2 size={20} className="text-white" />
                  <span>Envio rápido via WhatsApp</span>
                </li>
                <li className="flex items-center space-x-3 text-zinc-300">
                  <CheckCircle2 size={20} className="text-white" />
                  <span>Estudo de cores e materiais</span>
                </li>
                <li className="flex items-center space-x-3 text-zinc-300">
                  <CheckCircle2 size={20} className="text-white" />
                  <span>Renderização fotorrealista</span>
                </li>
              </ul>
              <a 
                href={`https://wa.me/${settings.whatsapp}?text=Olá! Gostaria de saber mais sobre a Renderização de Fachada Express.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all inline-flex items-center space-x-3"
              >
                <span>Solicitar Agora</span>
                <ArrowRight size={18} />
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Editable 
                  value={settings.renderExpressImage} 
                  onSave={(val) => settings.updateSettings({ renderExpressImage: val })}
                  type="image"
                  isAdmin={!!user}
                  className="w-full h-full"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-2xl text-black shadow-2xl hidden md:block">
                <p className="text-3xl font-bold mb-1 tracking-tighter">48h</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Prazo de Entrega</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-400 mb-4">Metodologia</h2>
            <div className="text-4xl md:text-5xl font-bold tracking-tighter">
              <Editable 
                value={settings.processTitle} 
                onSave={(val) => settings.updateSettings({ processTitle: val })}
                isAdmin={!!user}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {processSteps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 border border-zinc-100 hover:border-zinc-300 transition-colors group"
              >
                <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center rounded-lg mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-zinc-300 mb-2 block">{step.id.toString().padStart(2, '0')}</span>
                <h4 className="text-xl font-bold mb-4">{step.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white p-12 md:p-20 rounded-3xl shadow-xl border border-zinc-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Plano de Necessidades</h2>
              <p className="text-zinc-500">Conte-nos sobre o seu projeto e entraremos em contato com uma proposta personalizada.</p>
            </div>
            
            {submitSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Solicitação Enviada!</h3>
                <p className="text-zinc-500 mb-8">Obrigado pelo contato. Nossa equipe analisará seu plano de necessidades e retornará em breve.</p>
                <button 
                  onClick={() => setSubmitSuccess(false)}
                  className="text-sm font-bold uppercase tracking-widest hover:underline"
                >
                  Enviar outra solicitação
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submitError && (
                  <div className="col-span-1 md:col-span-2 p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center space-x-2">
                    <AlertCircle size={18} />
                    <span>{submitError}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome Completo</label>
                  <input name="name" type="text" className="w-full bg-zinc-50 border-none px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">E-mail</label>
                  <input name="email" type="email" className="w-full bg-zinc-50 border-none px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Telefone</label>
                  <input name="phone" type="tel" className="w-full bg-zinc-50 border-none px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Cidade</label>
                  <input name="city" type="text" className="w-full bg-zinc-50 border-none px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tipo de Projeto</label>
                  <select name="projectType" className="w-full bg-zinc-50 border-none px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none appearance-none">
                    <option>Residencial</option>
                    <option>Comercial</option>
                    <option>Institucional</option>
                    <option>Urbanístico</option>
                    <option>Reforma</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Área Aprox. (m²)</label>
                  <input name="area" type="text" className="w-full bg-zinc-50 border-none px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrição das Necessidades</label>
                  <textarea name="description" rows={4} className="w-full bg-zinc-50 border-none px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none resize-none"></textarea>
                </div>
                <div className="col-span-1 md:col-span-2 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-5 rounded-lg font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <span>Enviar Solicitação</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <WhatsAppButton />

      <AdminEditStatus user={user} />
    </div>
  );
}

// Helper component for icons in processSteps
function MessageCircle({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    </svg>
  );
}
