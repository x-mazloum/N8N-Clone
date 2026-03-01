import { LoginForm } from '@/features/auth/components/login-form'
import { requireUnAuth } from '@/lib/auth-utils'
import React from 'react'

const Page = async () => {
    await requireUnAuth();
    return (
        <div
        className='bg-muted flex min-h-svh flex-col justify-center gap-6 p-6 md:p-10'
        >
            <div className='flex w-full max-w-sm flex-col gap-6 '>

            </div>
            <LoginForm />
        </div>
    )
}

export default Page
