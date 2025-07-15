/* eslint-disable react-hooks/rules-of-hooks */
import LoginForm from "@/modules/auth/components/forms/LoginForm"

export default async function LoginPage () {

    return(

        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
            <div className="w-1/2 rounded-lg p-8">
                <LoginForm />
            </div>
        </div>

    )

}