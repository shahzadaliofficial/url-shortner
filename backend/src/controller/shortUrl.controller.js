
import { getUrl } from '../dao/shortUrl.dao.js';
import { createShortUrlWithoutUserService, createShortUrlWithUserService } from '../services/shortUrl.service.js';
import { NotFoundError, UnauthorizedError } from '../utils/errorHandler.js';
import tryCatchWrapAsync from '../utils/tryCatchWrapper.js';


export const shortUrlCreate=tryCatchWrapAsync(async(req, res)=>{
      const {url, customId}=req.body
      
      console.log('URL Create - User:', !!req.user, 'CustomId:', !!customId, 'Token:', !!req.cookies.accessToken)
      
      let shortUrl
      if(req.user){
        const userId = req.user._id
        shortUrl = await createShortUrlWithUserService(url, userId, customId)
      }else{  
        if(customId) {
          throw new UnauthorizedError("Login required for custom URLs")
        }
        shortUrl = await createShortUrlWithoutUserService(url)
      }

      res.status(200).json({url: process.env.APP_URI+shortUrl})
      })

export const shortUrlRedirect = tryCatchWrapAsync(async (req, res) => {
  const { id } = req.params;
  
  // Validate the ID format
  if (!id || id.length < 3) {
    // Redirect to frontend 404 page for invalid URLs
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/404`);
  }
  
  // Skip favicon and common static files
  if (id.includes('favicon') || id.includes('.')) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/404`);
  }
  
  console.log('Redirecting ID:', id);
  
  try {
    const url = await getUrl(id);
    
    if (url && url.full_url) {
      console.log('Redirecting to:', url.full_url);
      res.redirect(url.full_url);
    } else {
      // Redirect to frontend 404 page for non-existent URLs
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/404`);
    }
  } catch (error) {
    console.error('Redirect error:', error);
    // Redirect to frontend 404 page for any errors
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/404`);
  }
}) 
export const customShortUrlCreate=tryCatchWrapAsync(async(req, res)=>{
    
     const {url, customId}=req.body
      const userId=req.user._id
      // const shortUrl= await createShortUrlWithoutUserService(url, customId)

      let shortUrl
      if(userId){
         shortUrl = await createShortUrlWithUserService(url,userId, customId)}
      else {
          throw new UnauthorizedError("Unauthorized")
      }
      res.status(200).json({url: process.env.APP_URI+shortUrl})
    } )
