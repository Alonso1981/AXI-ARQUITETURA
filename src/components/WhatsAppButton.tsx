import { MessageCircle } from 'lucide-react';
import { useSettings } from '../SettingsContext';

export default function WhatsAppButton() {
  const settings = useSettings();
  return (
    <a
      href={`https://wa.me/${settings.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 active:scale-95 group"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-4 bg-white text-zinc-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Fale conosco agora!
      </span>
    </a>
  );
}
