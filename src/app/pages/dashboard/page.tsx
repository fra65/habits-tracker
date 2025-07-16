  /* eslint-disable react-hooks/rules-of-hooks */
  /* eslint-disable react/jsx-no-undef */
  import UserAvatar from '@/modules/auth/components/button/UserAvatar'
  // import { useSession } from 'next-auth/react'
  import { auth } from '@/lib/auth'
  import React from 'react'
import ProfileInfoContainer from '@/modules/profile/components/info/profileInfoContainer'
import { ThemeToggle } from '@/components/button/theme-toggle'

  const page = async () => {

    const session = await auth()  

    return (
      <>

        <ThemeToggle />

          <h1>Dashboard</h1>

          <UserAvatar />

          {session && session.user.role === 'ADMIN' ? '<Button>Admin Panel</Button>' : ""}

          <br />

          <ProfileInfoContainer />

      
      </>
    )
  }

  export default page