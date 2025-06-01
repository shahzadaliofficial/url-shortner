
import { getUrl } from '../dao/shortUrl.dao.js';
import { createShortUrlWithoutUserService, createShortUrlWithUserService } from '../services/shortUrl.service.js';
import { NotFoundError } from '../utils/errorHandler.js';
import tryCatchWrapAsync from '../utils/tryCatchWrapper.js';


export const shortUrlCreate=tryCatchWrapAsync(async(req, res)=>{
    
      const data=req.body
      // const shortUrl= await createShortUrlWithoutUserService(url, customId)
    let shortUrl
    if(req.user){
        shortUrl = await createShortUrlWithUserService(data.url,req.user._id,data.customId)
    }else{  
        shortUrl = await createShortUrlWithoutUserService(data.url)
    }

      res.status(200).json({url: process.env.APP_URI+shortUrl})
    } )

export const shortUrlRedirect = tryCatchWrapAsync(async (req,res)=>{
  const {id} = req.params;
  const url= await getUrl(id) 
  if (url){
    res.redirect(url.full_url)
  }else{
    throw new NotFoundError("Invalid Short UrL")
  }
}) 
export const customShortUrlCreate=tryCatchWrapAsync(async(req, res)=>{
    
    const {url, customId}=req.body
    let shortUrl
    if(req.user){
        shortUrl = await createShortUrlWithUserService(data.url,req.user._id,data.customId)
    }else{  
        shortUrl = await createShortUrlWithoutUserService(url, customId)
    }

      res.status(200).json({url: process.env.APP_URI+shortUrl})
    } )
