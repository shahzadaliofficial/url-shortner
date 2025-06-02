import {  generateNanoId } from "../utils/helper.utils.js";
import {getShortUrl, saveShortUrl} from '../dao/shortUrl.dao.js';

export const createShortUrlWithUserService = async(url, userId, customId = null) => {
  let shortUrl;
  if(customId){
    const existingUrl=await getShortUrl(customId)
    if (existingUrl){
      throw new Error("Custom ID Already Exist.")
    }
    shortUrl=customId
  }else{
    shortUrl = await generateNanoId(7);
  }
  console.log(shortUrl)
  await saveShortUrl(shortUrl,url, userId)
  return shortUrl;
};

export const createShortUrlWithoutUserService = async (url) => {
  const shortUrl = await generateNanoId(7);
  await saveShortUrl(shortUrl, url)
  return shortUrl;
};
