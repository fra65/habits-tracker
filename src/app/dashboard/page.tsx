  /* eslint-disable react-hooks/rules-of-hooks */
  /* eslint-disable react/jsx-no-undef */
  import { SignOut } from '@/modules/auth/components/github/signoutBtn'
  import UserAvatar from '@/modules/auth/components/github/UserAvatar'
  // import { useSession } from 'next-auth/react'
  import React from 'react'

  const page = async () => {
    
    return (
      <>

          <h1>Dashboard</h1>

          <h3>Info Sessione</h3>   

          <UserAvatar />


          <SignOut />
      
      </>
    )
  }

  export default page