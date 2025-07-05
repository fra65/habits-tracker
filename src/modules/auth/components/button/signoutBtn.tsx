import { signOut } from "@/lib/auth"
 
export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({ redirectTo: "/login" })
      }}
    >
      <button type="submit" className="p-4 bg-blue-500 rounded-md">Sign Out</button>
    </form>
  )
}