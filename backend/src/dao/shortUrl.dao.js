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
    return newUrl
  } catch(err){
    if (err.code==11000) throw new ConflictError("Short URL already exists");
    throw new Error(err)
  }
}

export const getUrl=async(shortUrl)=>{
  // Find and update the click count, return the updated document
  const result = await shortUrlSchema.findOneAndUpdate(
    {short_url:shortUrl}, 
    {$inc:{clicks:1}})
  
  console.log(result)
  return result
}

export const getShortUrl=async(shortUrl)=>{
  return await shortUrlSchema.findOne({short_url:shortUrl})
}