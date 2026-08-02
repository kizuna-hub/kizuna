import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleX,
  FileText,
  Handshake,
  MessageSquareText,
  ShieldCheck,
  Target,
  Upload,
  UserRoundSearch,
  UsersRound,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

import { ActiveVentureLineChart } from "../components/admin-charts";
import {
  AdminHeaderControls,
  AdminPanel,
  AdminUpdatedFooter,
  PersonAvatar,
  VentureMark,
} from "../components/admin-ui";
import {
  agriconnectDetail,
  universityProgram,
} from "../lib/university-admin-mock-data";
import type { UniversityVenture } from "../types";

function DimensionList() {
  const dimensionIcons = [
    UsersRound,
    Target,
    Handshake,
    MessageSquareText,
    ShieldCheck,
    BarChart3,
  ];

  return (
    <AdminPanel className="p-4">
      <h2 className="text-sm font-semibold">
        Điểm theo 6 chiều đánh giá
      </h2>
      <div className="mt-4 space-y-4">
        {agriconnectDetail.dimensions.map((dimension, index) => {
          const Icon = dimensionIcons[index];
          const color =
            dimension.score < 30
              ? "var(--admin-red)"
              : dimension.score < 60
                ? "var(--admin-primary)"
                : "var(--admin-green)";
          return (
            <div
              key={dimension.label}
              className="grid items-center gap-3 sm:grid-cols-[34px_185px_minmax(100px,1fr)_62px]"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--admin-blue-soft)] text-[var(--admin-primary)]">
                <Icon className="size-4" />
              </span>
              <span>
                <span className="block text-xs font-semibold">
                  {dimension.label}
                </span>
                <span className="block text-[9px] text-[var(--admin-muted)]">
                  {dimension.description}
                </span>
              </span>
              <span className="h-1.5 overflow-hidden rounded-full bg-[var(--admin-surface-muted)]">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${dimension.score}%`,
                    background: color,
                  }}
                />
              </span>
              <span className="text-right">
                <span className="text-sm font-semibold">
                  {dimension.score}
                </span>
                <span className="text-[10px] text-[var(--admin-muted)]">
                  /100
                </span>
              </span>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="mt-6 text-xs font-medium text-[var(--admin-primary)]"
      >
        Xem chi tiết đánh giá →
      </button>
    </AdminPanel>
  );
}

export function UniversityAdminVentureDetailScreen({
  venture,
}: {
  venture: UniversityVenture;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/university-admin/ventures"
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--admin-muted)] hover:text-[var(--admin-primary)]"
        >
          <span className="flex size-9 items-center justify-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
            <ArrowLeft className="size-4" />
          </span>
          Ventures
          <span>›</span>
          <strong className="text-[var(--admin-text)]">{venture.name}</strong>
        </Link>
        <AdminHeaderControls />
      </div>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <VentureMark venture={venture} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {venture.name}
            </h1>
            <span className="rounded-full bg-[var(--admin-green-soft)] px-3 py-1 text-[10px] font-medium text-[var(--admin-green)]">
              Đang hoạt động
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">
            {venture.description} – hợp tác xã – thị trường qua dữ liệu và
            đơn hàng số
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
            <span className="rounded-full bg-[var(--admin-surface-muted)] px-3 py-1.5">
              Stage: <strong>{venture.stage}</strong>
            </span>
            <span className="rounded-full bg-[var(--admin-surface-muted)] px-3 py-1.5">
              Founder: <strong>{venture.founder.name}</strong>
            </span>
            <span className="rounded-full bg-[var(--admin-surface-muted)] px-3 py-1.5">
              Team size: <strong>4 thành viên</strong>
            </span>
            <span className="rounded-full bg-[var(--admin-surface-muted)] px-3 py-1.5">
              Cohort: <strong>{universityProgram.name}</strong>
            </span>
          </div>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_.72fr_.9fr]">
        <AdminPanel className="p-4">
          <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
            <div>
              <h2 className="text-sm font-semibold">
                Điểm readiness tổng thể
              </h2>
              <p className="mt-6 font-mono text-5xl font-semibold text-[var(--admin-purple)]">
                {agriconnectDetail.readiness}
                <span className="text-lg text-[var(--admin-muted)]">
                  /100
                </span>
              </p>
              <p className="mt-4 text-[10px] text-[var(--admin-muted)]">
                Dữ liệu cập nhật: 19/05/2026
              </p>
            </div>
            <div>
              <h3 className="text-xs font-medium">
                Xu hướng readiness (7 ngày qua)
              </h3>
              <ActiveVentureLineChart
                compact
                data={agriconnectDetail.readinessTrend}
              />
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="p-4">
          <h2 className="text-sm font-semibold">
            Vấn đề chính (Blocker)
          </h2>
          <div className="mt-3 rounded-lg bg-[var(--admin-red-soft)] px-4 py-3 text-center text-xs font-semibold text-[var(--admin-red)]">
            Thiếu minh chứng khách hàng
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--admin-muted)]">
            {agriconnectDetail.blocker}
          </p>
          <button className="mt-5 text-xs font-medium text-[var(--admin-primary)]">
            Xem chi tiết vấn đề →
          </button>
        </AdminPanel>

        <AdminPanel className="p-4">
          <h2 className="text-sm font-semibold">Tại sao được đánh dấu</h2>
          <p className="mt-2 text-[10px] text-[var(--admin-muted)]">
            Dựa trên các tín hiệu từ đánh giá, hoạt động và tài liệu gần
            đây:
          </p>
          <ul className="mt-3 space-y-2 text-[10px]">
            {agriconnectDetail.flags.map((flag) => (
              <li key={flag.label} className="flex items-start gap-2">
                {flag.status === "danger" ? (
                  <CircleX className="mt-0.5 size-3.5 text-[var(--admin-red)]" />
                ) : flag.status === "warning" ? (
                  <AlertTriangle className="mt-0.5 size-3.5 text-[var(--admin-orange)]" />
                ) : (
                  <CheckCircle2 className="mt-0.5 size-3.5 text-[var(--admin-green)]" />
                )}
                {flag.label}
              </li>
            ))}
          </ul>
        </AdminPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_1.4fr]">
        <DimensionList />
        <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
          <AdminPanel className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Hoạt động gần đây</h2>
              <button className="text-[10px] text-[var(--admin-primary)]">
                Xem tất cả →
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {agriconnectDetail.activities.map((activity, index) => {
                const Icon = [CheckCircle2, Wrench, MessageSquareText, Upload][
                  index
                ];
                return (
                  <div
                    key={activity.title}
                    className="flex items-start gap-3 text-[10px]"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-[var(--admin-green-soft)] text-[var(--admin-green)]">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block text-xs">{activity.title}</strong>
                      <span className="text-[var(--admin-muted)]">
                        {activity.detail}
                      </span>
                    </span>
                    <span className="text-[var(--admin-muted)]">
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </AdminPanel>

          <AdminPanel className="p-4">
            <h2 className="text-sm font-semibold">
              Kết nối mentor hiện tại
            </h2>
            {venture.mentor ? (
              <div className="mt-4 flex items-center gap-3">
                <PersonAvatar
                  name={venture.mentor.name}
                  src={venture.mentor.avatar}
                  size="md"
                />
                <span>
                  <strong className="block text-xs">
                    Trần Minh Quân
                  </strong>
                  <span className="text-[10px] text-[var(--admin-muted)]">
                    Mentor · Marketing & Growth
                  </span>
                  <span className="mt-1 block text-[10px] text-[var(--admin-green)]">
                    ● Đang đồng hành
                  </span>
                </span>
              </div>
            ) : (
              <p className="mt-4 text-xs text-[var(--admin-muted)]">
                Venture chưa kết nối mentor.
              </p>
            )}
            <div className="mt-4 rounded-lg bg-[var(--admin-blue-soft)] p-3 text-[10px]">
              <span className="block text-[var(--admin-muted)]">
                Lần trao đổi gần nhất
              </span>
              <strong>19/05/2026</strong>
            </div>
            <Button
              variant="outline"
              className="mt-3 w-full border-[var(--admin-border)] bg-transparent text-xs"
            >
              Xem lịch sử trao đổi →
            </Button>
          </AdminPanel>

          <AdminPanel className="p-4 lg:col-span-2">
            <h2 className="text-sm font-semibold">
              Đề xuất hỗ trợ từ chương trình
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Wrench,
                  title: "Tham gia workshop",
                  detail: "Customer Discovery & Validation",
                  action: "Đăng ký",
                },
                {
                  icon: UserRoundSearch,
                  title: "Gợi ý mentor chuyên môn",
                  detail: "Mentor về Sales & Validation",
                  action: "Xem gợi ý",
                },
                {
                  icon: FileText,
                  title: "Theo dõi 1:1",
                  detail: "Check-in với program manager",
                  action: "Đặt lịch",
                },
              ].map((support) => (
                <div
                  key={support.title}
                  className="rounded-lg border border-[var(--admin-border)] p-3"
                >
                  <support.icon className="size-5 text-[var(--admin-primary)]" />
                  <strong className="mt-2 block text-xs">
                    {support.title}
                  </strong>
                  <span className="mt-1 block text-[10px] text-[var(--admin-muted)]">
                    {support.detail}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 h-8 w-full border-[var(--admin-border)] text-[10px]"
                  >
                    {support.action}
                  </Button>
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-blue-soft)] px-4 py-3 text-[10px] text-[var(--admin-muted)]">
        <ShieldCheck className="size-4 shrink-0 text-[var(--admin-primary)]" />
        <span>
          <strong className="text-[var(--admin-text)]">Quyền riêng tư:</strong>{" "}
          Tin nhắn riêng giữa founder và mentor, cùng với tài liệu thô
          (raw documents) không hiển thị cho quản trị viên nhà trường.
        </span>
      </div>

      <AdminUpdatedFooter />
    </div>
  );
}
