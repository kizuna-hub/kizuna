import { Building2, LockKeyhole, Mail, UserRound, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export type AuthMode = "login" | "signup";

export type FieldConfig = {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    autoComplete: string;
    icon: LucideIcon | ComponentType<{ className?: string; strokeWidth?: number }>;
};

export const authCopy = {
    login: {
        eyebrow: "Founder workspace",
        title: "Chào mừng trở lại",
        subtitle: "Đăng nhập để bảo vệ IP ledger, investor room và các ghi chú vận hành của bạn.",
        action: "Đăng nhập",
        footerText: "Chưa có tài khoản?",
        footerCta: "Đăng ký ngay",
        footerHref: "https://kizuna-swart.vercel.app/vi/auth/signup",
        noteTitle: "Quyền kiểm soát tin cậy cho Founder",
        noteBody: "Kizuna mang đến cho team chúng tôi một không gian tập trung để chuẩn bị các tài liệu nhạy cảm trước các cuộc gọi với nhà đầu tư.",
        noteMeta: "Minh Tran, Founder vòng Seed",
    },
    signup: {
        eyebrow: "Early access",
        title: "Bắt đầu hành trình",
        subtitle: "Tạo workspace trên Kizuna Hub và tổ chức startup của bạn ngay từ ngày đầu tiên.",
        action: "Tạo tài khoản",
        footerText: "Đã có tài khoản?",
        footerCta: "Đăng nhập",
        footerHref: "https://kizuna-swart.vercel.app/vi/auth/login",
        noteTitle: "Dành cho các Operator thực thụ",
        noteBody: "Quy trình onboarding đã giúp chúng tôi biến các ghi chú chiến lược rời rạc thành các tài liệu investor-ready chỉ trong một buổi chiều.",
        noteMeta: "Linh Nguyen, Lead tại Venture Studio",
    },
} satisfies Record<AuthMode, Record<string, string>>;

export const authFields: Record<AuthMode, FieldConfig[]> = {
    login: [
        { id: "email", label: "Email công việc", type: "email", placeholder: "founder@company.com", autoComplete: "email", icon: Mail },
        { id: "password", label: "Mật khẩu", type: "password", placeholder: "Nhập mật khẩu của bạn", autoComplete: "current-password", icon: LockKeyhole },
    ],
    signup: [
        { id: "full-name", label: "Họ và tên", type: "text", placeholder: "Tên của bạn", autoComplete: "name", icon: UserRound },
        { id: "company", label: "Tên công ty", type: "text", placeholder: "Kizuna Labs", autoComplete: "organization", icon: Building2 },
        { id: "email", label: "Email công việc", type: "email", placeholder: "founder@company.com", autoComplete: "email", icon: Mail },
        { id: "password", label: "Mật khẩu", type: "password", placeholder: "Tạo mật khẩu", autoComplete: "new-password", icon: LockKeyhole },
    ],
};