import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { track } from '../../lib/analytics';
import { SITE, waLink } from '../../data/site';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  /** Önceden yazılmış WhatsApp mesajı */
  message?: string;
  /** Olayın hangi bölümden geldiğini panelde ayırt edebilmek için */
  source: string;
}

/** WhatsApp bağlantısı — tıklamayı analitiğe bildirir. */
export function WhatsAppLink({ children, message, source, ...rest }: Props) {
  return (
    <a
      {...rest}
      href={message ? waLink(message) : waLink('Merhaba, bilgi almak istiyorum.')}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_tiklandi', { source })}
    >
      {children}
    </a>
  );
}

/** Telefon bağlantısı — tıklamayı analitiğe bildirir. */
export function PhoneLink({
  children,
  source,
  ...rest
}: Omit<Props, 'message'>) {
  return (
    <a
      {...rest}
      href={`tel:${SITE.phoneIntl}`}
      onClick={() => track('telefon_tiklandi', { source })}
    >
      {children}
    </a>
  );
}
