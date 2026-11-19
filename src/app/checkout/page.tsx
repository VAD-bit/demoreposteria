"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { formatPriceFromCents } from "@/lib/utils";
import { deliverySlots, deliveryZones } from "@/lib/mock-data";
import type { DeliverySlot, DeliveryZone } from "@/lib/mock-data";

const cartItems = [
  { id: "1", name: "Croissant de mantequilla", price: 280, quantity: 2, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&h=100&fit=crop" },
  { id: "2", name: "Pain au chocolat", price: 310, quantity: 1, image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=100&h=100&fit=crop" },
  { id: "3", name: "Tarta de manzana y caramelo salado", price: 3800, quantity: 1, image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=100&h=100&fit=crop" },
];

interface Step1DeliveryProps {
  deliveryType: "pickup" | "delivery";
  setDeliveryType: (type: "pickup" | "delivery") => void;
  selectedSlot: string | null;
  setSelectedSlot: (id: string | null) => void;
  postalCode: string;
  setPostalCode: (code: string) => void;
  zone: DeliveryZone | null;
  canProceed: boolean;
  onNext: () => void;
}

function Step1Delivery({ deliveryType, setDeliveryType, selectedSlot, setSelectedSlot, postalCode, setPostalCode, zone, canProceed, onNext }: Step1DeliveryProps) {
  const pickupSlots = deliverySlots.filter((s) => s.type === "pickup");
  const deliverySlotsFiltered = deliverySlots.filter((s) => s.type === "delivery");

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    setPostalCode(value);
    if (value.length === 5) {
      const found = deliveryZones.find((z) => z.postalCodes.includes(value));
      if (found) return found;
    }
    return null;
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="font-display font-light tracking-tight text-display-md text-ink-900 mb-2">
        ¿Cómo lo quieres recibir?
      </h1>
      <p className="text-body-md text-ink-600 mb-8">Elige recogida en tienda o delivery a domicilio</p>

      {/* Type Selector */}
      <div className="grid gap-4 md:grid-cols-2 mb-8" role="radiogroup" aria-label="Tipo de entrega">
        {[
          { value: "pickup", label: "Recogida en tienda", desc: "Gratis · Listo en tu franja horaria", icon: "home" },
          { value: "delivery", label: "Delivery a domicilio", desc: "Desde 3,50€ · Te lo llevamos a casa", icon: "truck" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setDeliveryType(opt.value as "pickup" | "delivery"); setSelectedSlot(null); }}
            className={cn(
              "card p-6 text-left relative h-full transition-all",
              deliveryType === opt.value
                ? "border-brand-500 ring-2 ring-brand-100"
                : "border-ink-100 hover:border-brand-300"
            )}
            role="radio"
            aria-checked={deliveryType === opt.value}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                deliveryType === opt.value ? "bg-brand-100 text-brand-600" : "bg-ink-100 text-ink-500"
              )}>
                <Icon name={opt.icon as any} size="xl" />
              </div>
              <div>
                <p className="font-medium text-ink-900">{opt.label}</p>
                <p className="text-body-sm text-ink-500">{opt.desc}</p>
              </div>
            </div>
            {deliveryType === opt.value && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center">
                <Icon name="check" size="sm" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Slot Selector */}
      <div>
        <h2 className="text-h3 mb-4">Elige tu franja horaria</h2>
        <p className="text-body-sm text-ink-500 mb-4">
          {deliveryType === "pickup"
            ? "Recogida en tienda · Corte 1h antes · Máx 50 pedidos por franja"
            : "Delivery a domicilio · Corte 1h30 antes · Según zona"}
        </p>

        {deliveryType === "pickup" ? (
          <SlotPicker slots={pickupSlots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
        ) : (
          <div>
            {/* Postal Code Input */}
            <div className="mb-6">
              <label htmlFor="postal-code" className="label mb-2">
                Código postal para calcular zona y tarifa
              </label>
              <div className="relative max-w-xs">
                <Input
                  id="postal-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  placeholder="28001"
                  value={postalCode}
                  onChange={handlePostalCodeChange}
                  error={postalCode.length === 5 && !zone}
                  errorMessage={postalCode.length === 5 && !zone ? "No servimos en esta zona" : undefined}
                />
                {zone && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-fresh-600">
                    <Icon name="check" size="sm" />
                  </div>
                )}
              </div>
              {zone && (
                <p className="text-body-sm text-fresh-700 mt-2 flex items-center gap-1">
                  <Icon name="map-pin" size="sm" />
                  Zona <strong>{zone.name}</strong> · Envío {formatPriceFromCents(zone.fee)} · Pedido mín {formatPriceFromCents(zone.minOrder)}
                </p>
              )}
            </div>

            {zone && (
              <SlotPicker slots={deliverySlotsFiltered} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
            )}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button
            variant="primary"
            size="lg"
            disabled={!canProceed}
            onClick={onNext}
          >
            Continuar
            <Icon name="chevron-right" size="sm" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  whatsappOptIn: boolean;
}

interface Step2DataProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  deliveryType: "pickup" | "delivery";
  postalCode: string;
  setPostalCode: (code: string) => void;
  zone: DeliveryZone | null;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
}

function Step2Data({ formData, setFormData, deliveryType, postalCode, setPostalCode, zone, canProceed, onBack, onNext }: Step2DataProps) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="font-display font-light tracking-tight text-display-md text-ink-900 mb-2">
        Tus datos
      </h1>
      <p className="text-body-md text-ink-600 mb-8">Para confirmar el pedido y enviarte notificaciones por WhatsApp</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-h3 mb-4">Datos de contacto</h2>
          <Input
            label="Nombre completo *"
            placeholder="Juan Pérez García"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email *"
            type="email"
            placeholder="juan@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Teléfono *"
            type="tel"
            placeholder="+34 600 000 000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div>
          <h2 className="text-h3 mb-4">
            {deliveryType === "delivery" ? "Dirección de entrega" : "Dirección de facturación"}
          </h2>
          {deliveryType === "delivery" && (
            <>
              <Input
                label="Calle y número *"
                placeholder="Calle Mayor, 15"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              <Input
                label="Ciudad *"
                placeholder="Madrid"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
              <Input
                label="Código postal *"
                value={postalCode}
                onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 5); setPostalCode(v); }}
                disabled
              />
            </>
          )}
          {deliveryType === "pickup" && (
            <Input
              label="Dirección (opcional, para factura)"
              placeholder="Calle Mayor, 15, Madrid"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          )}
          <Input
            label="Notas para el repartidor / cocina"
            placeholder="Timbre 2ºB, llamar al llegar, sin gluten..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </div>

      {/* WhatsApp Opt-in */}
      <div className="mt-8 p-6 rounded-xl bg-fresh-50 border border-fresh-100">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.whatsappOptIn}
            onChange={(e) => setFormData({ ...formData, whatsappOptIn: e.target.checked })}
            className="w-5 h-5 mt-0.5 rounded border-ink-300 text-brand-500 focus:ring-brand-500"
          />
          <div>
            <p className="font-medium text-ink-900">Recibir actualizaciones por WhatsApp</p>
            <p className="text-body-sm text-ink-600 mt-1">
              Te enviaremos: confirmación de pedido, aviso cuando esté listo, en ruta y entregado.
              <a href="/privacidad" className="underline hover:text-brand-600 ml-1">Política de privacidad</a>.
            </p>
          </div>
        </label>
      </div>

      <div className="mt-8 flex gap-4">
        <Button variant="secondary" size="lg" onClick={onBack}>
          <Icon name="chevron-left" size="sm" className="mr-2" />
          Volver
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={!canProceed}
          onClick={onNext}
        >
          Continuar al pago
          <Icon name="chevron-right" size="sm" className="ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

