import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth"
import ChangePasswordForm from "@/modules/profile/components/forms/changePasswordForm"
import InfoProfileForm from "@/modules/profile/components/forms/infoProfileForm"
import ProfilePreferencesForm from "@/modules/preferences/components/forms/profilePreferencesForm"
import * as React from "react"

const ProfilePage = async () => {

  const session = await auth()

  if (!session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-red-600">
        <p>Warning: Utente non autenticato. Per favore effettua il login.</p>
      </main>
    )
  }

  return (
    <main className="bg-background p-6 min-h-screen py-auto">
      <InfoProfileForm />
      <Separator className="max-w-4xl mx-auto my-10" />
      <ChangePasswordForm />
      <Separator className="max-w-4xl mx-auto my-10" />
      <ProfilePreferencesForm />

    </main>
  )
}

export default ProfilePage
