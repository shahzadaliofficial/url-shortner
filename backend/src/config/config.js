export const cookieOptions={
    httpOnly: true,
    secure: process.env.NODE_ENV=="production",
    sameSite: process.env.NODE_ENV=="production" ? "none" : "lax",
    maxAge: 1000*60*60*24, // 24 hours instead of 5 minutes
    domain: process.env.NODE_ENV=="production" ? undefined : undefined // Let browser handle domain
}
export const jwtOptions = {
    expiresIn: '1h', // 5 minutes
    algorithm: 'HS256'
}