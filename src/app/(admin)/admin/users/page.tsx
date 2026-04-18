import { AdminShell } from "@/components/admin/AdminShell";
import { TopBar } from "@/components/admin/TopBar";
import { InviteForm } from "@/components/admin/InviteForm";
import { UserRowActions } from "@/components/admin/UserRowActions";
import { RevokeInviteButton } from "@/components/admin/RevokeInviteButton";
import { auth } from "@/lib/auth";
import { listUsers, listActiveInvites, LIMITS } from "@/lib/admin/users";

export const metadata = { title: "Пользователи" };
export const dynamic = "force-dynamic"; // always fresh — DB-backed

export default async function UsersPage() {
  const session = await auth();
  const meId = (session?.user as { id?: string }).id ?? "";

  const [users, invites] = await Promise.all([listUsers(), listActiveInvites()]);
  const remaining = LIMITS.MAX_USERS - users.length - invites.length;

  return (
    <AdminShell>
      <TopBar
        title="Пользователи"
        actions={
          <span className="caption text-dark/56">
            {users.length} / {LIMITS.MAX_USERS} · свободно {Math.max(0, remaining)}
          </span>
        }
      />
      <div className="flex-1 p-6">
        <div className="mb-4 grid grid-cols-3 gap-4">
          <Stat label="Активных редакторов" value={users.length} />
          <Stat label="Приглашений в ожидании" value={invites.length} />
          <Stat label="Лимит" value={LIMITS.MAX_USERS} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
          {/* Users table */}
          <div className="overflow-hidden rounded-xl bg-surface">
            <div className="border-b border-dark/6 p-5">
              <h3 className="h6 text-dark">Редакторы</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark/6 bg-dark/6">
                  <th className="caption px-4 py-3 text-left font-semibold text-dark/56">Логин</th>
                  <th className="caption px-4 py-3 text-left font-semibold text-dark/56">Роль</th>
                  <th className="caption px-4 py-3 text-left font-semibold text-dark/56">Создан</th>
                  <th className="caption px-4 py-3 text-left font-semibold text-dark/56">Последний вход</th>
                  <th className="caption px-4 py-3 text-right font-semibold text-dark/56">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-dark/6 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-semibold text-dark">
                          {u.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="p2 font-semibold text-dark">{u.username}</div>
                          {u.name && <div className="caption text-dark/56">{u.name}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="caption rounded-full bg-dark/6 px-2.5 py-1 font-semibold text-dark">
                        {u.role}
                        {u.id === meId && " · ты"}
                      </span>
                    </td>
                    <td className="px-4 py-3 caption text-dark/56">
                      {u.createdAt.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 caption text-dark/56">
                      {u.lastLoginAt
                        ? u.lastLoginAt.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <UserRowActions id={u.id} isSelf={u.id === meId} isOwner={u.role === "owner"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Side: invite + pending invites */}
          <aside className="flex flex-col gap-4">
            <section className="rounded-xl bg-surface p-5">
              <h3 className="h6 mb-3 text-dark">Пригласить редактора</h3>
              {remaining <= 0 ? (
                <p className="caption rounded-md bg-warning-soft p-3 text-dark">
                  Лимит {LIMITS.MAX_USERS} редакторов достигнут. Удали кого-то или отзови приглашение.
                </p>
              ) : (
                <InviteForm />
              )}
            </section>

            <section className="rounded-xl bg-surface p-5">
              <h3 className="h6 mb-3 text-dark">Ожидающие приглашения</h3>
              {invites.length === 0 ? (
                <p className="caption text-dark/56">Приглашений нет.</p>
              ) : (
                <ul className="flex flex-col divide-y divide-dark/6">
                  {invites.map((i) => (
                    <li key={i.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="flex-1">
                        <div className="p2 font-semibold text-dark">{i.label ?? "без комментария"}</div>
                        <div className="caption text-dark/56">
                          до {i.expiresAt.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                        </div>
                      </div>
                      <RevokeInviteButton id={i.id} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-surface p-4">
      <div className="caption text-dark/56">{label}</div>
      <div className="mt-1 h4 text-dark">{value}</div>
    </div>
  );
}
