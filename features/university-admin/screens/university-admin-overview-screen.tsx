import {
  Activity,
  CheckSquare2,
  CircleAlert,
  Handshake,
} from "lucide-react";

import {
  ActiveVentureLineChart,
  BottlenecksChart,
  ReadinessDistributionChart,
  StageMovementChart,
} from "../components/admin-charts";
import {
  AdminPageHeader,
  AdminPanel,
  AdminUpdatedFooter,
  KpiCard,
  PanelHeading,
} from "../components/admin-ui";
import { AttentionTable } from "../components/venture-tables";
import { universityVentures } from "../lib/university-admin-mock-data";

function MentorOverview() {
  const funnel = [
    ["Nhu cầu kết nối", "48"],
    ["Mentor phù hợp", "32"],
    ["Đã kết nối", "18"],
    ["Đã chấp nhận", "12"],
  ];

  return (
    <AdminPanel className="p-4">
      <PanelHeading title="Tổng quan mentor (cung – cầu)" />
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.1fr]">
        <div className="space-y-1">
          {funnel.map(([label, value], index) => (
            <div
              key={label}
              className="mx-auto flex h-10 items-center justify-center bg-[var(--admin-blue-soft)] text-center"
              style={{ width: `${100 - index * 12}%` }}
            >
              <span className="text-[9px] text-[var(--admin-muted)]">
                {label}{" "}
                <strong className="ml-1 text-sm text-[var(--admin-text)]">
                  {value}
                </strong>
              </span>
            </div>
          ))}
        </div>
        <dl className="space-y-3 text-[11px]">
          <div>
            <dt className="text-[var(--admin-muted)]">Tỷ lệ đáp ứng</dt>
            <dd className="mt-0.5 text-xl font-semibold text-[var(--admin-green)]">
              75%
            </dd>
          </div>
          <div>
            <dt className="text-[var(--admin-muted)]">
              Thời gian phản hồi TB
            </dt>
            <dd className="mt-0.5 text-base font-semibold">1.6 ngày</dd>
          </div>
          <div>
            <dt className="text-[var(--admin-muted)]">Tỷ lệ chấp nhận</dt>
            <dd className="mt-0.5 text-base font-semibold text-[var(--admin-purple)]">
              67%
            </dd>
          </div>
        </dl>
      </div>
    </AdminPanel>
  );
}

export function UniversityAdminOverviewScreen() {
  return (
    <div className="space-y-5">
      <AdminPageHeader title="Tổng quan chương trình" />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Venture hoạt động"
          value="24"
          trend="14%"
          icon={Activity}
          tone="blue"
        />
        <KpiCard
          label="Đã hoàn tất phân tích"
          value="18"
          suffix="/24"
          trend="8%"
          icon={CheckSquare2}
          tone="green"
        />
        <KpiCard
          label="Đang cần hỗ trợ"
          value="7"
          trend="2"
          icon={CircleAlert}
          tone="orange"
        />
        <KpiCard
          label="Kết nối được chấp nhận"
          value="12"
          trend="20%"
          icon={Handshake}
          tone="purple"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <AdminPanel className="min-w-0 p-4">
          <PanelHeading
            title="Cần chú ý"
            action={
              <span className="text-[10px] text-[var(--admin-primary)]">
                Xem tất cả →
              </span>
            }
          />
          <AttentionTable ventures={universityVentures.slice(0, 5)} />
        </AdminPanel>
        <AdminPanel className="min-w-0 p-4">
          <PanelHeading title="Xu hướng startup hoạt động" />
          <div className="mt-1 flex items-center gap-2 text-[10px] text-[var(--admin-muted)]">
            <span className="size-2 rounded-full bg-[var(--admin-primary)]" />
            Số venture hoạt động
          </div>
          <ActiveVentureLineChart />
        </AdminPanel>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminPanel className="min-w-0 p-4">
          <PanelHeading title="Dịch chuyển stage" />
          <StageMovementChart compact />
        </AdminPanel>
        <AdminPanel className="min-w-0 p-4">
          <PanelHeading title="Top bottlenecks" />
          <BottlenecksChart compact />
        </AdminPanel>
        <AdminPanel className="min-w-0 p-4">
          <PanelHeading title="Phân bố readiness" />
          <ReadinessDistributionChart compact />
        </AdminPanel>
        <MentorOverview />
      </section>

      <AdminUpdatedFooter />
    </div>
  );
}
