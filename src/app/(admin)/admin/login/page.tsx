import { Logo } from "@/components/admin/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Войти" };

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      {/* Left — form */}
      <section className="flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="mb-12 [&_span]:!text-dark [&_span_span]:!text-dark/56">
            <Logo />
          </div>

          <h1 className="h2 mb-10 text-dark">Вход</h1>

          <LoginForm />
        </div>
      </section>

      {/* Right — illustration placeholder; matches ENOT layout */}
      <aside className="relative hidden bg-app lg:block">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h2 className="h3 mb-4 text-dark">Управляй контентом сайта</h2>
            <p className="p1 text-dark/56">
              Пиши, планируй публикации, следи за состоянием страниц — всё в одном месте.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
