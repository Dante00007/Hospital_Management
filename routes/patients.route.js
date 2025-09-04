import express from "express";
import { addNewpatient, getAllpatients, getSinglepatient, updateSinglepatient, deleteSinglepatient } from "../controller/patients.controller.js";
import { validateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/',validateToken,addNewpatient);
router.get('/',validateToken,getAllpatients);
router.get('/:id',validateToken,getSinglepatient);
router.put('/:id',validateToken,updateSinglepatient);
router.delete('/:id',validateToken,deleteSinglepatient);

export default router;