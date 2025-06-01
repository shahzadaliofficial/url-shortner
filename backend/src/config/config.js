export const cookieOptions={
    httpOnly: true,
    secure: process.env.NODE_ENV=="production",
    sameSite: "lax",
    maxAge: 1000*60*5,
}
export const jwtOptions = {
    expiresIn: '5m', // 5 minutes
    algorithm: 'HS256'
}