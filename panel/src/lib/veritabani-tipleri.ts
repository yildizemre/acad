export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ders_ilerleme: {
        Row: {
          ders_id: string
          gecirilen_sn: number
          ogrenci_id: string
          son_erisim: string
          tamamlandi: boolean
          yuzde: number
        }
        Insert: {
          ders_id: string
          gecirilen_sn?: number
          ogrenci_id: string
          son_erisim?: string
          tamamlandi?: boolean
          yuzde?: number
        }
        Update: {
          ders_id?: string
          gecirilen_sn?: number
          ogrenci_id?: string
          son_erisim?: string
          tamamlandi?: boolean
          yuzde?: number
        }
        Relationships: [
          {
            foreignKeyName: "ders_ilerleme_ders_id_fkey"
            columns: ["ders_id"]
            isOneToOne: false
            referencedRelation: "dersler"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ders_ilerleme_ogrenci_id_fkey"
            columns: ["ogrenci_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      ders_materyalleri: {
        Row: {
          aciklama: string | null
          baslik: string
          ders_id: string | null
          dis_baglanti: string | null
          dosya_yolu: string | null
          id: string
          olusturuldu: string
          sinif_id: string | null
          tur: Database["public"]["Enums"]["materyal_turu"]
          yukleyen_id: string | null
        }
        Insert: {
          aciklama?: string | null
          baslik: string
          ders_id?: string | null
          dis_baglanti?: string | null
          dosya_yolu?: string | null
          id?: string
          olusturuldu?: string
          sinif_id?: string | null
          tur?: Database["public"]["Enums"]["materyal_turu"]
          yukleyen_id?: string | null
        }
        Update: {
          aciklama?: string | null
          baslik?: string
          ders_id?: string | null
          dis_baglanti?: string | null
          dosya_yolu?: string | null
          id?: string
          olusturuldu?: string
          sinif_id?: string | null
          tur?: Database["public"]["Enums"]["materyal_turu"]
          yukleyen_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ders_materyalleri_ders_id_fkey"
            columns: ["ders_id"]
            isOneToOne: false
            referencedRelation: "dersler"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ders_materyalleri_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "sinif_ozet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ders_materyalleri_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "siniflar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ders_materyalleri_yukleyen_id_fkey"
            columns: ["yukleyen_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      dersler: {
        Row: {
          aciklama: string | null
          baslik: string
          hafta: number | null
          id: string
          kurs_id: string
          olusturuldu: string
          sinif_id: string | null
          sira: number
          video_url: string | null
          yayinda: boolean
        }
        Insert: {
          aciklama?: string | null
          baslik: string
          hafta?: number | null
          id?: string
          kurs_id: string
          olusturuldu?: string
          sinif_id?: string | null
          sira?: number
          video_url?: string | null
          yayinda?: boolean
        }
        Update: {
          aciklama?: string | null
          baslik?: string
          hafta?: number | null
          id?: string
          kurs_id?: string
          olusturuldu?: string
          sinif_id?: string | null
          sira?: number
          video_url?: string | null
          yayinda?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "dersler_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dersler_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "sinif_ozet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dersler_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "siniflar"
            referencedColumns: ["id"]
          },
        ]
      }
      duyurular: {
        Row: {
          baslik: string
          icerik: string
          id: string
          kurs_id: string | null
          olusturan_id: string | null
          olusturuldu: string
          onemli: boolean
          sinif_id: string | null
          yayinda: boolean
        }
        Insert: {
          baslik: string
          icerik: string
          id?: string
          kurs_id?: string | null
          olusturan_id?: string | null
          olusturuldu?: string
          onemli?: boolean
          sinif_id?: string | null
          yayinda?: boolean
        }
        Update: {
          baslik?: string
          icerik?: string
          id?: string
          kurs_id?: string | null
          olusturan_id?: string | null
          olusturuldu?: string
          onemli?: boolean
          sinif_id?: string | null
          yayinda?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "duyurular_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duyurular_olusturan_id_fkey"
            columns: ["olusturan_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duyurular_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "sinif_ozet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duyurular_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "siniflar"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_konulari: {
        Row: {
          baslik: string
          forum_id: string
          icerik: string
          id: string
          kilitli: boolean
          olusturuldu: string
          yazar_id: string
        }
        Insert: {
          baslik: string
          forum_id: string
          icerik: string
          id?: string
          kilitli?: boolean
          olusturuldu?: string
          yazar_id: string
        }
        Update: {
          baslik?: string
          forum_id?: string
          icerik?: string
          id?: string
          kilitli?: boolean
          olusturuldu?: string
          yazar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_konulari_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "forumlar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_konulari_yazar_id_fkey"
            columns: ["yazar_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_yanitlari: {
        Row: {
          icerik: string
          id: string
          konu_id: string
          olusturuldu: string
          yazar_id: string
        }
        Insert: {
          icerik: string
          id?: string
          konu_id: string
          olusturuldu?: string
          yazar_id: string
        }
        Update: {
          icerik?: string
          id?: string
          konu_id?: string
          olusturuldu?: string
          yazar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_yanitlari_konu_id_fkey"
            columns: ["konu_id"]
            isOneToOne: false
            referencedRelation: "forum_konulari"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_yanitlari_yazar_id_fkey"
            columns: ["yazar_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      forumlar: {
        Row: {
          aciklama: string | null
          baslik: string
          id: string
          kurs_id: string | null
          olusturuldu: string
          sinif_id: string | null
        }
        Insert: {
          aciklama?: string | null
          baslik: string
          id?: string
          kurs_id?: string | null
          olusturuldu?: string
          sinif_id?: string | null
        }
        Update: {
          aciklama?: string | null
          baslik?: string
          id?: string
          kurs_id?: string | null
          olusturuldu?: string
          sinif_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forumlar_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forumlar_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "sinif_ozet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forumlar_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "siniflar"
            referencedColumns: ["id"]
          },
        ]
      }
      katilim: {
        Row: {
          etkinlik_id: string
          isaretleyen: string | null
          katildi: boolean
          not_dusuldu: string | null
          ogrenci_id: string
        }
        Insert: {
          etkinlik_id: string
          isaretleyen?: string | null
          katildi?: boolean
          not_dusuldu?: string | null
          ogrenci_id: string
        }
        Update: {
          etkinlik_id?: string
          isaretleyen?: string | null
          katildi?: boolean
          not_dusuldu?: string | null
          ogrenci_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "katilim_etkinlik_id_fkey"
            columns: ["etkinlik_id"]
            isOneToOne: false
            referencedRelation: "takvim"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "katilim_isaretleyen_fkey"
            columns: ["isaretleyen"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "katilim_ogrenci_id_fkey"
            columns: ["ogrenci_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      kayitlar: {
        Row: {
          bitis_tarihi: string | null
          id: string
          ilerleme: number
          kayit_tarihi: string
          kurs_id: string
          ogrenci_id: string
          siparis_no: string | null
          tamamlandi: boolean
        }
        Insert: {
          bitis_tarihi?: string | null
          id?: string
          ilerleme?: number
          kayit_tarihi?: string
          kurs_id: string
          ogrenci_id: string
          siparis_no?: string | null
          tamamlandi?: boolean
        }
        Update: {
          bitis_tarihi?: string | null
          id?: string
          ilerleme?: number
          kayit_tarihi?: string
          kurs_id?: string
          ogrenci_id?: string
          siparis_no?: string | null
          tamamlandi?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "kayitlar_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kayitlar_ogrenci_id_fkey"
            columns: ["ogrenci_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      kurs_haftalari: {
        Row: {
          baslik: string
          hafta: number
          id: string
          konular: string[]
          kurs_id: string
          proje: string | null
        }
        Insert: {
          baslik: string
          hafta: number
          id?: string
          konular?: string[]
          kurs_id: string
          proje?: string | null
        }
        Update: {
          baslik?: string
          hafta?: number
          id?: string
          konular?: string[]
          kurs_id?: string
          proje?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kurs_haftalari_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
        ]
      }
      kurslar: {
        Row: {
          aciklama: string | null
          baslik: string
          ders_dakika: number
          durum: Database["public"]["Enums"]["kurs_durumu"]
          gorsel_url: string | null
          hafta_sayisi: number
          haftalik_ders: number
          id: string
          olusturuldu: string
          seviye: string | null
          slug: string
          yas_araligi: string | null
        }
        Insert: {
          aciklama?: string | null
          baslik: string
          ders_dakika?: number
          durum?: Database["public"]["Enums"]["kurs_durumu"]
          gorsel_url?: string | null
          hafta_sayisi?: number
          haftalik_ders?: number
          id?: string
          olusturuldu?: string
          seviye?: string | null
          slug: string
          yas_araligi?: string | null
        }
        Update: {
          aciklama?: string | null
          baslik?: string
          ders_dakika?: number
          durum?: Database["public"]["Enums"]["kurs_durumu"]
          gorsel_url?: string | null
          hafta_sayisi?: number
          haftalik_ders?: number
          id?: string
          olusturuldu?: string
          seviye?: string | null
          slug?: string
          yas_araligi?: string | null
        }
        Relationships: []
      }
      kutuphane: {
        Row: {
          aciklama: string | null
          baslik: string
          boyut_bayt: number | null
          dis_baglanti: string | null
          dosya_yolu: string | null
          etiketler: string[]
          id: string
          kurs_id: string | null
          olusturuldu: string
          tur: Database["public"]["Enums"]["materyal_turu"]
          yukleyen_id: string | null
        }
        Insert: {
          aciklama?: string | null
          baslik: string
          boyut_bayt?: number | null
          dis_baglanti?: string | null
          dosya_yolu?: string | null
          etiketler?: string[]
          id?: string
          kurs_id?: string | null
          olusturuldu?: string
          tur?: Database["public"]["Enums"]["materyal_turu"]
          yukleyen_id?: string | null
        }
        Update: {
          aciklama?: string | null
          baslik?: string
          boyut_bayt?: number | null
          dis_baglanti?: string | null
          dosya_yolu?: string | null
          etiketler?: string[]
          id?: string
          kurs_id?: string | null
          olusturuldu?: string
          tur?: Database["public"]["Enums"]["materyal_turu"]
          yukleyen_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kutuphane_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kutuphane_yukleyen_id_fkey"
            columns: ["yukleyen_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      mesajlar: {
        Row: {
          alici_id: string
          gonderen_id: string
          icerik: string
          id: string
          konu: string
          okundu: boolean
          olusturuldu: string
        }
        Insert: {
          alici_id: string
          gonderen_id: string
          icerik: string
          id?: string
          konu: string
          okundu?: boolean
          olusturuldu?: string
        }
        Update: {
          alici_id?: string
          gonderen_id?: string
          icerik?: string
          id?: string
          konu?: string
          okundu?: boolean
          olusturuldu?: string
        }
        Relationships: [
          {
            foreignKeyName: "mesajlar_alici_id_fkey"
            columns: ["alici_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mesajlar_gonderen_id_fkey"
            columns: ["gonderen_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      odev_teslimleri: {
        Row: {
          degerlendiren: string | null
          degerlendirme_tarihi: string | null
          dosya_yolu: string | null
          geri_bildirim: string | null
          id: string
          metin: string | null
          odev_id: string
          ogrenci_id: string
          puan: number | null
          teslim_tarihi: string
        }
        Insert: {
          degerlendiren?: string | null
          degerlendirme_tarihi?: string | null
          dosya_yolu?: string | null
          geri_bildirim?: string | null
          id?: string
          metin?: string | null
          odev_id: string
          ogrenci_id: string
          puan?: number | null
          teslim_tarihi?: string
        }
        Update: {
          degerlendiren?: string | null
          degerlendirme_tarihi?: string | null
          dosya_yolu?: string | null
          geri_bildirim?: string | null
          id?: string
          metin?: string | null
          odev_id?: string
          ogrenci_id?: string
          puan?: number | null
          teslim_tarihi?: string
        }
        Relationships: [
          {
            foreignKeyName: "odev_teslimleri_degerlendiren_fkey"
            columns: ["degerlendiren"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "odev_teslimleri_odev_id_fkey"
            columns: ["odev_id"]
            isOneToOne: false
            referencedRelation: "odevler"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "odev_teslimleri_ogrenci_id_fkey"
            columns: ["ogrenci_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      odevler: {
        Row: {
          aciklama: string | null
          baslik: string
          ders_id: string | null
          ek_dosya: string | null
          id: string
          kurs_id: string | null
          max_puan: number
          olusturan_id: string | null
          olusturuldu: string
          sinif_id: string | null
          son_tarih: string | null
          yayinda: boolean
        }
        Insert: {
          aciklama?: string | null
          baslik: string
          ders_id?: string | null
          ek_dosya?: string | null
          id?: string
          kurs_id?: string | null
          max_puan?: number
          olusturan_id?: string | null
          olusturuldu?: string
          sinif_id?: string | null
          son_tarih?: string | null
          yayinda?: boolean
        }
        Update: {
          aciklama?: string | null
          baslik?: string
          ders_id?: string | null
          ek_dosya?: string | null
          id?: string
          kurs_id?: string | null
          max_puan?: number
          olusturan_id?: string | null
          olusturuldu?: string
          sinif_id?: string | null
          son_tarih?: string | null
          yayinda?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "odevler_ders_id_fkey"
            columns: ["ders_id"]
            isOneToOne: false
            referencedRelation: "dersler"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "odevler_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "odevler_olusturan_id_fkey"
            columns: ["olusturan_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "odevler_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "sinif_ozet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "odevler_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "siniflar"
            referencedColumns: ["id"]
          },
        ]
      }
      profiller: {
        Row: {
          ad_soyad: string
          aktif: boolean
          avatar_url: string | null
          dogum_tarihi: string | null
          eposta: string
          id: string
          kayit_tarihi: string
          kullanici_adi: string
          olusturuldu: string
          rol: Database["public"]["Enums"]["rol"]
          telefon: string | null
          veli_adi: string | null
          veli_telefon: string | null
          yetkinlik: string | null
        }
        Insert: {
          ad_soyad: string
          aktif?: boolean
          avatar_url?: string | null
          dogum_tarihi?: string | null
          eposta: string
          id: string
          kayit_tarihi?: string
          kullanici_adi: string
          olusturuldu?: string
          rol?: Database["public"]["Enums"]["rol"]
          telefon?: string | null
          veli_adi?: string | null
          veli_telefon?: string | null
          yetkinlik?: string | null
        }
        Update: {
          ad_soyad?: string
          aktif?: boolean
          avatar_url?: string | null
          dogum_tarihi?: string | null
          eposta?: string
          id?: string
          kayit_tarihi?: string
          kullanici_adi?: string
          olusturuldu?: string
          rol?: Database["public"]["Enums"]["rol"]
          telefon?: string | null
          veli_adi?: string | null
          veli_telefon?: string | null
          yetkinlik?: string | null
        }
        Relationships: []
      }
      sertifikalar: {
        Row: {
          belge_no: string
          dosya_yolu: string | null
          id: string
          kurs_id: string
          ogrenci_id: string
          veren_id: string | null
          verilis: string
        }
        Insert: {
          belge_no: string
          dosya_yolu?: string | null
          id?: string
          kurs_id: string
          ogrenci_id: string
          veren_id?: string | null
          verilis?: string
        }
        Update: {
          belge_no?: string
          dosya_yolu?: string | null
          id?: string
          kurs_id?: string
          ogrenci_id?: string
          veren_id?: string | null
          verilis?: string
        }
        Relationships: [
          {
            foreignKeyName: "sertifikalar_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sertifikalar_ogrenci_id_fkey"
            columns: ["ogrenci_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sertifikalar_veren_id_fkey"
            columns: ["veren_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      sinav_cevaplari: {
        Row: {
          id: string
          metin: string | null
          puan: number | null
          secenek_id: string | null
          soru_id: string
          teslim_id: string
        }
        Insert: {
          id?: string
          metin?: string | null
          puan?: number | null
          secenek_id?: string | null
          soru_id: string
          teslim_id: string
        }
        Update: {
          id?: string
          metin?: string | null
          puan?: number | null
          secenek_id?: string | null
          soru_id?: string
          teslim_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sinav_cevaplari_secenek_id_fkey"
            columns: ["secenek_id"]
            isOneToOne: false
            referencedRelation: "sinav_secenekleri"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinav_cevaplari_secenek_id_fkey"
            columns: ["secenek_id"]
            isOneToOne: false
            referencedRelation: "sinav_secenekleri_ogrenci"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinav_cevaplari_soru_id_fkey"
            columns: ["soru_id"]
            isOneToOne: false
            referencedRelation: "sinav_sorulari"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinav_cevaplari_soru_id_fkey"
            columns: ["soru_id"]
            isOneToOne: false
            referencedRelation: "sinav_sorulari_ogrenci"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinav_cevaplari_teslim_id_fkey"
            columns: ["teslim_id"]
            isOneToOne: false
            referencedRelation: "sinav_teslimleri"
            referencedColumns: ["id"]
          },
        ]
      }
      sinav_secenekleri: {
        Row: {
          dogru_mu: boolean
          id: string
          metin: string
          sira: number
          soru_id: string
        }
        Insert: {
          dogru_mu?: boolean
          id?: string
          metin: string
          sira?: number
          soru_id: string
        }
        Update: {
          dogru_mu?: boolean
          id?: string
          metin?: string
          sira?: number
          soru_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sinav_secenekleri_soru_id_fkey"
            columns: ["soru_id"]
            isOneToOne: false
            referencedRelation: "sinav_sorulari"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinav_secenekleri_soru_id_fkey"
            columns: ["soru_id"]
            isOneToOne: false
            referencedRelation: "sinav_sorulari_ogrenci"
            referencedColumns: ["id"]
          },
        ]
      }
      sinav_sorulari: {
        Row: {
          dogru_cevap: string | null
          havuz_id: string | null
          id: string
          puan: number
          sinav_id: string
          sira: number
          soru: string
          tur: Database["public"]["Enums"]["soru_turu"]
        }
        Insert: {
          dogru_cevap?: string | null
          havuz_id?: string | null
          id?: string
          puan?: number
          sinav_id: string
          sira?: number
          soru: string
          tur?: Database["public"]["Enums"]["soru_turu"]
        }
        Update: {
          dogru_cevap?: string | null
          havuz_id?: string | null
          id?: string
          puan?: number
          sinav_id?: string
          sira?: number
          soru?: string
          tur?: Database["public"]["Enums"]["soru_turu"]
        }
        Relationships: [
          {
            foreignKeyName: "sinav_sorulari_havuz_id_fkey"
            columns: ["havuz_id"]
            isOneToOne: false
            referencedRelation: "soru_havuzu"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinav_sorulari_sinav_id_fkey"
            columns: ["sinav_id"]
            isOneToOne: false
            referencedRelation: "sinavlar"
            referencedColumns: ["id"]
          },
        ]
      }
      sinav_teslimleri: {
        Row: {
          baslama: string
          degerlendirildi: boolean
          id: string
          max_puan: number | null
          ogrenci_id: string
          puan: number | null
          sinav_id: string
          teslim: string | null
        }
        Insert: {
          baslama?: string
          degerlendirildi?: boolean
          id?: string
          max_puan?: number | null
          ogrenci_id: string
          puan?: number | null
          sinav_id: string
          teslim?: string | null
        }
        Update: {
          baslama?: string
          degerlendirildi?: boolean
          id?: string
          max_puan?: number | null
          ogrenci_id?: string
          puan?: number | null
          sinav_id?: string
          teslim?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sinav_teslimleri_ogrenci_id_fkey"
            columns: ["ogrenci_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinav_teslimleri_sinav_id_fkey"
            columns: ["sinav_id"]
            isOneToOne: false
            referencedRelation: "sinavlar"
            referencedColumns: ["id"]
          },
        ]
      }
      sinavlar: {
        Row: {
          aciklama: string | null
          baslangic: string | null
          baslik: string
          bitis: string | null
          gecme_puani: number
          id: string
          kurs_id: string | null
          olusturan_id: string | null
          olusturuldu: string
          sinif_id: string | null
          sure_dakika: number
          yayinda: boolean
        }
        Insert: {
          aciklama?: string | null
          baslangic?: string | null
          baslik: string
          bitis?: string | null
          gecme_puani?: number
          id?: string
          kurs_id?: string | null
          olusturan_id?: string | null
          olusturuldu?: string
          sinif_id?: string | null
          sure_dakika?: number
          yayinda?: boolean
        }
        Update: {
          aciklama?: string | null
          baslangic?: string | null
          baslik?: string
          bitis?: string | null
          gecme_puani?: number
          id?: string
          kurs_id?: string | null
          olusturan_id?: string | null
          olusturuldu?: string
          sinif_id?: string | null
          sure_dakika?: number
          yayinda?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "sinavlar_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinavlar_olusturan_id_fkey"
            columns: ["olusturan_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinavlar_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "sinif_ozet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinavlar_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "siniflar"
            referencedColumns: ["id"]
          },
        ]
      }
      sinif_ogrencileri: {
        Row: {
          eklendi: string
          ogrenci_id: string
          sinif_id: string
        }
        Insert: {
          eklendi?: string
          ogrenci_id: string
          sinif_id: string
        }
        Update: {
          eklendi?: string
          ogrenci_id?: string
          sinif_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sinif_ogrencileri_ogrenci_id_fkey"
            columns: ["ogrenci_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinif_ogrencileri_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "sinif_ozet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinif_ogrencileri_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "siniflar"
            referencedColumns: ["id"]
          },
        ]
      }
      siniflar: {
        Row: {
          aciklama: string | null
          ad: string
          aktif: boolean
          baslangic: string | null
          bitis: string | null
          egitmen_id: string | null
          id: string
          kontenjan: number
          kurs_id: string | null
          olusturuldu: string
          zoom_url: string | null
        }
        Insert: {
          aciklama?: string | null
          ad: string
          aktif?: boolean
          baslangic?: string | null
          bitis?: string | null
          egitmen_id?: string | null
          id?: string
          kontenjan?: number
          kurs_id?: string | null
          olusturuldu?: string
          zoom_url?: string | null
        }
        Update: {
          aciklama?: string | null
          ad?: string
          aktif?: boolean
          baslangic?: string | null
          bitis?: string | null
          egitmen_id?: string | null
          id?: string
          kontenjan?: number
          kurs_id?: string | null
          olusturuldu?: string
          zoom_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "siniflar_egitmen_id_fkey"
            columns: ["egitmen_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siniflar_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
        ]
      }
      soru_havuzu: {
        Row: {
          dogru_cevap: string | null
          etiketler: string[]
          id: string
          kurs_id: string | null
          olusturan_id: string | null
          olusturuldu: string
          puan: number
          soru: string
          tur: Database["public"]["Enums"]["soru_turu"]
        }
        Insert: {
          dogru_cevap?: string | null
          etiketler?: string[]
          id?: string
          kurs_id?: string | null
          olusturan_id?: string | null
          olusturuldu?: string
          puan?: number
          soru: string
          tur?: Database["public"]["Enums"]["soru_turu"]
        }
        Update: {
          dogru_cevap?: string | null
          etiketler?: string[]
          id?: string
          kurs_id?: string | null
          olusturan_id?: string | null
          olusturuldu?: string
          puan?: number
          soru?: string
          tur?: Database["public"]["Enums"]["soru_turu"]
        }
        Relationships: [
          {
            foreignKeyName: "soru_havuzu_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soru_havuzu_olusturan_id_fkey"
            columns: ["olusturan_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      soru_secenekleri: {
        Row: {
          dogru_mu: boolean
          id: string
          metin: string
          sira: number
          soru_id: string
        }
        Insert: {
          dogru_mu?: boolean
          id?: string
          metin: string
          sira?: number
          soru_id: string
        }
        Update: {
          dogru_mu?: boolean
          id?: string
          metin?: string
          sira?: number
          soru_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "soru_secenekleri_soru_id_fkey"
            columns: ["soru_id"]
            isOneToOne: false
            referencedRelation: "soru_havuzu"
            referencedColumns: ["id"]
          },
        ]
      }
      takvim: {
        Row: {
          aciklama: string | null
          baslangic: string
          baslik: string
          bitis: string
          ders_id: string | null
          id: string
          kurs_id: string | null
          olusturan_id: string | null
          olusturuldu: string
          sinif_id: string | null
          tur: Database["public"]["Enums"]["etkinlik_turu"]
          zoom_url: string | null
        }
        Insert: {
          aciklama?: string | null
          baslangic: string
          baslik: string
          bitis: string
          ders_id?: string | null
          id?: string
          kurs_id?: string | null
          olusturan_id?: string | null
          olusturuldu?: string
          sinif_id?: string | null
          tur?: Database["public"]["Enums"]["etkinlik_turu"]
          zoom_url?: string | null
        }
        Update: {
          aciklama?: string | null
          baslangic?: string
          baslik?: string
          bitis?: string
          ders_id?: string | null
          id?: string
          kurs_id?: string | null
          olusturan_id?: string | null
          olusturuldu?: string
          sinif_id?: string | null
          tur?: Database["public"]["Enums"]["etkinlik_turu"]
          zoom_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "takvim_ders_id_fkey"
            columns: ["ders_id"]
            isOneToOne: false
            referencedRelation: "dersler"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "takvim_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "takvim_olusturan_id_fkey"
            columns: ["olusturan_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "takvim_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "sinif_ozet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "takvim_sinif_id_fkey"
            columns: ["sinif_id"]
            isOneToOne: false
            referencedRelation: "siniflar"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      sinav_secenekleri_ogrenci: {
        Row: {
          id: string | null
          metin: string | null
          sira: number | null
          soru_id: string | null
        }
        Insert: {
          id?: string | null
          metin?: string | null
          sira?: number | null
          soru_id?: string | null
        }
        Update: {
          id?: string | null
          metin?: string | null
          sira?: number | null
          soru_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sinav_secenekleri_soru_id_fkey"
            columns: ["soru_id"]
            isOneToOne: false
            referencedRelation: "sinav_sorulari"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinav_secenekleri_soru_id_fkey"
            columns: ["soru_id"]
            isOneToOne: false
            referencedRelation: "sinav_sorulari_ogrenci"
            referencedColumns: ["id"]
          },
        ]
      }
      sinav_sorulari_ogrenci: {
        Row: {
          id: string | null
          puan: number | null
          sinav_id: string | null
          sira: number | null
          soru: string | null
          tur: Database["public"]["Enums"]["soru_turu"] | null
        }
        Relationships: [
          {
            foreignKeyName: "sinav_sorulari_sinav_id_fkey"
            columns: ["sinav_id"]
            isOneToOne: false
            referencedRelation: "sinavlar"
            referencedColumns: ["id"]
          },
        ]
      }
      sinif_ozet: {
        Row: {
          ad: string | null
          aktif: boolean | null
          egitmen_id: string | null
          id: string | null
          kontenjan: number | null
          kurs_id: string | null
          odev_sayisi: number | null
          ogrenci_sayisi: number | null
          sonraki_ders: string | null
          zoom_url: string | null
        }
        Insert: {
          ad?: string | null
          aktif?: boolean | null
          egitmen_id?: string | null
          id?: string | null
          kontenjan?: number | null
          kurs_id?: string | null
          odev_sayisi?: never
          ogrenci_sayisi?: never
          sonraki_ders?: never
          zoom_url?: string | null
        }
        Update: {
          ad?: string | null
          aktif?: boolean | null
          egitmen_id?: string | null
          id?: string | null
          kontenjan?: number | null
          kurs_id?: string | null
          odev_sayisi?: never
          ogrenci_sayisi?: never
          sonraki_ders?: never
          zoom_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "siniflar_egitmen_id_fkey"
            columns: ["egitmen_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siniflar_kurs_id_fkey"
            columns: ["kurs_id"]
            isOneToOne: false
            referencedRelation: "kurslar"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_mi: { Args: never; Returns: boolean }
      benim_rolum: { Args: never; Returns: Database["public"]["Enums"]["rol"] }
      egitmen_mi: { Args: never; Returns: boolean }
      giris_epostasi: { Args: { p_kullanici_adi: string }; Returns: string }
      kursu_veriyor_muyum: { Args: { p_kurs: string }; Returns: boolean }
      kursum_mu: { Args: { p_kurs: string }; Returns: boolean }
      ogrencim_mi: { Args: { p_ogrenci: string }; Returns: boolean }
      sertifika_no_uret: { Args: never; Returns: string }
      sinifim_mi: { Args: { p_sinif: string }; Returns: boolean }
      sinifimda_miyim: { Args: { p_sinif: string }; Returns: boolean }
    }
    Enums: {
      etkinlik_turu:
        | "canli_ders"
        | "sinav"
        | "odev_teslim"
        | "demo_gunu"
        | "diger"
      kurs_durumu: "taslak" | "yayinda" | "arsiv"
      materyal_turu:
        | "video"
        | "ses"
        | "pdf"
        | "sunum"
        | "belge"
        | "kod"
        | "baglanti"
      rol: "admin" | "egitmen" | "ogrenci"
      soru_turu: "coktan_secmeli" | "dogru_yanlis" | "acik_uclu" | "kod"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
          versioning_status: string
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
          versioning_status?: string
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
          versioning_status?: string
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          metadata: Json
          name: string
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          remote_table_id: string | null
          shard_id: string | null
          shard_key: string | null
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            isOneToOne: false
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          archived_at: string | null
          bucket_id: string | null
          created_at: string | null
          id: string
          is_delete_marker: boolean
          is_versioned: boolean
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          archived_at?: string | null
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          is_delete_marker?: boolean
          is_versioned?: boolean
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          archived_at?: string | null
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          is_delete_marker?: boolean
          is_versioned?: boolean
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          metadata: Json | null
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] }
        Returns: boolean
      }
      allow_only_operation: {
        Args: { expected_operation: string }
        Returns: boolean
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      etkinlik_turu: [
        "canli_ders",
        "sinav",
        "odev_teslim",
        "demo_gunu",
        "diger",
      ],
      kurs_durumu: ["taslak", "yayinda", "arsiv"],
      materyal_turu: [
        "video",
        "ses",
        "pdf",
        "sunum",
        "belge",
        "kod",
        "baglanti",
      ],
      rol: ["admin", "egitmen", "ogrenci"],
      soru_turu: ["coktan_secmeli", "dogru_yanlis", "acik_uclu", "kod"],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const

