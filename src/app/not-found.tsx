import Link from "next/link";

export default function NotFound() {
  return (
    <section data-tone="light" className="flex min-h-svh items-center bg-pergamino px-[var(--gutter)] pt-[var(--header-h)]">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow text-sepia-oscuro">Error 404</p>
        <h1 className="display mt-5 text-5xl">Esta página no existe.</h1>
        <p className="mt-5 text-sepia-oscuro">Puede que el enlace haya cambiado. Volvamos al principio de la historia.</p>
        <Link href="/" className="link-underline eyebrow mt-10 inline-block pb-1 text-borgona">
          Ir al inicio
        </Link>
      </div>
    </section>
  );
}
