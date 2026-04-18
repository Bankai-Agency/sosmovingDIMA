import { eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { TopBar } from "@/components/admin/TopBar";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const metadata = { title: "Настройки" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  const id = (session?.user as { id?: string }).id ?? "";

  const me = id ? await db.query.users.findFirst({ where: eq(users.id, id) }) : null;

  // Env-driven integration statuses — we read what's set without exposing values.
  const integrations = {
    githubApi: Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO),
    cron: Boolean(process.env.CRON_SECRET),
    db: Boolean(process.env.DATABASE_URL),
    analytics: Boolean(process.env.VERCEL_ANALYTICS_ID),
    searchConsole: Boolean(process.env.SEARCH_CONSOLE_SITE),
    sentry: Boolean(process.env.SENTRY_DSN),
  };

  return (
    <AdminShell>
      <TopBar title="Настройки" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Main column */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <section className="rounded-xl bg-surface p-6">
              <h3 className="h6 mb-4 text-dark">Профиль</h3>
              <ProfileForm
                username={me?.username ?? ""}
                initialName={me?.name ?? ""}
                initialEmail={me?.email ?? ""}
              />
            </section>

            <section className="rounded-xl bg-surface p-6">
              <h3 className="h6 mb-4 text-dark">Смена пароля</h3>
              <PasswordForm />
            </section>
          </div>

          {/* Side column */}
          <div className="flex flex-col gap-4">
            <section className="rounded-xl bg-surface p-6">
              <h3 className="h6 mb-3 text-dark">Интеграции</h3>
              <ul className="flex flex-col gap-3">
                <Integration
                  name="Postgres (Neon)"
                  status={integrations.db ? "on" : "off"}
                  hint={integrations.db ? "Подключено" : "DATABASE_URL не задан"}
                />
                <Integration
                  name="Git commits"
                  status={integrations.githubApi ? "on" : "pending"}
                  hint={
                    integrations.githubApi
                      ? "Пишем в GitHub, Vercel ребилдит"
                      : "GITHUB_TOKEN не задан — в dev пишем в файловую систему"
                  }
                />
                <Integration
                  name="Cron (scheduled publish)"
                  status={integrations.cron ? "on" : "pending"}
                  hint={integrations.cron ? "CRON_SECRET задан" : "CRON_SECRET не задан (прод)"}
                />
                <Integration
                  name="Vercel Analytics"
                  status={integrations.analytics ? "on" : "pending"}
                  hint={integrations.analytics ? "" : "VERCEL_ANALYTICS_ID не задан"}
                />
                <Integration
                  name="Search Console"
                  status={integrations.searchConsole ? "on" : "pending"}
                  hint={integrations.searchConsole ? "" : "OAuth ещё не привязан"}
                />
                <Integration
                  name="Sentry"
                  status={integrations.sentry ? "on" : "pending"}
                  hint={integrations.sentry ? "" : "SENTRY_DSN не задан"}
                />
              </ul>
            </section>

            <section className="rounded-xl bg-surface p-6">
              <h3 className="h6 mb-3 text-dark">Опасная зона</h3>
              <button
                type="button"
                className="h-10 w-full rounded-md border border-negative/32 bg-negative-soft px-4 text-[15px] font-semibold text-negative transition-colors hover:bg-negative hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                disabled
                title="Deploy hook нужно настроить в Vercel — пока заглушка"
              >
                Запустить ручной ребилд
              </button>
              <p className="caption mt-2 text-dark/56">
                Когда появится Deploy hook URL — кнопка дёрнет его через /api/rebuild.
              </p>
            </section>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Integration({
  name,
  status,
  hint,
}: {
  name: string;
  status: "on" | "off" | "pending";
  hint: string;
}) {
  const dot =
    status === "on" ? "bg-positive" : status === "pending" ? "bg-warning" : "bg-dark/32";
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <div className="flex-1">
        <div className="p2 font-semibold text-dark">{name}</div>
        {hint && <div className="caption text-dark/56">{hint}</div>}
      </div>
    </li>
  );
}
