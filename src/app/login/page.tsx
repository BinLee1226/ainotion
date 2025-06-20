"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoginForm } from "./login-form";
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("formData", formData);

    e.preventDefault();
    setIsLoading(true);

    // 模拟登录请求
    try {
      if (formData.username === "admin" && formData.password === "123456") {
        toast.success("欢迎回到 BinLee Notion!");
        router.push("/dashboard");
      } else {
        toast.error("账号或密码错误");
      }
    } catch (err) {
      console.log(err, "err");
      toast.error("登录失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log([e.target.name], e.target.value);

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 背景动画元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-40 left-40 h-80 w-80 rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-30"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>
      <LoginForm
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        formData={formData}
        isLoading={isLoading}
      />
    </div>
  );
}
