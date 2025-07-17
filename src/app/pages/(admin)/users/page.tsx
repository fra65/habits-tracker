import { auth } from '@/lib/auth'
import UsersTable from '@/modules/user/components/tables/usersTable'
import React from 'react'

const UsersPage = async () => {

    const session = await auth()

    if(!session) {
        return <p>NON SEI AUTENTICATO</p>
    } 
  return (
    <div className="flex w-4xl mx-auto">
        <UsersTable />
    </div>
  )
}

export default UsersPage