import express from "express";
import { addMapping, getAllMappings, getPatientMapping, deleteMapping } from "../controller/mapping.contoller.js";
import { validateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/',validateToken,addMapping);
router.get('/',validateToken,getAllMappings);
router.get('/:patientId',validateToken,getPatientMapping);
router.delete('/:id',validateToken,deleteMapping);

export default router;