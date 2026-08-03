interface FrappeRealtime {
  on(event: string, handler: (data: unknown) => void): void;
  off(event: string, handler: (data: unknown) => void): void;
  doc_subscribe(doctype: string, docname: string): void;
  doc_unsubscribe(doctype: string, docname: string): void;
}

interface Window {
  frappe: {
    csrf_token: string;
    session?: { user: string; user_fullname?: string };
    realtime?: FrappeRealtime;
  };
}
