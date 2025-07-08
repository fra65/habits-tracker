import { Button } from "@/components/ui/button";
import SignupForm from "@/modules/auth/components/forms/signupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">

        <Link href='/'>
          <Button type="button" className="cursor-pointer">HOME</Button>
        </Link>

        <SignupForm />
      </div>
    </div>
  );
}