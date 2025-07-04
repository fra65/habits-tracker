import { signIn } from "@/lib/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("github", { redirectTo: "/dashboard" })
      }}
    >
      <button className="p-4 bg-blue-500 rounded-md" type="submit">Signin with GitHub</button>
    </form>
  )
} 