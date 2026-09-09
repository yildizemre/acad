// Rezervasyon takvimi ayarı — bileşenden ayrı tutuldu ki hızlı yenileme bozulmasın.
//
//   VITE_CAL_LINK=hypeacademia/deneme-dersi
//
// Boş bırakılırsa iletişim sayfası yalnızca formu gösterir.
export const CAL_LINK = import.meta.env.VITE_CAL_LINK as string | undefined;
export const BOOKING_ENABLED = Boolean(CAL_LINK);
