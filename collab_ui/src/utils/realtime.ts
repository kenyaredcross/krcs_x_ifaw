import type { EntryData } from '../types';

export interface EntryUpdatedPayload {
  session_code: string;
  cat_id: string;
  sub_index: number;
  entry: EntryData;
  updated_by: string;
}

export interface ParticipantJoinedPayload {
  session_code: string;
  user: string;
  full_name: string;
  organisation: string;
}

function frappe() {
  return window.frappe;
}

export function subscribeToSession(sessionCode: string) {
  frappe()?.realtime?.doc_subscribe('OH Session', sessionCode);
}

export function unsubscribeFromSession(sessionCode: string) {
  frappe()?.realtime?.doc_unsubscribe('OH Session', sessionCode);
}

export function onEntryUpdated(handler: (data: EntryUpdatedPayload) => void): () => void {
  const h = (data: unknown) => handler(data as EntryUpdatedPayload);
  frappe()?.realtime?.on('oh_entry_updated', h);
  return () => frappe()?.realtime?.off('oh_entry_updated', h);
}

export function onParticipantJoined(handler: (data: ParticipantJoinedPayload) => void): () => void {
  const h = (data: unknown) => handler(data as ParticipantJoinedPayload);
  frappe()?.realtime?.on('oh_participant_joined', h);
  return () => frappe()?.realtime?.off('oh_participant_joined', h);
}
