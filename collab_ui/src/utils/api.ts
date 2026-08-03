import type { EntryData, StorageData } from '../types';

const BASE = '/api/method/krcs_x_ifaw.krcs_x_ifaw.api';

function csrfToken(): string {
  return window.frappe?.csrf_token || 'fetch';
}

async function call<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`${BASE}.${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Frappe-CSRF-Token': csrfToken(),
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { exc_type?: string; exception?: string };
    throw new Error(err?.exception || `HTTP ${res.status}`);
  }
  const json = await res.json() as { message: T };
  return json.message;
}

export interface FrappeUser {
  name: string;
  email: string;
  frappe_user: string;
}

export const api = {
  getCurrentUser: () => call<FrappeUser>('get_current_user_info'),

  joinSession: (sessionCode: string, organisation: string) =>
    call<{ ok: boolean }>('join_session', {
      session_code: sessionCode,
      organisation,
    }),

  getSessionEntries: (sessionCode: string) =>
    call<StorageData>('get_session_entries', { session_code: sessionCode }),

  saveEntry: (sessionCode: string, catId: string, subIndex: number, entry: EntryData) =>
    call<{ ok: boolean }>('save_entry', {
      session_code: sessionCode,
      cat_id: catId,
      sub_index: subIndex,
      entry: JSON.stringify(entry),
    }),
};
