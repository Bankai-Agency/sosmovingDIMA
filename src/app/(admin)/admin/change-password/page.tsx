import { Logo } from "@/components/admin/Logo";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { auth } from "@/lib/auth";

export const metadata = { title: "Смена пароля" };

export default async function ChangePasswordPage() {
  const session = await auth();
  const forced = Boolean((session?.user as { mustChangePassword?: boolean } | undefined)?.mustChangePassword);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-app px-6 py-12">
      <div className="w-full max-w-[440px] rounded-xl bg-surface p-8 sm:p-10">
        <div className="mb-8 [&_span]:!text-dark [&_span_span]:!text-dark/56">
          <Logo />
        </div>

        <h1 className="h3 mb-2 text-dark">Смена пароля</h1>
        <p className="p2 mb-8 text-dark/56">
          {forced
            ? "Это первый вход — придумай новый пароль. Текущий (seed) пароль временный и его нужно заменить."
            : "Обнови пароль на новый — текущий тебе понадобится для подтверждения."}
        </p>

        <ChangePasswordForm />
      </div>
    </div>
  );
}
