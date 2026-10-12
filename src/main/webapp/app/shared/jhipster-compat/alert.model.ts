export type JhiAlertType = 'success' | 'danger' | 'warning' | 'info';

export interface JhiAlert {
  id?: number;
  type: JhiAlertType;
  msg: string;
  params?: any;
  timeout?: number;
  toast?: boolean;
  position?: string;
  scoped?: boolean;
  close?: (alerts: JhiAlert[]) => void;
}
