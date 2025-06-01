import shortUrlSchema from '../models/shorturl.model.js';
import { ConflictError } from '../utils/errorHandler.js';



export const saveShortUrl = async (shortUrl, url, userId) => {
  try  {
    const newUrl = new shortUrlSchema({
    full_url: url,
    short_url: shortUrl,
  });
  if(userId){
    newUrl.user=userId
  }
  await newUrl.save()
} catch(err){
    if (err.code==11000) throw new ConflictError(err);
    throw new Error(err)
  }
}

export const getUrl=async(shortUrl)=>{
  return await shortUrlSchema.findOneAndUpdate({short_url:shortUrl}, {$inc:{clicks:1}})
}

export const getShortUrl=async(shortUrl)=>{
  return await shortUrlSchema.findOne({short_url:shortUrl})
}