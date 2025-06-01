import express from "express"
import { shortUrlCreate } from "../controller/shortUrl.controller.js"

const router = express.Router()

router.post('/', shortUrlCreate)


export default router