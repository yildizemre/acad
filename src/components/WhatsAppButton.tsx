import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { SITE } from '../data/site';

const PHONE = SITE.whatsapp;
const MESSAGE = encodeURIComponent(
  'Merhaba! Hype Academia hakkında bilgi almak istiyorum. Ücretsiz deneme dersine nasıl kaydolabilirim?'
);

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const whatsappUrl = `https://wa.me/${PHONE}?text=${MESSAGE}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat bubble */}
      {open && (
        <div className="bg-white rounded-2xl p-4 w-72 bg-night-50 animate-slide-in-right">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="font-bold text-night-900 text-sm">Hype Academia</div>
                <div className="text-xs text-[#25D366] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full" />
                  Çevrimiçi
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-night-400 hover:text-night-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-xl p-3 mb-3">
            <p className="text-night-700 text-sm leading-relaxed">
              Merhaba! Ücretsiz deneme dersimiz veya kurslarımız hakkında bilgi almak ister misiniz?
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            WhatsApp'ta Yaz
          </a>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        aria-label="WhatsApp ile iletişime geç"
      >
        <span className="whatsapp-ring absolute inset-0 rounded-full" />
        {open
          ? <X className="w-6 h-6 text-white relative z-10" />
          : <MessageCircle className="w-7 h-7 text-white fill-white relative z-10" />
        }
      </button>
    </div>
  );
}
