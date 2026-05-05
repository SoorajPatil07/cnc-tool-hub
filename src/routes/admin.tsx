import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Lock, Pencil, Plus, Trash2, CheckCircle2, LogOut } from "lucide-react";
import { ADMIN_PASSWORD, Order, Tool, ordersStore, toolsStore } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const SESSION_KEY = "cnc_admin_session";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");

  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
    } else {
      toast.error("Incorrect password");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPw("");
  };

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto mt-12">
        <Toaster />
        <div className="bg-card border rounded-xl p-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-1">Admin Login</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">Enter your password to continue</p>
          <form onSubmit={login} className="space-y-4">
            <div>
              <Label>Password</Label>
              <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
            <p className="text-xs text-muted-foreground text-center">Default: admin123</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={logout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
      </div>
      <Tabs defaultValue="tools">
        <TabsList>
          <TabsTrigger value="tools">Manage Tools</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="tools" className="mt-6"><ToolsAdmin /></TabsContent>
        <TabsContent value="orders" className="mt-6"><OrdersAdmin /></TabsContent>
      </Tabs>
    </div>
  );
}

function ToolsAdmin() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [editing, setEditing] = useState<Tool | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", quantity: 0, price: 0 });

  const refresh = () => setTools(toolsStore.list());
  useEffect(refresh, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", description: "", quantity: 0, price: 0 });
    setOpen(true);
  };
  const openEdit = (t: Tool) => {
    setEditing(t);
    setForm({ name: t.name, description: t.description, quantity: t.quantity, price: t.price });
    setOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    if (editing) {
      toolsStore.update(editing.id, form);
      toast.success("Tool updated");
    } else {
      toolsStore.add(form);
      toast.success("Tool added");
    }
    setOpen(false);
    refresh();
  };

  const del = (id: string) => {
    if (confirm("Delete this tool?")) {
      toolsStore.remove(id);
      refresh();
      toast.success("Tool deleted");
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Add Tool</Button>
      </div>

      {tools.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center text-muted-foreground">
          No tools yet. Click "Add Tool" to start.
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Price</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3 text-muted-foreground max-w-xs truncate">{t.description}</td>
                  <td className="p-3">{t.quantity}</td>
                  <td className="p-3">${t.price.toFixed(2)}</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => del(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Tool" : "Add Tool"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Quantity</Label><Input type="number" min={0} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} /></div>
              <div><Label>Price ($)</Label><Input type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const refresh = () => setOrders(ordersStore.list().sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  useEffect(refresh, []);

  const markDone = (id: string) => {
    ordersStore.markDelivered(id);
    refresh();
    toast.success("Marked as delivered");
  };

  if (orders.length === 0) {
    return <div className="bg-card border rounded-xl p-12 text-center text-muted-foreground">No orders yet.</div>;
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="bg-card border rounded-xl p-5">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{o.customerName}</h3>
                <Badge variant={o.delivered ? "default" : "secondary"}>
                  {o.delivered ? "Delivered" : "Pending"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">📞 {o.customerContact}</p>
              <p className="text-sm mt-2">
                <span className="font-medium">{o.toolName}</span> × {o.quantity} = <span className="text-primary font-semibold">${o.total.toFixed(2)}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Deliver by: {format(new Date(o.deliveryDate), "PPP")} · Ordered {format(new Date(o.createdAt), "PP")}
              </p>
            </div>
            <div className="flex gap-2">
              {!o.delivered && (
                <Button size="sm" onClick={() => markDone(o.id)}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />Mark Delivered
                </Button>
              )}
              {o.delivered && (
                <Button size="sm" variant="destructive" onClick={() => delOrder(o.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
