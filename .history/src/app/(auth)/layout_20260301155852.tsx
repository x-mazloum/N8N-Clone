import Image from "next/image";
import Link from "next/link";

const Layout = ({ children } : { children: React.ReactNode ;}) => {
    return (
    
                {children}
            </div>
        </div>
    )
}

export default Layout;