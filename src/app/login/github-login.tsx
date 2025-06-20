import { signIn } from "@/api/auth/auth";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export async function GitHubSignInButton() {
  const handleSignIn = async () => {
    "use server";
    await signIn("github", { redirectTo: "/dashboard" });
  };

  return (
    <form action={handleSignIn}>
      <Button type="submit" variant="outline" className="w-full">
        <Github />
        使用 GitHub 登录
      </Button>
    </form>
  );
}
