import Link from "next/link";
import { Logo } from "@/components/admin/Logo";
import { RegisterForm } from "@/components/admin/RegisterForm";
import { inspectInvite } from "@/lib/admin/users";

export const metadata = { title: "Регистрация" };
export const dynamic = "force-dynamic"; // token check hits the DB

type SearchParams = { token?: string };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { token = "" } = await searchParams;
  const invite = token ? await inspectInvite(token) : { valid: false, reason: "missing" as const };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-app px-6 py-12">
      <div className="w-full max-w-[440px] rounded-xl bg-surface p-8 sm:p-10">
        <div className="mb-8 [&_span]:!text-dark [&_span_span]:!text-dark/56">
          <Logo />
        </div>

        {invite.valid ? (
          <>
            <h1 className="h3 mb-2 text-dark">Приглашение в админку</h1>
            <p className="p2 mb-8 text-dark/56">
              {invite.label ? `Для: ${invite.label}. ` : ""}
              Придумай логин и пароль — после создания тебя залогинит автоматически.
            </p>
            <RegisterForm token={token} />
          </>
        ) : (
          <>
            <h1 className="h3 mb-2 text-dark">Приглашение не активно</h1>
            <p className="p2 mb-6 text-dark/56">
              {reasonText(invite.reason)}
            </p>
            <Link
              href="/admin/login"
              className="inline-flex h-11 items-center rounded-md border border-dark/12 bg-surface px-4 text-[15px] font-semibold text-dark transition-colors hover:bg-dark/6"
            >
              ← Ко входу
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function reasonText(reason?: string): string {
  switch (reason) {
    case "not-found":
      return "Токен не найден. Возможно, ссылка была повреждена.";
    case "used":
      return "Это приглашение уже использовано. Если это ты регистрировался — просто залогинься. Если нет — попроси новую ссылку.";
    case "expired":
      return "Срок действия приглашения истёк (7 дней). Попроси новую ссылку у администратора.";
    case "missing":
    default:
      return "В ссылке нет токена. Открой полную ссылку из приглашения.";
  }
}
