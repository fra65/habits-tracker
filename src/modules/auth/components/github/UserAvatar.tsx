import { auth } from '@/lib/auth'
import React from 'react'

const UserAvatar = async () => {
    
  const session = await auth()
 
  if (!session?.user) return null
 
  return (
    <div>
      <pre>

        <code>

            {JSON.stringify(session)}

        </code>

      </pre>
    </div>

  )

}

export default UserAvatar