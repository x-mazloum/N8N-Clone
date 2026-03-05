import { betterAuth } from "better-auth";
import { checkout, polar, portal} from "@polar-sh/better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "@/lib/db";
import { polarClient } from "./polar";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true
    },
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "034dcfe6-092f-41cd-ae08-6610c067e498",
                            slug: "Nodebase-Pro"
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true,
                }),
                portal(),
            ],
        })
    ]
})