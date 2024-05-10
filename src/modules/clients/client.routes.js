import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandler.js";
import * as cc from './client.controller.js'
import { isAuth } from '../../middlewares/auth.js'
import { userApisRole } from './client.endPoints.js'
import { multerCloudFunction } from '../../services/multerCloudService.js'
import { allowedExtensions } from '../../utils/multerAllowedExtensions.js'
import { validationFunction } from '../../middlewares/validation.js'
import * as validator from './client.validationSchema.js'
const router = Router()





export default router