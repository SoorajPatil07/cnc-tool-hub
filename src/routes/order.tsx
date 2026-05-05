import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ShoppingCart } from "lucide-react";
import { Tool, customersStore, ordersStore, toolsStore } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/order")({
  component: OrderPage,
});

function OrderPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selected, setSelected] = useState<Tool | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState<Date>();

  useEffect(() => setTools(toolsStore.list()), []);

  const submit = () => {
    if (!selected || !name.trim() || !contact.trim() || !date || qty < 1) {
      toast.error("Please fill all fields");
      return;
    }
    if (qty > selected.quantity) {
      toast.error(`Only ${selected.quantity} available`);
      return;
    }
    const customer = customersStore.add({ name: name.trim(), contact: contact.trim() });
    ordersStore.add({
      customerId: customer.id,
      customerName: customer.name,
      customerContact: customer.contact,
      toolId: selected.id,
      toolName: selected.name,
      quantity: qty,
      unitPrice: selected.price,
      total: selected.price * qty,
      deliveryDate: date.toISOString(),
    });
    toolsStore.update(selected.id, { quantity: selected.quantity - qty });
    setTools(toolsStore.list());
    toast.success("Order placed successfully!");
    setSelected(null);
    setName(""); setContact(""); setQty(1); setDate(undefined);
  };

  return (
    <div>
      <Toaster />
      <h1 className="text-3xl font-bold mb-2">Available Tools</h1>
      <p className="text-muted-foreground mb-6">Click a tool to place your order.</p>

      {tools.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center text-muted-foreground">
          No tools currently available. Please check back later.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => { setSelected(t); setQty(1); }}
              disabled={t.quantity === 0}
              className="text-left bg-card border rounded-xl p-5 hover:border-primary hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <span className="text-primary font-bold">${t.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{t.description}</p>
              <div className="text-xs text-muted-foreground">
                {t.quantity > 0 ? `In stock: ${t.quantity}` : "Out of stock"}
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Order: {selected?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Your Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
              </div>
              <div>
                <Label>Contact Number</Label>
                <Input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={20} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Quantity (max {selected?.quantity})</Label>
                <Input type="number" min={1} max={selected?.quantity} value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value) || 1)} />
              </div>
              <div>
                <Label>Delivery Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate}
                      disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                      initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {selected && (
              <div className="bg-muted rounded-md p-3 text-sm">
                Total: <span className="font-bold text-primary">${(selected.price * qty).toFixed(2)}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={submit}>Place Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
