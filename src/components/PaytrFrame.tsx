import { useEffect, useRef } from 'react';
import { PAYTR_IFRAME_URL, PAYTR_RESIZER } from '../lib/payment';

/**
 * PayTR ödeme formu.
 *
 * Kart bilgileri bu iframe'in içinde, PayTR'ın alan adında girilir; bizim
 * sayfamıza hiç değmez. Bu yüzden kart verisi için PCI yükümlülüğümüz doğmaz —
 * ve bunu sözleşmelerde de böyle yazıyoruz.
 *
 * Yükseklik: form adımına göre değişir (kart → 3D Secure → sonuç). PayTR'ın
 * iframeResizer betiği yüksekliği içeriğe göre ayarlar; betik yüklenemezse
 * makul bir asgari yükseklikle yine de kullanılabilir kalır.
 */

declare global {
  interface Window {
    iFrameResize?: (secenekler: Record<string, unknown>, hedef: string) => void;
  }
}

export default function PaytrFrame({ token }: { token: string }) {
  const kuruldu = useRef(false);

  useEffect(() => {
    // Sayfa tekrar boyandığında betiği ikinci kez eklemiyoruz.
    if (kuruldu.current) return;
    kuruldu.current = true;

    const calistir = () => {
      try {
        window.iFrameResize?.({ checkOrigin: false }, '#paytriframe');
      } catch {
        /* boyutlandırma çalışmazsa iframe sabit yükseklikle kalır */
      }
    };

    const mevcut = document.querySelector<HTMLScriptElement>(
      `script[src="${PAYTR_RESIZER}"]`,
    );
    if (mevcut) {
      calistir();
      return;
    }

    const betik = document.createElement('script');
    betik.src = PAYTR_RESIZER;
    betik.async = true;
    betik.onload = calistir;
    document.body.appendChild(betik);
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-night-100">
      <iframe
        id="paytriframe"
        title="PayTR güvenli ödeme formu"
        src={`${PAYTR_IFRAME_URL}/${token}`}
        frameBorder={0}
        scrolling="no"
        className="block w-full"
        style={{ minHeight: 560 }}
      />
    </div>
  );
}
