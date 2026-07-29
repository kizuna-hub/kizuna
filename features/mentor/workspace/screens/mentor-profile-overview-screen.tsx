import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

import { canonicalMentorPersona } from "../demo/mentor-workspace-demo-data";

export function MentorProfileOverviewScreen() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <header className="border-b border-workspace-border pb-5">
        <h1 className="workspace-page-title">Hồ sơ mentor</h1>
        <p className="mt-1 workspace-card-body text-workspace-muted-text">
          Context founder nhìn thấy trước khi gửi yêu cầu kết
          nối.
        </p>
      </header>

      <section className="mt-4 overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel">
        <div className="grid gap-6 p-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
          <div className="relative size-24 overflow-hidden rounded-full border border-workspace-border bg-workspace-elevated">
            {canonicalMentorPersona.avatarSrc ? (
              <Image
                src={canonicalMentorPersona.avatarSrc}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-xl font-semibold">
                TMQ
              </span>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="workspace-page-title">
                {canonicalMentorPersona.name}
              </h2>
              <Badge
                variant="outline"
                className="border-workspace-success/30 bg-workspace-success-soft text-workspace-success"
              >
                <BadgeCheck />
                {canonicalMentorPersona.verificationLabel}
              </Badge>
            </div>
            <p className="mt-2 workspace-card-body text-workspace-muted-text">
              {canonicalMentorPersona.role} ·{" "}
              {canonicalMentorPersona.organization}
            </p>
            <p className="mt-4 workspace-supporting text-workspace-muted-text">
              {canonicalMentorPersona.experience}.{" "}
              {canonicalMentorPersona.mentoringBackground}.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/mentor/dashboard/settings">
              Cập nhật cài đặt
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="grid border-t border-workspace-border sm:grid-cols-3">
          <div className="p-5 sm:border-r sm:border-workspace-border">
            <BriefcaseBusiness className="size-5 text-primary" />
            <p className="mt-3 workspace-meta text-workspace-muted-text">
              Kinh nghiệm
            </p>
            <p className="mt-1 workspace-card-title">
              10+ năm sản phẩm số
            </p>
          </div>
          <div className="border-t border-workspace-border p-5 sm:border-r sm:border-t-0 sm:border-workspace-border">
            <UsersRound className="size-5 text-primary" />
            <p className="mt-3 workspace-meta text-workspace-muted-text">
              Đội đã hỗ trợ
            </p>
            <p className="mt-1 workspace-card-title">
              28 đội early-stage
            </p>
          </div>
          <div className="border-t border-workspace-border p-5 sm:border-t-0">
            <CheckCircle2 className="size-5 text-workspace-success" />
            <p className="mt-3 workspace-meta text-workspace-muted-text">
              Trạng thái
            </p>
            <p className="mt-1 workspace-card-title">
              Đang nhận kết nối
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-workspace-border bg-workspace-panel p-6">
        <h2 className="workspace-section-title">Chuyên môn</h2>
        <p className="mt-1 workspace-supporting text-workspace-muted-text">
          Kizuna dùng các chủ đề này để giải thích độ phù hợp với
          founder.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {canonicalMentorPersona.expertise.map((item) => (
            <Badge
              key={item}
              variant="outline"
              className="rounded-full border-primary-border bg-primary-soft px-3 py-1.5 text-primary"
            >
              {item}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
