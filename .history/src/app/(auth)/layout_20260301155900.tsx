import { AuthLayout } from "@/features/auth/components/auth-layout";
import Image from "next/image";
import Link from "next/link";

const Layout = ({ children } : { children: React.ReactNode ;}) => {
    return (
    <AuthLayout>
        
    </AuthLayout>
                {children}
            </div>
        </div>
    )
}

export default Layout;