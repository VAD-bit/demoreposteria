"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  // Layout & Navigation (exist in v1.75.0)
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  Home,
  LayoutDashboard,
  LayoutGrid,
  Search,
  User,

  // Commerce & Actions (exist in v1.75.0)
  ShoppingCart,
  Heart,
  Star,
  Tag,
  Package,
  Truck,
  CreditCard,
  Smartphone,
  RotateCcw,
  Plus,
  Minus,
  Trash,
  Check,
  Zap,
  Shield,
  Gift,
  FileText,
  UserPlus,
  Mail,
  MessageSquare,

  // Food & Bakery (exist in v1.75.0)
  Croissant,
  Wheat,
  Cookie,
  Coffee,
  Cupcake,
  IceCream,
  Utensils,

  // General UI (exist in v1.75.0)
  Sparkles,
  Info,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Globe,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  QrCode,
  Barcode,
  Printer,
  Download,
  Upload,
  Cloud,
  Thermometer,
} from "lucide-react";

const iconMap = {
  // Layout & Navigation
  menu: Menu,
  close: X,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "more-horizontal": MoreHorizontal,
  home: Home,
  "layout-dashboard": LayoutDashboard,
  "layout-grid": LayoutGrid,
  grid: LayoutGrid,
  search: Search,

  // Commerce & Actions
  "shopping-cart": ShoppingCart,
  heart: Heart,
  star: Star,
  tag: Tag,
  package: Package,
  truck: Truck,
  "credit-card": CreditCard,
  smartphone: Smartphone,
  "rotate-ccw": RotateCcw,
  plus: Plus,
  minus: Minus,
  trash: Trash,
  check: Check,
  zap: Zap,
  shield: Shield,
  gift: Gift,
  "file-text": FileText,
  "user-plus": UserPlus,
  user: User,
  mail: Mail,
  whatsapp: MessageSquare,
  // Instagram y Facebook no existen en v1.75.0, usamos alternativas
  instagram: MessageSquare,
  facebook: MessageSquare,
  tiktok: MessageSquare,

  // Aliases for filled variants (use same icon)
  "heart-filled": Heart,
  "star-filled": Star,

  // Food & Bakery
  croissant: Croissant,
  wheat: Wheat,
  cookie: Cookie,
  coffee: Coffee,
  cupcake: Cupcake,
  "ice-cream": IceCream,
  utensils: Utensils,

  // General UI
  sparkles: Sparkles,
  info: Info,
  "alert-circle": AlertCircle,
  calendar: Calendar,
  clock: Clock,
  "map-pin": MapPin,
  phone: Phone,
  globe: Globe,
  lock: Lock,
  unlock: Unlock,
  key: Key,
  fingerprint: Fingerprint,
  "qr-code": QrCode,
  barcode: Barcode,
  printer: Printer,
  download: Download,
  upload: Upload,
  cloud: Cloud,
  thermometer: Thermometer,
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export function Icon({ name, size = "md", className, ...props }: IconProps) {
  const Component = iconMap[name];
  if (!Component) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const sizeClasses = {
    xs: "icon-xs",
    sm: "icon-sm",
    md: "icon-md",
    lg: "icon-lg",
    xl: "icon-xl",
    "2xl": "icon-2xl",
  };

  return (
    <Component
      className={cn("icon", sizeClasses[size], className)}
      aria-hidden="true"
      {...props}
    />
  );
}