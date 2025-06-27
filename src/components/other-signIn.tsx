"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function OtherSignIn() {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleGitHubLogin = () => {
    setIsLoading(true);

    try {
      const result = signIn("github");

      console.log(result, result);

      // if (result?.error) {
      //   toast.error("登录失败", { description: "GitHub登录遇到问题，请重试" });
      // } else if (result?.ok) {
      //   console.log(result, "result");

      //   toast.success("登录成功", { description: "正在跳转到控制台" });
      //   // 延迟跳转，让用户看到成功提示
      //   setTimeout(() => {
      //     router.push("/dashboard");
      //   }, 1000);
      // }
    } catch (error) {
      toast.error("登录异常", { description: "网络错误，请检查连接后重试" });
    } finally {
      setIsLoading(false);
    }
  };
  return (

  );
}
// export default function OtherSignIn() {
//   return (
//     <button onClick={() => signIn("github", { redirectTo: "/dashboard" })}>
//       Sign In
//     </button>
//   );
// }
