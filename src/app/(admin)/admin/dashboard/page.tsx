import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { TopBar } from "@/components/admin/TopBar";
import { getSiteStats, getScheduledPosts } from "@/lib/admin/stats";
import {
  getRecentCommits,
  getTopCategories,
  getStatusCounts,
  getIntegrations,
} from "@/lib/admin/dashboard";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const stats = getSiteStats();
  const status = getStatusCounts();
  const scheduled = getScheduledPosts();
  const commits = getRecentCommits(8);
  const categories = getTopCategories(6);
  const integrations = getIntegrations();

  return (
    <AdminShell>
      <TopBar
        title="Dashboard"
        actions={<span className="caption text-dark/56">Последний билд: {stats.lastBuildHint}</span>}
      />
      <div className="flex-1 p-6">
        {/* Row 1 — hero metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Всего страниц в билде" value={stats.totalPages.toLocaleString("ru-RU")} hint="public/pages/*.html" />
          <Metric label="Статей в блоге" value={(status.published + status.drafts + status.scheduled).toString()} hint={`${status.published} published · ${status.drafts} draft · ${status.scheduled} scheduled`} />
          <Metric label="Городов" value={stats.totalCities.toString()} hint="landing-страницы" />
          <Metric label="Услуг" value={stats.totalServices.toString()} hint="service-страницы" />
        </div>

        {/* Row 2 — lists */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Scheduled */}
          <div className="rounded-xl bg-surface p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="h6 text-dark">Запланировано</h3>
              <Link href="/admin/content" className="caption text-link hover:underline">Все →</Link>
            </div>
            {scheduled.length === 0 ? (
              <p className="p2 text-dark/56">Нет запланированных публикаций.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {scheduled.slice(0, 5).map((p) => (
                  <li key={p.slug} className="flex flex-col gap-1">
                    <Link href={`/admin/content/${p.slug}`} className="p2 font-semibold text-dark hover:text-link">
                      {p.title}
                    </Link>
                    <span className="caption text-dark/56">
                      {p.publishAt ? new Date(p.publishAt).toLocaleString("ru-RU") : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent commits */}
          <div className="rounded-xl bg-surface p-5 lg:col-span-2">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="h6 text-dark">Недавние правки контента</h3>
              <span className="caption text-dark/56">git log · src/data/blog</span>
            </div>
            {commits.length === 0 ? (
              <p className="p2 text-dark/56">
                Не удалось прочитать git log (или репо ещё не инициализирован).
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-dark/6">
                {commits.map((c) => (
                  <li key={c.hash} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                    <code className="caption w-14 shrink-0 font-mono text-dark/56">{c.hash}</code>
                    <div className="min-w-0 flex-1">
                      <div className="p2 truncate font-semibold text-dark">{c.subject}</div>
                      <div className="caption text-dark/56">
                        {c.author} · {new Date(c.date).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Row 3 — categories + integrations */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-surface p-5">
            <h3 className="h6 mb-4 text-dark">Топ категорий блога</h3>
            {categories.length === 0 ? (
              <p className="p2 text-dark/56">Нет данных.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {categories.map((c) => {
                  const max = categories[0].count || 1;
                  const pct = Math.round((c.count / max) * 100);
                  return (
                    <li key={c.category} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="p2 truncate text-dark">{c.category}</div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-dark/6">
                          <div className="h-full rounded-full bg-dark" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="caption w-10 text-right font-semibold text-dark">{c.count}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-xl bg-surface p-5">
            <h3 className="h6 mb-4 text-dark">Интеграции</h3>
            <ul className="flex flex-col gap-3">
              {integrations.map((i) => (
                <li key={i.key} className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      i.ready ? "bg-positive" : "bg-warning"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="p2 font-semibold text-dark">{i.name}</div>
                    <div className="caption text-dark/56">{i.hint}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 4 — pages by type */}
        <div className="mt-4 rounded-xl bg-surface p-5">
          <h3 className="h6 mb-4 text-dark">Разбивка страниц по типам</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
            {stats.pagesByType.map((b) => (
              <div key={b.type} className="rounded-md border border-dark/6 p-3">
                <div className="caption text-dark/56">{b.type}</div>
                <div className="mt-1 h5 text-dark">{b.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl bg-surface p-5">
      <div className="caption text-dark/56">{label}</div>
      <div className="mt-2 h3 text-dark">{value}</div>
      <div className="caption mt-2 text-dark/32">{hint}</div>
    </div>
  );
}
