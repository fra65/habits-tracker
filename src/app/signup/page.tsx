import SignupForm from "@/modules/auth/components/forms/signupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Crea il tuo account
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
