import type { Order } from '@/types';

const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID;
const ADMIN_BIN_ID = import.meta.env.VITE_JSONBIN_ADMIN_BIN_ID;
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY;
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const ADMIN_BASE_URL = `https://api.jsonbin.io/v3/b/${ADMIN_BIN_ID}`;

const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY,
};

export async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${BASE_URL}/latest`, { headers });
    const data = await res.json();
    return data.record?.orders ?? [];
  } catch {
    return [];
  }
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await fetch(BASE_URL, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ orders }),
  });
}

export type AdminUser = {
  id: string;
  name: string;
  password: string;
  role: string;
};

export async function getAdmins(): Promise<AdminUser[]> {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/latest`, { headers });
    const data = await res.json();
    return data.record?.admins ?? [];
  } catch {
    return [];
  }
}
