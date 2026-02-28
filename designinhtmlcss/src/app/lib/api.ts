export interface ApiMetaItem {
  id: string;
  name: string;
}

export interface ApiCard {
  id: string;
  slug?: string | null;
  card_name: string;
  bank_id: string;
  card_image_url?: string | null;
  joining_fee?: string | null;
  annual_fee?: string | null;
  interest_rate?: string | null;
  reward_program_name?: string | null;
  welcome_bonus?: string | null;
  card_type_id?: string | null;
  network_id?: string | null;
  status: 'draft' | 'enabled' | 'disabled';
  benefits?: string[] | null;
  categories?: string[] | null;
  product_description?: string | null;
  product_features?: string[] | null;
  special_perks?: string[] | null;
  eligibility_criteria?: unknown;
  pros?: string[] | null;
  cons?: string[] | null;
  custom_fees?: unknown;
  banks?: ApiMetaItem;
  card_types?: ApiMetaItem;
  card_networks?: ApiMetaItem;
}

const API_BASE_URL = ((globalThis as any).__API_BASE_URL__ as string | undefined) || 'http://localhost:4000';
const TOKEN_KEY = 'admin_token';

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(TOKEN_KEY) || '';
}

function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.success === false) {
    const message = payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload as T;
}

export const api = {
  getToken,
  setToken,
  clearToken,

  async login(email: string, password: string) {
    const payload = await request<{ data: { token: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(payload.data.token);
    return payload.data.token;
  },

  async getCards(status: 'all' | 'enabled' | 'disabled' | 'draft' = 'enabled') {
    const query = status === 'all' ? '' : `?status=${status}`;
    const payload = await request<{ data: { cards: ApiCard[] } }>(`/api/cards${query}`);
    return payload.data.cards;
  },

  async getCardByIdOrSlug(idOrSlug: string) {
    const payload = await request<{ data: ApiCard }>(`/api/cards/${idOrSlug}`);
    return payload.data;
  },

  async getBanks() {
    const payload = await request<{ data: ApiMetaItem[] }>('/api/meta/banks');
    return payload.data;
  },

  async getCardTypes() {
    const payload = await request<{ data: ApiMetaItem[] }>('/api/meta/card-types');
    return payload.data;
  },

  async getCardNetworks() {
    const payload = await request<{ data: ApiMetaItem[] }>('/api/meta/card-networks');
    return payload.data;
  },

  async createCard(input: Partial<ApiCard>) {
    const payload = await request<{ data: ApiCard }>('/api/cards', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return payload.data;
  },

  async updateCard(id: string, input: Partial<ApiCard>) {
    const payload = await request<{ data: ApiCard }>(`/api/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
    return payload.data;
  },

  async deleteCard(id: string) {
    await request<{ success: true }>(`/api/cards/${id}`, {
      method: 'DELETE',
    });
  },
};

export function mapApiCardToUi(card: ApiCard) {
  return {
    id: card.slug || card.id,
    rawId: card.id,
    image: card.card_image_url || 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
    title: card.card_name,
    joiningFee: card.joining_fee || 'Not specified',
    renewalFee: card.annual_fee || 'Not specified',
    benefits: card.benefits && card.benefits.length ? card.benefits : ['Details will be updated soon'],
    categories: card.categories && card.categories.length ? card.categories : ['General'],
    description: card.product_description || '',
    status: card.status,
    bankName: card.banks?.name || '',
    bankId: card.bank_id,
    slug: card.slug || null,
    cardTypeId: card.card_type_id || null,
    networkId: card.network_id || null,
  };
}
