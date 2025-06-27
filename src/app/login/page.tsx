"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import TypeIt from "typeit-react";
import {
  Brain,
  Github,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Zap,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import OtherSignIn from "@/components/other-signIn";
import { loginWithGithub } from "@/auth/login/action";

// 动画变体
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const buttonVariants: Variants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const tabContentVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
};

const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    x: [-5, 5, -5],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

type FormDataType = {
  username?: string;
  password?: string;
  phone?: string;
  smsCode?: string;
  email?: string;
  emailPassword?: string;
  rememberMe?: boolean;
};

interface LoginType extends FormDataType {
  type?: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("username");
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    emailPassword: false,
  });
  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    password: "",
    phone: "",
    smsCode: "",
    email: "",
    emailPassword: "",
    rememberMe: false,
  });
  const router = useRouter();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    let loginData: LoginType = {};
    let validationError = "";

    switch (activeTab) {
      case "username":
        if (!formData.username?.trim()) {
          validationError = "请输入用户名";
        } else if (!formData.password?.trim()) {
          validationError = "请输入密码";
        } else {
          loginData = {
            type: "username",
            username: formData.username.trim(),
            password: formData.password.trim(),
            rememberMe: formData.rememberMe,
          };
        }
        break;

      case "phone":
        if (!formData.phone?.trim()) {
          validationError = "请输入手机号";
        } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
          validationError = "请输入正确的手机号格式";
        } else if (!formData.smsCode?.trim()) {
          validationError = "请输入验证码";
        } else {
          loginData = {
            type: "phone",
            phone: formData.phone.trim(),
            smsCode: formData.smsCode.trim(),
            rememberMe: formData.rememberMe,
          };
        }
        break;

      case "email":
        if (!formData.email?.trim()) {
          validationError = "请输入邮箱地址";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          validationError = "请输入正确的邮箱格式";
        } else if (!formData.emailPassword?.trim()) {
          validationError = "请输入密码";
        } else {
          loginData = {
            type: "email",
            email: formData.email.trim(),
            password: formData.emailPassword,
            rememberMe: formData.rememberMe,
          };
        }
        break;
    }

    if (validationError) {
      toast.error(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await new Promise<{
        success: boolean;
        message?: string;
      }>((resolve) => {
        setTimeout(() => {
          if (activeTab === "username") {
            const success =
              loginData.username === "admin" && loginData.password === "123456";
            resolve({
              success: success !== undefined, // 直接比较是否不等于undefined
              message: success ? "登录成功" : "用户名或密码错误",
            });
          } else if (activeTab === "phone") {
            const success = loginData.smsCode === "123456";
            resolve({
              success,
              message: success ? "登录成功" : "验证码错误",
            });
          } else if (activeTab === "email") {
            // const success = loginData.email && loginData.password;
            const success = loginData.email === "test@example.com";
            resolve({
              success,
              message: success ? "登录成功" : "邮箱或密码错误",
            });
          }
        }, 1500);
      });

      if (response.success) {
        toast.success(response.message || "登录成功！正在跳转...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 300);
      } else {
        toast.error(response.message || "登录失败");
      }
    } catch (error) {
      toast.error("网络错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 几何图形背景 */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-purple-100 to-pink-200 opacity-50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 opacity-40 blur-3xl" />

        {/* 浮动元素 */}
        <motion.div
          className="absolute top-20 left-20"
          variants={floatingVariants}
          animate="animate"
        >
          <div className="rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 p-3 opacity-10">
            <Zap className="h-6 w-6 text-white" />
          </div>
        </motion.div>

        <motion.div
          className="absolute right-32 bottom-32"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
        >
          <div className="rounded-full bg-gradient-to-r from-purple-400 to-pink-500 p-2 opacity-10">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 flex min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 左侧装饰区域 */}
        <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:p-12">
          {/* 背景装饰元素 */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute right-1/3 bottom-1/3 h-24 w-24 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-2xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>
          <motion.div
            className="relative z-10 max-w-lg text-center"
            variants={itemVariants}
          >
            {/* Logo区域 */}
            <motion.div
              className="relative mb-8 inline-flex"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image src="/logo.svg" alt="logo" width={120} height={120} />
            </motion.div>
            {/* 标题 */}
            <motion.h1
              className="mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-5xl font-bold text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              AI Studio
            </motion.h1>

            {/* 副标题 */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="text-xl leading-relaxed font-bold text-gray-600">
                <TypeIt
                  options={{
                    strings: [
                      "探索人工智能的无限可能",
                      "解锁创意与技术的完美融合",
                      "开启智能化的数字未来",
                      "让AI成为您的创作伙伴",
                    ],
                    speed: 80,
                    deleteSpeed: 50,
                    nextStringDelay: 2000,
                    breakLines: false,
                    loop: true,
                    cursor: true,
                    cursorChar: "|",
                    cursorSpeed: 800,
                    lifeLike: true,
                  }}
                />
              </div>
              <motion.p
                className="mt-4 text-lg font-normal text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                智能助手 · 创意生成 · 数据洞察
              </motion.p>
            </motion.div>

            {/* 功能特性列表 */}
            <motion.div
              className="space-y-5 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {[
                {
                  color: "bg-blue-500",
                  text: "智能对话助手",
                  desc: "支持多轮对话，理解上下文",
                  icon: "💬",
                },
                {
                  color: "bg-indigo-500",
                  text: "创意内容生成",
                  desc: "文案、图片、视频一键生成",
                  icon: "✨",
                },
                {
                  color: "bg-purple-500",
                  text: "数据分析洞察",
                  desc: "智能分析，深度洞察数据价值",
                  icon: "📊",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className="group grid grid-cols-[auto_1fr] items-start gap-4" // 使用网格布局
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  whileHover={{ x: 5 }}
                >
                  {/* 点的容器 - 固定宽度 */}
                  <div className="flex h-6 w-6 items-center justify-center">
                    {" "}
                    {/* 固定宽高 */}
                    <motion.div
                      className={`h-3 w-3 ${feature.color} relative rounded-full`}
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className={`absolute inset-0 ${feature.color} rounded-full opacity-30`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* 内容区域 */}
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center space-x-2">
                      <span className="text-lg leading-none">
                        {feature.icon}
                      </span>
                      <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                        {feature.text}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-500">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* 底部统计信息 */}
            <motion.div
              className="mt-12 flex justify-center space-x-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {[
                { number: "100K+", label: "活跃用户" },
                { number: "1M+", label: "对话次数" },
                { number: "99.9%", label: "可用性" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                >
                  <div className="mb-1 text-2xl font-bold text-gray-900">
                    {stat.number}
                  </div>
                  <div className="text-xs tracking-wide text-gray-500 uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* 右侧登录表单 */}
        <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-12">
          <div className="w-full max-w-md">
            {/* 移动端Logo */}
            <motion.div
              className="mb-8 text-center lg:hidden"
              variants={itemVariants}
            >
              <div className="mb-4 inline-flex">
                <Image src="/logo.svg" alt="logo" width={60} height={60} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">AI Studio</h1>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="border-0 bg-white shadow-xl">
                <CardContent className="p-8">
                  <motion.div className="mb-6" variants={itemVariants}>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      欢迎回来
                    </h2>
                    <p className="mt-2 text-gray-600">请登录您的账户以继续</p>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      {/* 简约的Tab切换 */}
                      <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                        <TabsTrigger
                          value="username"
                          className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                        >
                          <User className="mr-2 h-4 w-4" />
                          账号
                        </TabsTrigger>
                        <TabsTrigger
                          value="phone"
                          className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          手机
                        </TabsTrigger>
                        <TabsTrigger
                          value="email"
                          className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          邮箱
                        </TabsTrigger>
                      </TabsList>

                      <div className="mt-6">
                        <AnimatePresence mode="wait">
                          {/* 用户名登录 */}
                          {activeTab === "username" && (
                            <TabsContent value="username">
                              <motion.div
                                key="username-form"
                                variants={tabContentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-4"
                              >
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">
                                    用户名
                                  </Label>
                                  <Input
                                    type="text"
                                    value={formData.username || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "username",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="请输入用户名"
                                    className="h-11 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">
                                    密码
                                  </Label>
                                  <div className="relative">
                                    <Input
                                      type={
                                        showPasswords.password
                                          ? "text"
                                          : "password"
                                      }
                                      value={formData.password || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "password",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="请输入密码"
                                      className="h-11 border-gray-200 bg-gray-50 pr-10 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        togglePasswordVisibility("password")
                                      }
                                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                      {showPasswords.password ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            </TabsContent>
                          )}

                          {/* 手机号登录 */}
                          {activeTab === "phone" && (
                            <TabsContent value="phone">
                              <motion.div
                                key="phone-form"
                                variants={tabContentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-4"
                              >
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">
                                    手机号码
                                  </Label>
                                  <Input
                                    type="tel"
                                    value={formData.phone || ""}
                                    onChange={(e) =>
                                      handleInputChange("phone", e.target.value)
                                    }
                                    placeholder="请输入手机号"
                                    className="h-11 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">
                                    验证码
                                  </Label>
                                  <div className="flex gap-3">
                                    <Input
                                      type="text"
                                      value={formData.smsCode || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "smsCode",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="6位验证码"
                                      className="h-11 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="h-11 border-gray-200 px-4 hover:border-blue-500 hover:text-blue-600"
                                    >
                                      获取验证码
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            </TabsContent>
                          )}

                          {/* 邮箱登录 */}
                          {activeTab === "email" && (
                            <TabsContent value="email">
                              <motion.div
                                key="email-form"
                                variants={tabContentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-4"
                              >
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">
                                    邮箱地址
                                  </Label>
                                  <Input
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={(e) =>
                                      handleInputChange("email", e.target.value)
                                    }
                                    placeholder="请输入邮箱地址"
                                    className="h-11 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">
                                    密码
                                  </Label>
                                  <div className="relative">
                                    <Input
                                      type={
                                        showPasswords.emailPassword
                                          ? "text"
                                          : "password"
                                      }
                                      value={formData.emailPassword || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "emailPassword",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="请输入密码"
                                      className="h-11 border-gray-200 bg-gray-50 pr-10 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        togglePasswordVisibility(
                                          "emailPassword",
                                        )
                                      }
                                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                      {showPasswords.emailPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            </TabsContent>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* 记住我和忘记密码 */}
                      <motion.div
                        className="mt-6 flex items-center justify-between"
                        variants={itemVariants}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="remember"
                            checked={formData.rememberMe}
                            onCheckedChange={(checked) =>
                              handleInputChange(
                                "rememberMe",
                                checked as boolean,
                              )
                            }
                            className="border-gray-300"
                          />
                          <Label
                            htmlFor="remember"
                            className="text-sm text-gray-600"
                          >
                            记住我
                          </Label>
                        </div>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          忘记密码？
                        </a>
                      </motion.div>

                      {/* 登录按钮 */}
                      <motion.div className="mt-6" variants={itemVariants}>
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button
                            className="group h-11 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg"
                            onClick={handleLogin}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                登录中...
                              </>
                            ) : (
                              <>
                                立即登录
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </motion.div>

                      {/* 分割线 */}
                      <motion.div className="my-6" variants={itemVariants}>
                        <div className="relative flex items-center">
                          <div className="flex-grow border-t border-gray-200"></div>
                          <span className="px-4 text-sm text-gray-500">
                            或者使用
                          </span>
                          <div className="flex-grow border-t border-gray-200"></div>
                        </div>
                      </motion.div>

                      {/* GitHub登录 */}
                      <motion.div variants={itemVariants}>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => loginWithGithub()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                              fill="currentColor"
                            />
                          </svg>
                          GitHub
                        </Button>
                      </motion.div>

                      {/* 注册链接 */}
                      <motion.div
                        className="mt-6 text-center"
                        variants={itemVariants}
                      >
                        <span className="text-sm text-gray-600">
                          还没有账号？{" "}
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            立即注册
                          </a>
                        </span>
                      </motion.div>
                    </Tabs>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 底部版权 */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-gray-500">
                © 2025 BinLee AI Studio. 让AI赋能您的创造力
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
