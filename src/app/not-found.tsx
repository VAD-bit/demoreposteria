import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-canvas px-4">
      <div className="text-center max-w-md">
        <Icon name="alert-circle" size="2xl" className="text-ink-200 mx-auto mb-4" />
        <h1 className="font-display font-light tracking-tight text-display-lg text-ink-900 mb-4">
          Página no encontrada
        </h1>
        <p className="text-body-lg text-ink-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link href="/" className="btn btn-primary inline-block">
          Volver al inicio
          <Icon name="arrow-right" size="sm" className="ml-2" />
        </Link>
      </div>
    </div>
  );
}