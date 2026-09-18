"use client";

import { useSyncExternalStore } from "react";

const KEY = "kpss-local-uid";

let cached = "";

function read(): string {
  if (!cached) {
    cached = localStorage.getItem(KEY) ?? `local-${crypto.randomUUID()}`;
    localStorage.setItem(KEY, cached);
  }
  return cached;
}

function readOnServer(): string {
  return "";
}

const subscribe = () => () => {};

/**
 * Firebase yapılandırılmadığında veya anonim giriş başarısız olduğunda
 * ilerlemenin bağlanacağı cihaz kimliği. Sunucuda boş döner; değer yalnızca
 * hydration sonrası okunur.
 */
export function useDeviceUid(): string {
  return useSyncExternalStore(subscribe, read, readOnServer);
}
