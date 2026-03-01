import { LoginForm } from '@/features/auth/components/login-form'
import { requireUnAuth } from '@/lib/auth-utils'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Page = async () => {
    await requireUnAuth();
    return (
        <div
        className='bg-muted flex min-h-svh flex-col justify-center gap-6 p-6 md:p-10'
        >
            <div className='flex w-full max-w-sm flex-col gap-6'>
                <Link href="/" className='flex items-center gap-2 self-center font-medium'>
                    <Image src="/logos/logo(1).svg" alt='Nodebase' width={30} height={30} />
                    Nodebase
                </Link>
            </div>
            <LoginForm />
        </div>
    )
}

export default Page
