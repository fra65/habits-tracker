import SignupForm from "@/modules/auth/components/forms/signupForm";

export default function SignupPage() {
  return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
            <div className="w-1/2 rounded-lg p-8">
                <SignupForm />
            </div>
        </div>
  );
}