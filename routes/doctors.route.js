import express from "express";
import { addNewDoctor, getAllDoctors, getSingleDoctor, updateSingleDoctor, deleteSingleDoctor } from "../controller/doctors.controller.js";
import { validateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/',validateToken,addNewDoctor);
router.get('/',validateToken,getAllDoctors);
router.get('/:id',validateToken,getSingleDoctor);
router.put('/:id',validateToken,updateSingleDoctor);
router.delete('/:id',validateToken,deleteSingleDoctor);

export default router;