export interface ApiMetaItem {
  id: string;
  slug?: string;
  name: string;
  icon?: string;
  description?: string;
  logo_url?: string;
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
  network?: string | null;
  status: 'draft' | 'enabled' | 'disabled';
  benefits?: string[] | null;
  categories?: string[] | null;
  rewards_details?: unknown;
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
  card_orientation?: 'horizontal' | 'vertical' | null;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asString(item))
    .filter(Boolean);
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

const API_BASE_URL =
  ((globalThis as any).__API_BASE_URL__ as string | undefined) ||
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000' : '');
const TOKEN_KEY = 'admin_token';
const PERSIST_KEY = 'admin_token_persist';

function decodeTokenPayload(token: string): { exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';
}

function setToken(token: string, rememberMe = true) {
  if (typeof window === 'undefined') return;
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  }
  localStorage.setItem(PERSIST_KEY, rememberMe ? '1' : '0');
}

function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PERSIST_KEY);
}

function isRemembered() {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(PERSIST_KEY) !== '0';
}

function isTokenValid() {
  const token = getToken();
  if (!token) return false;
  const payload = decodeTokenPayload(token);
  if (!payload?.exp) return true;
  return Date.now() < payload.exp * 1000;
}

function extractStoragePathFromPublicUrl(url: string) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/object\/public\/[^/]+\/(.+)$/);
    return match?.[1] ? decodeURIComponent(match[1]) : '';
  } catch {
    return '';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  if (token && !isTokenValid()) {
    clearToken();
    throw new Error('Session expired. Please login again.');
  }

  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const rawBody = await response.text().catch(() => '');
  let payload: any = {};
  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = {};
    }
  }

  if (response.status === 401) {
    clearToken();
  }

  if (!response.ok || payload?.success === false) {
    const apiMessage =
      payload?.message ||
      payload?.error?.message ||
      payload?.error ||
      (typeof payload === 'string' ? payload : '');

    const textMessage =
      rawBody && !rawBody.trim().startsWith('<')
        ? rawBody.trim().slice(0, 500)
        : '';

    const statusMessage = `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''}`;
    const message = apiMessage || textMessage || statusMessage;

    throw new Error(message);
  }

  return payload as T;
}

