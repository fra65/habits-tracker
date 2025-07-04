    /* eslint-disable react-hooks/rules-of-hooks */
    import Signin from "@/modules/auth/components/github/signinForm"

    export default async function LoginPage () {

        return(

            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    {/* <h1 className="text-2xl font-semibold text-center mb-6">
                    Accedi
                    </h1> */}
                    {/* <LoginForm /> */}
                    <Signin />
                </div>
            </div>

        )

    }