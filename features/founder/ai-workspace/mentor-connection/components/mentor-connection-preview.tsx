import type { MentorConnectionBrief } from "../types/mentor-connection.types";

export function MentorConnectionPreview({
  brief,
}: {
  brief: MentorConnectionBrief;
}) {
  const challenge = brief.sections.find(
    (section) => section.id === "current_challenge",
  );
  const support = brief.sections.find(
    (section) => section.id === "support_needed",
  );

  return (
    <section className="rounded-xl border border-workspace-border bg-workspace-elevated p-4">
      <p className="workspace-eyebrow text-primary">
        Kiểm tra lần cuối
      </p>
      <h2 className="mt-1 workspace-card-title text-ink">
        Yêu cầu kết nối
      </h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Mentor
          </dt>
          <dd className="mt-1 workspace-supporting text-ink">
            {brief.mentorSnapshot.name}
          </dd>
        </div>
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Founder cần hỗ trợ
          </dt>
          <dd className="mt-1 workspace-supporting text-ink">
            {support?.checklistItems?.length ?? 0} mục
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Khó khăn hiện tại
          </dt>
          <dd className="mt-1 workspace-supporting text-ink">
            {challenge?.content}
          </dd>
        </div>
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Context gửi kèm
          </dt>
          <dd className="mt-1 workspace-supporting text-ink">
            {brief.selectedContext.length} mục
          </dd>
        </div>
      </dl>
    </section>
  );
}
