import { LoginForm } from '@/features/auth/components/login-form'
import { requireUnAuth } from '@/lib/auth-utils'
import React from 'react'

const Page = async () => {
    await requireUnAuth();
    return (
        <div
        className='bg-muted flex min-h-svh flex-col justify-center ha'
        >
            <LoginForm />
        </div>
    )
}

export default Page
