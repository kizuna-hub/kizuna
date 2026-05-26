"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // Thêm import router
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { WavyBackground } from "./wavy-background";
import { authCopy, authFields, type AuthMode, type FieldConfig } from "./auth-config";

type AuthPageProps = {
  mode: AuthMode;
};

const authEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: authEase, staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: authEase,
    },
  },
};

function AuthInput({ field }: { field: FieldConfig }) {
  const Icon = field.icon;
  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor={field.id} className="text-[13px] font-medium text-zinc-700">
        {field.label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" strokeWidth={2} />
        <Input
          id={field.id}
          name={field.id}
          type={field.type}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          required
          className="h-11 w-full rounded-xl border-zinc-200 bg-white pl-10 text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:border-[#0a1c13] focus-visible:ring-1 focus-visible:ring-[#0a1c13]"
        />
      </div>
    </div>
  );
}

export function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const pageCopy = authCopy[mode];
  const isLogin = mode === "login";

  // Hàm xử lý điền nhanh dữ liệu cho BGK/Demo
  const fillMockData = (email: string) => {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = "123456";
  };

  // Hàm xử lý Submit Form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLogin) return; // Tạm thời chỉ xử lý mock cho Login

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().trim().toLowerCase();

    // Logic điều hướng dựa trên Role
    if (email === "startup@kizuna.com") {
      router.push("/vi");
    } else if (email === "mentor@kizuna.com") {
      router.push("/vi/mentor-dashboard");
    } else if (email === "investor@kizuna.com") {
      router.push("/vi/investor-dashboard");
    } else {
      // Fallback nếu nhập linh tinh, cứ cho về trang startup hoặc báo lỗi
      alert("Tài khoản chưa đăng ký. Hãy dùng các email test (startup/mentor/investor@kizuna.com)");
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">

      <WavyBackground />

      <a
        href="https://kizuna-landing.vercel.app/"
        className="absolute left-6 top-6 z-50 flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" strokeWidth={2} />
        Về trang chủ
      </a>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={cn(
          "relative z-10 w-full mx-4 overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]",
          isLogin ? "max-w-[400px]" : "max-w-[500px]"
        )}
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center text-center mb-6">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#0a1c13]/5 text-[#0a1c13]">
            <ShieldCheck className="size-6" strokeWidth={2} />
          </div>

          <h1 className="font-serif text-2xl font-semibold tracking-tight text-zinc-900">
            {pageCopy.title}
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
            {pageCopy.subtitle}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lôgic Render Form */}
          {isLogin ? (
            <div className="space-y-4">
              {authFields.login.map((field) => (
                <motion.div key={field.id} variants={itemVariants}>
                  <AuthInput field={field} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <AuthInput field={authFields.signup[0]} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <AuthInput field={authFields.signup[1]} />
                </motion.div>
              </div>
              <motion.div variants={itemVariants}>
                <AuthInput field={authFields.signup[2]} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <AuthInput field={authFields.signup[3]} />
              </motion.div>
            </div>
          )}

          {/* Các chức năng phụ */}
          {isLogin && (
            <motion.div variants={itemVariants} className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-[13px] text-zinc-600 cursor-pointer hover:text-zinc-900">
                <input type="checkbox" className="size-3.5 rounded border-zinc-300 accent-[#0a1c13]" />
                <span>Ghi nhớ tôi</span>
              </label>
              <Link href="#" className="text-[13px] font-medium text-zinc-900 hover:underline">
                Quên mật khẩu?
              </Link>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="pt-2">
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-[#102c1e] hover:bg-[#0a1c13] text-[13px] font-semibold text-white shadow-md transition-colors"
            >
              {pageCopy.action}
              <ArrowRight className="ml-1.5 size-4" strokeWidth={2} />
            </Button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="mt-6 border-t border-zinc-100 pt-6 text-center text-[13px] text-zinc-500">
          <p>
            {pageCopy.footerText}{" "}
            <a href={pageCopy.footerHref} className="font-semibold text-zinc-900 hover:underline">
              {pageCopy.footerCta}
            </a>
          </p>
          <p className="mt-4 text-[11px] text-zinc-400">
            Bằng việc tiếp tục, bạn đồng ý với Điều khoản và Chính sách bảo mật của chúng tôi.
          </p>
        </motion.div>

      </motion.div>
    </main>
  );
}