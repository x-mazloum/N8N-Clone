"use client";

import { authClient } from "@/lib/auth-client";

const Page = () => {
  
  const { data } = authClient.useSession

  return(
    <div>

    </div>
  )
}

export default Page;