export interface Category {
  id: string;
  num: string;
  title: string;
  icon: string;
  color: string;
  subs: string[];
}

export interface DriverItem {
  id: string;
  text: string;
}

export interface InterventionItem {
  id: string;
  text: string;
  linkedDriverIds: string[]; // IDs of drivers this intervention addresses
  levels: string[]; // Level of intervention for this specific intervention
}

export interface EntryData {
  drivers: string; // Legacy: single text field
  interventions: string; // Legacy: single text field
  driversList?: DriverItem[]; // New: structured list of drivers
  interventionsList?: InterventionItem[]; // New: structured list with links
  levels: string[];
  other: string;
  by: string[];
}

export interface StorageData {
  [categoryId: string]: {
    [subIndex: number]: EntryData;
  };
}

export interface SessionData {
  session: string;
  generated: string;
  data: {
    [categoryTitle: string]: {
      [subTitle: string]: EntryData;
    };
  };
}

export interface UserInfo {
  name: string;
  email: string;
  org: string;
}
