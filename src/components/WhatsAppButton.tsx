import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function WhatsAppButton() {
  const [tooltip, setTooltip] = useState(false);

  const phoneNumber = '905001234567';
  const message = encodeURIComponent(
    'Merhaba! Hype Academia hakkında bilgi almak istiyorum. Ücretsiz deneme dersine nasıl kaydolabilirim?'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      {tooltip && (
        <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-xs border border-gray-100 animate-slide-in-right">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">Hype Academia</div>
                <div className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                  Çevrimiçi
                </div>
              </div>
            </div>
            <button
              onClick={() => setTooltip(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Merhaba! Ücretsiz deneme dersimiz hakkında bilgi almak ister misiniz?
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#25D366] text-white text-center text-sm font-semibold py-2.5 rounded-xl hover:bg-[#1fb855] transition-colors"
          >
            Sohbet Başlat
          </a>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setTooltip(!tooltip)}
        className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
        aria-label="WhatsApp destek"
      >
        <span className="whatsapp-ring absolute inset-0 rounded-full" />
        <MessageCircle className="w-7 h-7 text-white fill-white relative z-10" />
      </button>
    </div>
  );
}
