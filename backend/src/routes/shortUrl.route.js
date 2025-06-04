import express from "express"
import { shortUrlCreate, customShortUrlCreate, shortUrlRedirect } from "../controller/shortUrl.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post('/create', shortUrlCreate)
router.post('/create/custom', authMiddleware, customShortUrlCreate)


export default router