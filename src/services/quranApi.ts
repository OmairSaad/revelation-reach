import { QuranResponse, SurahData, Surah, Edition, Ayah } from '@/types/quran';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const quranApi = {
  // Get all surahs
  getAllSurahs: async (): Promise<Surah[]> => {
    const response = await fetch(`${BASE_URL}/surah`);
    const data: QuranResponse<Surah[]> = await response.json();
    return data.data;
  },

  // Get a specific surah with edition
  getSurah: async (surahNumber: number, edition: string = 'quran-uthmani'): Promise<SurahData> => {
    const response = await fetch(`${BASE_URL}/surah/${surahNumber}/${edition}`);
    const data: QuranResponse<SurahData> = await response.json();
    return data.data;
  },

  // Get multiple editions for a surah
  getSurahMultipleEditions: async (surahNumber: number, editions: string[]): Promise<SurahData[]> => {
    const editionsStr = editions.join(',');
    const response = await fetch(`${BASE_URL}/surah/${surahNumber}/editions/${editionsStr}`);
    const data: QuranResponse<SurahData[]> = await response.json();
    return data.data;
  },

  // Get a specific ayah
  getAyah: async (reference: string | number, edition: string = 'quran-uthmani'): Promise<Ayah> => {
    const response = await fetch(`${BASE_URL}/ayah/${reference}/${edition}`);
    const data: QuranResponse<Ayah> = await response.json();
    return data.data;
  },

  // Search
  search: async (keyword: string, surah: string | number = 'all', edition: string = 'en'): Promise<{ matches: Ayah[]; count: number }> => {
    const response = await fetch(`${BASE_URL}/search/${encodeURIComponent(keyword)}/${surah}/${edition}`);
    const data: QuranResponse<{ matches: Ayah[]; count: number }> = await response.json();
    return data.data;
  },

  // Get all editions
  getEditions: async (format?: 'text' | 'audio', language?: string): Promise<Edition[]> => {
    let url = `${BASE_URL}/edition`;
    const params = new URLSearchParams();
    if (format) params.append('format', format);
    if (language) params.append('language', language);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetch(url);
    const data: QuranResponse<Edition[]> = await response.json();
    return data.data;
  },

  // Get juz
  getJuz: async (juzNumber: number, edition: string = 'quran-uthmani'): Promise<{ number: number; ayahs: Ayah[] }> => {
    const response = await fetch(`${BASE_URL}/juz/${juzNumber}/${edition}`);
    const data: QuranResponse<{ number: number; ayahs: Ayah[] }> = await response.json();
    return data.data;
  },

  // Get page
  getPage: async (pageNumber: number, edition: string = 'quran-uthmani'): Promise<{ number: number; ayahs: Ayah[] }> => {
    const response = await fetch(`${BASE_URL}/page/${pageNumber}/${edition}`);
    const data: QuranResponse<{ number: number; ayahs: Ayah[] }> = await response.json();
    return data.data;
  },

  // Get page with multiple editions
  getPageMultipleEditions: async (pageNumber: number, editions: string[]): Promise<{ number: number; ayahs: Ayah[] }[]> => {
    const editionsStr = editions.join(',');
    const response = await fetch(`${BASE_URL}/page/${pageNumber}/editions/${editionsStr}`);
    const data: QuranResponse<{ number: number; ayahs: Ayah[] }[]> = await response.json();
    return data.data;
  },

  // Get sajda ayahs
  getSajdaAyahs: async (edition: string = 'quran-uthmani'): Promise<{ ayahs: Ayah[] }> => {
    const response = await fetch(`${BASE_URL}/sajda/${edition}`);
    const data: QuranResponse<{ ayahs: Ayah[] }> = await response.json();
    return data.data;
  },
};
