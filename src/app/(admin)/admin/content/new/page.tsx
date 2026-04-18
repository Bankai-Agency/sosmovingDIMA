import { AdminShell } from "@/components/admin/AdminShell";
import { TopBar } from "@/components/admin/TopBar";
import { createPost } from "../actions";

export const metadata = { title: "Новая статья" };

export default function NewPostPage() {
  return (
    <AdminShell>
      <TopBar title="Новая статья" />
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-xl rounded-xl bg-surface p-8">
          <h2 className="h4 mb-2 text-dark">Назови статью</h2>
          <p className="p2 mb-6 text-dark/56">
            Из заголовка сгенерится slug. Потом откроется редактор — наполнишь содержимым и опубликуешь.
          </p>
          <form action={createPost} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="caption text-dark/56">Заголовок</span>
              <input
                name="title"
                type="text"
                required
                autoFocus
                placeholder="How to pack for a move without losing your mind"
                className="h-12 rounded-md border border-dark/12 bg-surface px-4 text-[15px] leading-5 outline-none placeholder:text-dark/32 focus:border-dark"
              />
            </label>
            <button
              type="submit"
              className="h-12 rounded-md bg-dark px-4 text-[15px] font-semibold text-white transition-colors hover:bg-dark/90"
            >
              Создать и открыть редактор →
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
