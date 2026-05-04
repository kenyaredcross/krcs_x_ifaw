import type { StorageData, EntryData } from '../types';

export const generateSessionCode = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `ONEHEALTH-${timestamp}-${randomStr}`.toUpperCase();
};

export const storageKey = (sessionCode: string): string => `onehealth_${sessionCode}`;

export const loadData = (sessionCode: string): StorageData => {
  try {
    const data = localStorage.getItem(storageKey(sessionCode));
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const saveData = (sessionCode: string, data: StorageData): void => {
  localStorage.setItem(storageKey(sessionCode), JSON.stringify(data));
};

export const getEntry = (
  sessionCode: string,
  catId: string,
  subIdx: number
): EntryData => {
  const data = loadData(sessionCode);
  return data[catId]?.[subIdx] || {
    drivers: '',
    interventions: '',
    levels: [],
    other: '',
    by: []
  };
};

export const saveEntry = (
  sessionCode: string,
  catId: string,
  subIdx: number,
  entry: EntryData,
  currentUser: string
): void => {
  const data = loadData(sessionCode);
  if (!data[catId]) data[catId] = {};
  if (!entry.by) entry.by = [];
  if (!entry.by.includes(currentUser)) entry.by.push(currentUser);
  data[catId][subIdx] = entry;
  saveData(sessionCode, data);
};
