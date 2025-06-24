"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Github,
  Mail,
  Phone,
  User,
  Sparkles,
  Zap,
  Bot,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    transition: { duration: 0.5 },
  },
};

const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const tabContentVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 },
  },
};

const logoVariants: Variants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(147, 51, 234, 0.3)",
      "0 0 40px rgba(59, 130, 246, 0.4)",
      "0 0 60px rgba(147, 51, 234, 0.5)",
      "0 0 40px rgba(59, 130, 246, 0.4)",
      "0 0 20px rgba(147, 51, 234, 0.3)",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const inputVariants: Variants = {
  focus: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  hover: {
    scale: 1.01,
    transition: { duration: 0.2 },
  },
};

const spinVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
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
    // 防止重复提交
    if (isLoading) return;

    setIsLoading(true);
    // 根据当前选中的tab获取对应的数据和验证
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
            password: formData.password,
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
        } else if (formData.emailPassword.length < 6) {
          validationError = "密码长度不能少于6位";
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
    // 如果有验证错误，直接返回
    if (validationError) {
      toast.error(validationError);
      setIsLoading(false);
      return;
    }
    console.log("登录数据:", loginData);
    try {
      // 模拟 API 调用
      const response = await new Promise<{
        success: boolean;
        message?: string;
      }>((resolve) => {
        setTimeout(() => {
          // 模拟不同登录方式的验证逻辑
          if (activeTab === "username") {
            const success =
              loginData.username === "admin" && loginData.password === "123456";
            resolve({
              success,
              message: success ? "登录成功" : "用户名或密码错误",
            });
          } else if (activeTab === "phone") {
            const success = loginData.smsCode === "123456";
            resolve({
              success,
              message: success ? "登录成功" : "验证码错误",
            });
          } else if (activeTab === "email") {
            const success = loginData.email && loginData.password;
            resolve({
              success,
              message: success ? "登录成功" : "邮箱或密码错误",
            });
          } else {
            resolve({ success: false, message: "不支持的登录方式" });
          }
        }, 1500);
      });
      if (response.success) {
        toast.success(response.message || "登录成功！正在跳转...");

        // 保存登录状态
        if (formData.rememberMe) {
          localStorage.setItem(
            "userLoginData",
            JSON.stringify({
              ...loginData,
              loginTime: new Date().toISOString(),
            }),
          );
        }

        // 可以在这里设置用户token
        // localStorage.setItem('token', 'your-jwt-token');

        // 延迟跳转
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        toast.error(response.message || "登录失败");
      }
    } catch (error) {
      console.error("登录失败:", error);
      toast.error("网络错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };
  // GitHub登录处理
  const handleGithubLogin = async () => {
    toast.info("GitHub登录功能开发中...");
    // 这里可以实现GitHub OAuth登录
    // window.location.href = '/api/auth/github';
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* 动态背景元素 */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"
          variants={pulseVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-3/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
          variants={pulseVariants}
          animate="animate"
          style={{ animationDelay: "1s" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
          variants={pulseVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* 浮动的AI图标 */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute top-20 left-20"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "0.3s" }}
        >
          <Brain className="h-8 w-8 text-purple-300/30" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-32"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "0.7s" }}
        >
          <Sparkles className="h-6 w-6 text-blue-300/30" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-16"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "1s" }}
        >
          <Zap className="h-7 w-7 text-indigo-300/30" />
        </motion.div>
        <motion.div
          className="absolute right-20 bottom-20"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "0.5s" }}
        >
          <Bot className="h-8 w-8 text-purple-300/30" />
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 flex min-h-screen items-center justify-center p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-md">
          {/* 主标题区域 */}
          <motion.div
            className="mb-8 space-y-4 text-center"
            variants={itemVariants}
          >
            <motion.div
              className="mb-4 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-3 shadow-lg"
                variants={logoVariants}
                animate="animate"
              >
                <Brain className="h-8 w-8 text-white" />
              </motion.div>
            </motion.div>
            <motion.h1
              className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-4xl font-bold text-transparent text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AI Studio
            </motion.h1>
            <motion.p
              className="text-lg text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              探索人工智能的无限可能
            </motion.p>
          </motion.div>

          {/* 登录卡片 */}
          <motion.div variants={cardVariants}>
            <Card className="border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
              <CardHeader className="space-y-1 pb-4">
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-center text-2xl text-white">
                    欢迎回来
                  </CardTitle>
                  <CardDescription className="text-center text-gray-300">
                    选择您的登录方式，开启AI之旅
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div variants={itemVariants}>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-4"
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <TabsTrigger
                          value="username"
                          className="w-full text-gray-300 transition-all duration-300 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                        >
                          <User className="mr-2 h-4 w-4" />
                          账号
                        </TabsTrigger>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <TabsTrigger
                          value="phone"
                          className="w-full text-gray-300 transition-all duration-300 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          手机
                        </TabsTrigger>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <TabsTrigger
                          value="email"
                          className="w-full text-gray-300 transition-all duration-300 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          邮箱
                        </TabsTrigger>
                      </motion.div>
                    </TabsList>

                    <AnimatePresence mode="wait">
                      {activeTab === "username" && (
                        <TabsContent value="username" className="space-y-4">
                          <motion.div
                            key="username-content"
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                          >
                            <motion.div
                              className="space-y-2"
                              variants={inputVariants}
                              whileHover="hover"
                              whileFocus="focus"
                            >
                              <Label htmlFor="username" className="text-white">
                                用户名
                              </Label>
                              <Input
                                id="username"
                                type="text"
                                value={formData.username || ""}
                                onChange={(e) =>
                                  handleInputChange("username", e.target.value)
                                }
                                placeholder="您的用户名"
                                className="border-white/20 bg-white/10 text-white transition-all duration-300 placeholder:text-gray-400 focus:bg-white/20"
                              />
                            </motion.div>
                            <motion.div
                              className="space-y-2"
                              variants={inputVariants}
                              whileHover="hover"
                              whileFocus="focus"
                            >
                              <Label
                                htmlFor="user-password"
                                className="text-white"
                              >
                                密码
                              </Label>
                              <div className="relative">
                                <Input
                                  id="user-password"
                                  type={
                                    showPasswords.password ? "text" : "password"
                                  }
                                  value={formData.password}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "password",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="••••••••"
                                  className="border-white/20 bg-white/10 pr-10 text-white transition-all duration-300 placeholder:text-gray-400 focus:bg-white/20"
                                />
                                <motion.button
                                  type="button"
                                  onClick={() =>
                                    togglePasswordVisibility("password")
                                  }
                                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-300"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {showPasswords.password ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </motion.button>
                              </div>
                            </motion.div>
                          </motion.div>
                        </TabsContent>
                      )}
                      {activeTab === "phone" && (
                        <TabsContent value="phone" className="space-y-4">
                          <motion.div
                            key="phone-content"
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                          >
                            <motion.div
                              className="space-y-2"
                              variants={inputVariants}
                              whileHover="hover"
                              whileFocus="focus"
                            >
                              <Label htmlFor="phone" className="text-white">
                                手机号码
                              </Label>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="13800138000"
                                className="border-white/20 bg-white/10 text-white transition-all duration-300 placeholder:text-gray-400 focus:bg-white/20"
                              />
                            </motion.div>
                            <motion.div
                              className="space-y-2"
                              variants={inputVariants}
                              whileHover="hover"
                              whileFocus="focus"
                            >
                              <Label htmlFor="sms-code" className="text-white">
                                验证码
                              </Label>
                              <div className="flex space-x-2">
                                <Input
                                  id="sms-code"
                                  type="text"
                                  placeholder="6位验证码"
                                  className="border-white/20 bg-white/10 text-white transition-all duration-300 placeholder:text-gray-400 focus:bg-white/20"
                                />
                                <motion.div
                                  variants={buttonVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <Button
                                    variant="outline"
                                    className="border-white/20 bg-white/10 text-white transition-all duration-300 hover:bg-white/20"
                                  >
                                    获取验证码
                                  </Button>
                                </motion.div>
                              </div>
                            </motion.div>
                          </motion.div>
                        </TabsContent>
                      )}
                      {activeTab === "email" && (
                        <TabsContent value="email" className="space-y-4">
                          <motion.div
                            key="email-content"
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                          >
                            <motion.div
                              className="space-y-2"
                              variants={inputVariants}
                              whileHover="hover"
                              whileFocus="focus"
                            >
                              <Label htmlFor="email" className="text-white">
                                邮箱地址
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                className="border-white/20 bg-white/10 text-white transition-all duration-300 placeholder:text-gray-400 focus:bg-white/20"
                              />
                            </motion.div>
                            <motion.div
                              className="space-y-2"
                              variants={inputVariants}
                              whileHover="hover"
                              whileFocus="focus"
                            >
                              <Label htmlFor="password" className="text-white">
                                密码
                              </Label>
                              <div className="relative">
                                <Input
                                  id="password"
                                  type={
                                    showPasswords.emailPassword
                                      ? "text"
                                      : "password"
                                  }
                                  placeholder="••••••••"
                                  className="border-white/20 bg-white/10 pr-10 text-white transition-all duration-300 placeholder:text-gray-400 focus:bg-white/20"
                                />
                                <motion.button
                                  type="button"
                                  onClick={() =>
                                    togglePasswordVisibility("emailPassword")
                                  }
                                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-300"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {showPasswords.emailPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </motion.button>
                              </div>
                            </motion.div>
                          </motion.div>
                        </TabsContent>
                      )}
                    </AnimatePresence>
                    <motion.div
                      className="flex items-center justify-between text-sm"
                      variants={itemVariants}
                    >
                      <motion.label
                        className="flex cursor-pointer items-center space-x-2 text-gray-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          className="rounded border-white/20"
                        />
                        <span>记住我</span>
                      </motion.label>
                      <motion.a
                        href="#"
                        className="text-purple-400 transition-colors hover:text-purple-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        忘记密码？
                      </motion.a>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-blue-600"
                          onClick={handleLogin}
                          disabled={isLoading}
                        >
                          <AnimatePresence mode="wait">
                            {isLoading ? (
                              <motion.div
                                key="loading"
                                variants={fadeVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex items-center space-x-2"
                              >
                                <motion.div
                                  className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                                  variants={spinVariants}
                                  animate="animate"
                                />
                                <span>登录中...</span>
                              </motion.div>
                            ) : (
                              <motion.span
                                key="login"
                                variants={fadeVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                              >
                                立即登录
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <div className="relative flex items-center">
                        <div className="flex-grow border-t border-white/20"></div>
                        <span className="px-3 text-sm text-gray-300">
                          或者使用
                        </span>
                        <div className="flex-grow border-t border-white/20"></div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-1 gap-3"
                      variants={itemVariants}
                    >
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-white/20 bg-white/10 text-white transition-all duration-300 hover:bg-white/20"
                          onClick={() => handleLogin("github")}
                        >
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </Button>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="text-center text-sm text-gray-300"
                      variants={itemVariants}
                    >
                      还没有账号？{" "}
                      <motion.a
                        href="#"
                        className="font-semibold text-purple-400 transition-colors hover:text-purple-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        立即注册
                      </motion.a>
                    </motion.div>
                  </Tabs>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 底部信息 */}
          <motion.div
            className="mt-8 text-center text-sm text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p>© 2024 BinLee AI Studio. 让AI赋能您的创造力</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