interface Step3PaymentProps {
  paymentMethod: "pago_movil" | "efectivo" | "zelle" | "usdt";
  setPaymentMethod: (method: "pago_movil" | "efectivo" | "zelle" | "usdt") => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  zone: DeliveryZone | null;
  onBack: () => void;
  onSubmit: () => void;
}

function Step3Payment({ paymentMethod, setPaymentMethod, subtotal, deliveryFee, total, zone, onBack, onSubmit }: Step3PaymentProps) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="font-display font-light tracking-tight text-display-md text-ink-900 mb-2">
        Pago
      </h1>
      <p className="text-body-md text-ink-600 mb-8">Elige tu método de pago seguro</p>

      <div className="grid gap-4 md:grid-cols-2 mb-8" role="radiogroup" aria-label="Método de pago">
        {[
          { value: "pago_movil", label: "Pago móvil", desc: "Transferencia instantánea (Yappy, Nequi, etc.)", icon: "smartphone" },
          { value: "efectivo", label: "Efectivo", desc: "Pago en tienda al recoger", icon: "home" },
          { value: "zelle", label: "Zelle", desc: "Transferencia bancaria instantánea USA", icon: "credit-card" },
          { value: "usdt", label: "USDT (TRC20)", desc: "Criptomoneda estable, red Tron", icon: "credit-card" },
        ].map((method) => (
          <button
            key={method.value}
            onClick={() => setPaymentMethod(method.value as "pago_movil" | "efectivo" | "zelle" | "usdt")}
            className={cn(
              "card p-6 text-left relative h-full transition-all",
              paymentMethod === method.value
                ? "border-brand-500 ring-2 ring-brand-100"
                : "border-ink-100 hover:border-brand-300"
            )}
            role="radio"
            aria-checked={paymentMethod === method.value}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                paymentMethod === method.value ? "bg-brand-100 text-brand-600" : "bg-ink-100 text-ink-500"
              )}>
                <Icon name={method.icon as any} size="xl" />
              </div>
              <div>
                <p className="font-medium text-ink-900">{method.label}</p>
                <p className="text-body-sm text-ink-500">{method.desc}</p>
              </div>
            </div>
            {paymentMethod === method.value && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center">
                <Icon name="check" size="sm" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Order Summary */}
      <div className="card p-6 sticky top-24">
        <h2 className="text-h3 mb-4">Resumen del pedido</h2>
        <div className="space-y-3 mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-100 flex-shrink-0">
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-ink-900 truncate">{item.name}</p>
                <p className="text-body-xs text-ink-500">{item.quantity} × {formatPriceFromCents(item.price)}</p>
              </div>
              <span className="font-mono text-price-sm font-semibold text-ink-900 tabular-nums">
                {formatPriceFromCents(item.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t border-ink-100 pt-3 space-y-2">
            <div className="flex justify-between text-body-sm">
              <span className="text-ink-600">Subtotal</span>
              <span className="text-ink-900 font-medium">{formatPriceFromCents(subtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-body-sm">
                <span className="text-ink-600 flex items-center gap-1">
                  <Icon name="truck" size="sm" />
                  Envío ({zone?.name})
                </span>
                <span className="text-ink-900 font-medium">{formatPriceFromCents(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-body-md font-semibold text-ink-900 border-t border-ink-100 pt-2">
              <span>Total</span>
              <span>{formatPriceFromCents(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Button variant="secondary" size="lg" onClick={onBack}>
          <Icon name="chevron-left" size="sm" className="mr-2" />
          Volver
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1 justify-center gap-2"
          onClick={onSubmit}
        >
          {paymentMethod === "pago_movil" && (
            <>
              <Icon name="smartphone" size="sm" />
              Pagar {formatPriceFromCents(total)} por pago móvil
            </>
          )}
          {paymentMethod === "efectivo" && (
            <>
              <Icon name="home" size="sm" />
              Confirmar y pagar en tienda con efectivo
            </>
          )}
          {paymentMethod === "zelle" && (
            <>
              <Icon name="credit-card" size="sm" />
              Pagar {formatPriceFromCents(total)} por Zelle
            </>
          )}
          {paymentMethod === "usdt" && (
            <>
              <Icon name="credit-card" size="sm" />
              Pagar {formatPriceFromCents(total)} con USDT (TRC20)
            </>
          )}
        </Button>
      </div>

      <p className="text-center text-caption text-ink-500 mt-6">
        <Icon name="shield" size="sm" className="inline mr-1" />
        Pago seguro · Tus datos no se guardan
      </p>
    </motion.div>
  );
}

interface SlotPickerProps {
  slots: typeof deliverySlots;
  selectedSlot: string | null;
  onSelect: (id: string) => void;
}

function SlotPicker({ slots, selectedSlot, onSelect }: SlotPickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {slots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => onSelect(slot.id)}
          className={cn(
            "card p-4 text-center relative transition-all",
            selectedSlot === slot.id
              ? "border-brand-500 ring-2 ring-brand-100 bg-brand-50"
              : "border-ink-100 hover:border-brand-300"
          )}
          aria-pressed={selectedSlot === slot.id}
        >
          {selectedSlot === slot.id && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center">
              <Icon name="check" size="xs" />
            </div>
          )}
          <div className="relative z-10">
            <p className="font-medium text-ink-900 mb-1">{slot.name}</p>
            <p className="text-body-xs text-ink-500">Corte: {slot.cutoff}</p>
            <p className="text-body-xs text-ink-400 mt-1">{slot.maxOrders - 10}+ plazas libres</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const [step, setStep] = React.useState(1);
  const [deliveryType, setDeliveryType] = React.useState<"pickup" | "delivery">("pickup");
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
  const [postalCode, setPostalCode] = React.useState("");
  const [zone, setZone] = React.useState<typeof deliveryZones[0] | null>(null);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    whatsappOptIn: false,
  });
  const [paymentMethod, setPaymentMethod] = React.useState<"pago_movil" | "efectivo" | "zelle" | "usdt">("pago_movil");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = zone?.fee || 0;
  const total = subtotal + deliveryFee;

  const canProceedFromStep1 = deliveryType === "pickup" ? !!selectedSlot : !!selectedSlot && !!zone;
  const canProceedFromStep2 = Boolean(formData.name && formData.email && formData.phone && (deliveryType === "pickup" || (formData.address && formData.city)));

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    setPostalCode(value);
    if (value.length === 5) {
      const found = deliveryZones.find((z) => z.postalCodes.includes(value));
      setZone(found || null);
    } else {
      setZone(null);
    }
  };

  const handlePostalCodeChangeString = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 5);
    setPostalCode(cleaned);
    if (cleaned.length === 5) {
      const found = deliveryZones.find((z) => z.postalCodes.includes(cleaned));
      setZone(found || null);
    } else {
      setZone(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Progress Bar */}
      <div className="sticky top-16 z-50 bg-white/95 backdrop-blur-sm border-b border-ink-100 px-[var(--container-pad)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between h-12">
            {[
              { num: 1, label: "Entrega", short: "1" },
              { num: 2, label: "Datos", short: "2" },
              { num: 3, label: "Pago", short: "3" },
            ].map((s) => (
              <React.Fragment key={s.num}>
                <button
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 transition-colors",
                    step === s.num
                      ? "text-brand-600"
                      : step > s.num
                      ? "text-fresh-600"
                      : "text-ink-400"
                  )}
                  disabled
                  aria-current={step === s.num ? "step" : undefined}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-body-sm font-semibold transition-all",
                    step === s.num
                      ? "bg-brand-500 text-white"
                      : step > s.num
                      ? "bg-fresh-500 text-white"
                      : "bg-ink-100 text-ink-400"
                  )}>
                    {step > s.num ? <Icon name="check" size="sm" /> : s.short}
                  </span>
                  <span className="text-caption hidden sm:block">{s.label}</span>
                </button>
                {s.num < 3 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors",
                    step > s.num ? "bg-fresh-500" : "bg-ink-100"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <section className="section section--light pt-4">
        <div className="max-w-4xl mx-auto px-[var(--container-pad)]">
          {step === 1 && (
            <Step1Delivery
              deliveryType={deliveryType}
              setDeliveryType={setDeliveryType}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              postalCode={postalCode}
              setPostalCode={handlePostalCodeChangeString}
              zone={zone}
              canProceed={canProceedFromStep1}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <Step2Data
              formData={formData}
              setFormData={setFormData}
              deliveryType={deliveryType}
              postalCode={postalCode}
              setPostalCode={setPostalCode}
              zone={zone}
              canProceed={canProceedFromStep2}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <Step3Payment
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              zone={zone}
              onBack={() => setStep(2)}
              onSubmit={() => alert("Pedido enviado (demo)")}
            />
          )}
        </div>
      </section>
    </div>
  );
}