export const api = {
  getToken,
  setToken,
  clearToken,
  isTokenValid,
  isRemembered,
  extractStoragePathFromPublicUrl,

  async login(email: string, password: string, rememberMe = true) {
    const payload = await request<{ data: { token: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(payload.data.token, rememberMe);
    return payload.data.token;
  },

  async getCards(status: 'all' | 'enabled' | 'disabled' | 'draft' = 'enabled') {
    const query = `?status=${status}`;
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

  async createBank(input: { name: string; description?: string; logo_url?: string }) {
    const payload = await request<{ data: ApiMetaItem }>('/api/meta/banks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return payload.data;
  },

  async updateBank(id: string, input: { name: string; description?: string; logo_url?: string }) {
    const payload = await request<{ data: ApiMetaItem }>(`/api/meta/banks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
    return payload.data;
  },

  async deleteBank(id: string) {
    await request<{ success: true }>(`/api/meta/banks/${id}`, {
      method: 'DELETE',
    });
  },

  async getCardTypes() {
    const payload = await request<{ data: ApiMetaItem[] }>('/api/meta/card-types');
    return payload.data;
  },

  async createCardType(input: { name: string; icon?: string }) {
    const payload = await request<{ data: ApiMetaItem }>('/api/meta/card-types', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return payload.data;
  },

  async updateCardType(id: string, input: { name: string; icon?: string }) {
    const payload = await request<{ data: ApiMetaItem }>(`/api/meta/card-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
    return payload.data;
  },

  async deleteCardType(id: string) {
    await request<{ success: true }>(`/api/meta/card-types/${id}`, {
      method: 'DELETE',
    });
  },

  async getCardNetworks() {
    const payload = await request<{ data: ApiMetaItem[] }>('/api/meta/card-networks');
    return payload.data;
  },

  async createCardNetwork(input: { name: string }) {
    const payload = await request<{ data: ApiMetaItem }>('/api/meta/card-networks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return payload.data;
  },

  async updateCardNetwork(id: string, input: { name: string }) {
    const payload = await request<{ data: ApiMetaItem }>(`/api/meta/card-networks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
    return payload.data;
  },

  async deleteCardNetwork(id: string) {
    await request<{ success: true }>(`/api/meta/card-networks/${id}`, {
      method: 'DELETE',
    });
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

  async uploadCardImage(file: File, oldPath?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (oldPath) formData.append('oldPath', oldPath);

    const payload = await request<{ data: { publicUrl: string; path: string; bucket: string } }>('/api/uploads/card-image', {
      method: 'POST',
      body: formData,
    });

    return payload.data;
  },
};

export function mapApiCardToUi(card: ApiCard) {
  const categories = Array.isArray(card.categories)
    ? card.categories
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item, index, list) => item && list.findIndex((value) => value.toLowerCase() === item.toLowerCase()) === index)
    : [];

  const primaryCardType = asString(card.card_types?.name);
  if (!categories.length && primaryCardType) {
    categories.push(primaryCardType);
  }

  const eligibility =
    card.eligibility_criteria &&
    typeof card.eligibility_criteria === 'object' &&
    Array.isArray((card.eligibility_criteria as { items?: unknown }).items)
      ? ((card.eligibility_criteria as { items?: unknown }).items as unknown[])
          .filter((item): item is string => typeof item === 'string')
      : [];

  const rewardsDetailsRaw = asObject(card.rewards_details) || {};
  const customFeesRaw = asObject(card.custom_fees) || {};
  const customFeeItemsRaw = Array.isArray(customFeesRaw.items) ? customFeesRaw.items : [];
  const feeItems = customFeeItemsRaw
    .map((item) => {
      const itemObject = asObject(item);
      if (!itemObject) return null;

      const feeType = asString(itemObject.feeType || itemObject.type);
      const amount = asString(itemObject.amount || itemObject.value);
      if (!feeType && !amount) return null;

      return {
        feeType,
        amount,
      };
    })
    .filter((item): item is { feeType: string; amount: string } => Boolean(item));

  return {
    id: card.slug || card.id,
    rawId: card.id,
    image: card.card_image_url || 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
    title: card.card_name,
    joiningFee: card.joining_fee || 'Not specified',
    renewalFee: card.annual_fee || 'Not specified',
    interestRate: asString(card.interest_rate),
    benefits: card.benefits && card.benefits.length ? card.benefits : ['Details will be updated soon'],
    categories,
    description: card.product_description || '',
    productDescription: card.product_description || '',
    productFeatures: asStringArray(card.product_features),
    specialPerks: asStringArray(card.special_perks),
    pros: asStringArray(card.pros),
    cons: asStringArray(card.cons),
    rewardsDetails: {
      rewardsRate: asString(rewardsDetailsRaw.rewards_rate),
      rewardRedemption: asString(rewardsDetailsRaw.reward_redemption),
      internationalLoungeAccess: asString(rewardsDetailsRaw.international_lounge_access),
      domesticLoungeAccess: asString(rewardsDetailsRaw.domestic_lounge_access),
      insuranceBenefits: asString(rewardsDetailsRaw.insurance_benefits),
      travelBenefits: asString(rewardsDetailsRaw.travel_benefits),
      movieDining: asString(rewardsDetailsRaw.movie_dining),
      golfBenefits: asString(rewardsDetailsRaw.golf_benefits),
      cashbackRate: asString(rewardsDetailsRaw.cashback_rate),
      customBenefits: asStringArray(rewardsDetailsRaw.custom_benefits),
    },
    feeItems,
    feeWaiverConditions: asString(customFeesRaw.fee_waiver_conditions),
    status: card.status,
    bankName: card.banks?.name || '',
    bankId: card.bank_id,
    slug: card.slug || null,
    cardTypeId: card.card_type_id || null,
    networkId: card.network_id || null,
    network: card.card_networks?.name || card.network || null,
    cardOrientation: card.card_orientation || 'horizontal',
    eligibilityCriteria: eligibility,
  };
}
