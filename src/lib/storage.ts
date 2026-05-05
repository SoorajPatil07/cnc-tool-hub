export interface Tool {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerContact: string;
  toolId: string;
  toolName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  deliveryDate: string;
  delivered: boolean;
  createdAt: string;
}

const KEYS = {
  tools: "cnc_tools",
  customers: "cnc_customers",
  orders: "cnc_orders",
} as const;

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const toolsStore = {
  list: () => read<Tool>(KEYS.tools),
  add: (t: Omit<Tool, "id">) => {
    const tools = read<Tool>(KEYS.tools);
    const tool = { ...t, id: crypto.randomUUID() };
    write(KEYS.tools, [...tools, tool]);
    return tool;
  },
  update: (id: string, patch: Partial<Tool>) => {
    const tools = read<Tool>(KEYS.tools).map((x) => (x.id === id ? { ...x, ...patch } : x));
    write(KEYS.tools, tools);
  },
  remove: (id: string) => {
    write(
      KEYS.tools,
      read<Tool>(KEYS.tools).filter((x) => x.id !== id),
    );
  },
};

export const customersStore = {
  list: () => read<Customer>(KEYS.customers),
  add: (c: Omit<Customer, "id">) => {
    const customers = read<Customer>(KEYS.customers);
    const customer = { ...c, id: crypto.randomUUID() };
    write(KEYS.customers, [...customers, customer]);
    return customer;
  },
};

export const ordersStore = {
  list: () => read<Order>(KEYS.orders),
  add: (o: Omit<Order, "id" | "createdAt" | "delivered">) => {
    const orders = read<Order>(KEYS.orders);
    const order: Order = {
      ...o,
      id: crypto.randomUUID(),
      delivered: false,
      createdAt: new Date().toISOString(),
    };
    write(KEYS.orders, [...orders, order]);
    return order;
  },
  markDelivered: (id: string) => {
    const orders = read<Order>(KEYS.orders).map((o) =>
      o.id === id ? { ...o, delivered: true } : o,
    );
    write(KEYS.orders, orders);
  },
};

export const ADMIN_PASSWORD = "admin123";
