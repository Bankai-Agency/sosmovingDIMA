import { AdminShell } from "@/components/admin/AdminShell";
import { TopBar } from "@/components/admin/TopBar";
import { PagesTable } from "@/components/admin/PagesTable";
import { listPages } from "@/lib/admin/pages";

export const metadata = { title: "Страницы сайта" };
export const dynamic = "force-dynamic"; // mtimes change with deploys

export default function PagesHealthPage() {
  const rows = listPages();

  return (
    <AdminShell>
      <TopBar title="Страницы сайта" actions={<span className="caption text-dark/56">Всего: {rows.length}</span>} />
      <div className="flex-1 p-6">
        {/* Coming soon widgets — these tell the user what additional columns
            will appear once the respective integrations are wired. */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ComingCard title="Core Web Vitals" hint="Vercel Speed Insights API → LCP/INP/CLS per page" />
          <ComingCard title="SEO coverage" hint="Search Console API → indexed? impressions? position?" />
          <ComingCard title="Lighthouse" hint="GitHub Action → performance / SEO / a11y score" />
          <ComingCard title="Broken links/images" hint="Cron crawler → 404-checker per page" />
        </div>

        <PagesTable rows={rows} />
      </div>
    </AdminShell>
  );
}

function ComingCard({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-xl border border-dashed border-dark/12 bg-surface p-4">
      <div className="flex items-center justify-between">
        <h4 className="p2 font-semibold text-dark">{title}</h4>
        <span className="caption rounded-full bg-warning-soft px-2 py-0.5 font-semibold text-dark">
          план
        </span>
      </div>
      <p className="caption mt-1 text-dark/56">{hint}</p>
    </div>
  );
}
