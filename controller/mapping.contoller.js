import connectToMySQL  from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
export const addMapping = async (req, res) => {

    let connection;
    try{
        const {doctorId,patientId} = req.body;
       
        if(!doctorId || !patientId) 
            return res.status(400).json({message:"Given data is not valid"});
    
        connection = await connectToMySQL();

        const [check1] = await connection.execute(`SELECT * FROM doctors WHERE id = ?`,[doctorId]);
        const [check2] = await connection.execute(`SELECT * FROM patients WHERE id = ?`,[patientId]);

        if(check1.length === 0 || check2.length === 0){
            return res.status(400).json({message:"Given data is not valid"});
        }
        const newMappingId = uuidv4();

        const [result] = await connection.execute(`INSERT INTO patient_doctor_mappings (id,doctor_id,patient_id) VALUES (?,?,?)`,[newMappingId,doctorId,patientId]);
        
        if(result.affectedRows === 1){
            return res.status(200).json({message:"Mapping added successfully"});
        }else{
            return res.status(500).json({message:"Error adding mapping"});
        }
    }catch(err){
        return res.status(500).json({error:err.message});
    }finally{
        connection?.end();
    }
}

export const getAllMappings = async (req, res) => {
    let connection;
    try{
        connection = await connectToMySQL();
        const [result] = await connection.execute(`SELECT * FROM patient_doctor_mappings`);
        
        if(result.length > 0){
            return res.status(200).json(result);
        }else{
            return res.status(500).json({message:"Error getting mappings"});
        }
    }catch(err){
        return res.status(500).json({error:err.message});
    }finally{
        connection?.end();
    }
}

export const getPatientMapping = async (req, res) => {
    let connection;
    try{
        const {patientId} = req.params;
    
        if(!patientId)
            return res.status(400).json({message:"Patient id is required"});

        connection = await connectToMySQL();
        const [result] = await connection.execute(`SELECT * FROM patient_doctor_mappings WHERE patient_id = ?`,[patientId]);
        
        if(result.length > 0){
            return res.status(200).json(result);
        }else{
            return res.status(500).json({message:"Error getting mappings"});
        }
    }catch(err){
        return res.status(500).json({error:err.message});
    }finally{
        connection?.end();
    }
}

export const deleteMapping = async (req, res) => {
    let connection;
    try{
        const {id} = req.params;
        if(!id)
            return res.status(400).json({message:"Mapping id is required"});

        connection = await connectToMySQL();
        const [result] = await connection.execute(`DELETE FROM patient_doctor_mappings WHERE id = ?`,[id]);
        
        if(result.affectedRows === 1){
            return res.status(200).json({message:"Mapping deleted successfully"});
        }else{
            return res.status(500).json({message:"Error deleting mapping"});
        }
    }catch(err){
        return res.status(500).json({error:err.message});
    }finally{
        connection?.end();
    }
}