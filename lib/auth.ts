import Database from 'better-sqlite3'
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
    apiKey: 'TenX Meeting Automation',
    database: new Database('./sqlite.db'),
    socialProviders: {
        google: {
            prompt: 'select_account',
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    emailAndPassword: {
        enabled: false,
    },
    rateLimit: {
        enabled: true,
    },
})
