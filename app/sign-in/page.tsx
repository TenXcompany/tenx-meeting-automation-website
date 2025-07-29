import Image from 'next/image'
import SignIn from '@/components/sign-in'

export default function SignInPage() {
    return (
        <main className="flex flex-col gap-12 min-h-screen items-center justify-center">
            <Image src="/logo.svg" alt="Logo" width={0} height={0} fetchPriority={'high'} priority={true} loading={'eager'} className={'w-36 h-auto'} />
            <SignIn />
        </main>
    )
}
