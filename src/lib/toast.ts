// toast.ts - Client-side Toast notification dispatcher

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastEventDetail {
  message: string;
  type?: ToastType;
  duration?: number;
}

export function showToast(message: string, type: ToastType = 'success', duration = 3000): void {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent<ToastEventDetail>('mindflix:toast', {
    detail: { message, type, duration }
  });
  window.dispatchEvent(event);
}
