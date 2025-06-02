import express from "express"
import { shortUrlCreate, customShortUrlCreate } from "../controller/shortUrl.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post('/', shortUrlCreate)
router.post('/custom', authMiddleware, customShortUrlCreate)


export default router