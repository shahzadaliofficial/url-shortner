import { nanoid } from "nanoid";
import jwt from 'jsonwebtoken'
import { jwtOptions } from "../config/config.js";
import { getShortUrl } from "../dao/shortUrl.dao.js";


export const generateNanoId=async (length)=> {
    let isUnique=false;
    let shortUrl
    while (!isUnique){
          shortUrl=nanoid(length)
          const existingUrl=await getShortUrl(shortUrl)
          if (!existingUrl){
            isUnique=true
          }
        }
        return shortUrl
}

export const signJwtToken=(payload)=> jwt.sign(payload, process.env.JWT_SECRET,  jwtOptions)
export const verifyJwtToken=(token)=> jwt.verify(token, process.env.JWT_SECRET,  jwtOptions)
