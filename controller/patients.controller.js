import connectToMySQL from "../db/db.js";
import { v4 as uuidv4 } from "uuid";

export const addNewpatient = async (req, res) => {
    let connection = null;
    try{
        const { name, date_of_birth, gender ,contact_number,address} = req.body;
        
        const user_id = req.user.userId;
        const patientId = uuidv4();
        connection = await connectToMySQL();
        

        const [result] = await connection.execute(
            `INSERT INTO patients (id,name, date_of_birth, gender ,contact_number,address,created_by) VALUES (?,?, ?, ?, ?, ?, ?)`,
            [ patientId,name, date_of_birth, gender ,contact_number,address,user_id]
        );

        if(result.affectedRows === 1){
            return res.status(200).json({message:"Patient added successfully"});
        }else{
            return res.status(500).json({message:"Error adding patient"});
        }
    }catch(err){
        return res.status(500).json({error:err});
    }finally{
        connection?.end();
    }
};
export const getAllpatients = async (req, res) => {
    let connection;
    try{

        connection = await connectToMySQL();

        const [result] = await connection.execute(
            `SELECT * FROM patients`,
        );

        if(result.length > 0){
            res.status(200).json(result);
        }else{
            return res.status(500).json({message:"Error getting patients"});
        }
    }catch(err){
        return res.status(500).json({message:err.message});
    }finally{
        connection?.end();
    }
};
export const getSinglepatient = async (req, res) => {
    let connection;
    try{
        const patientId = req.params?.id;
        if(!patientId)
            return res.status(400).json({message:"Patient id is required"});

        connection = await connectToMySQL();
        const [result] = await connection.execute(
            `SELECT * FROM patients WHERE id = ?`,
            [patientId]
        );
        if(result.length > 0){
            res.status(200).json(result[0]);
        }else{
            return res.status(404).json({message:"Patient not found"});
        }
    }catch(err){
        return res.status(500).json({message:err.message});
    }finally{
        connection?.end();
    }
};

export const updateSinglepatient = async (req, res) => {
    let connection;
    try{
        const patientId = req.params?.id;
        const {contact_number,address} = req.body;

        if(!patientId)
            return res.status(400).json({message:"Patient id is required"});

        connection = await connectToMySQL();
        const [result] = await connection.execute(
            `SELECT * FROM patients WHERE id = ?`,
            [patientId]
        );
        if(result.length === 0){
            return res.status(404).json({message:"Patient not found"});
        }

        const [updateResult] = await connection.execute(
            `UPDATE patients SET contact_number = ?, address = ? WHERE id = ?`,
            [contact_number,address,patientId]
        );
        if(updateResult.affectedRows === 1){
            return res.status(200).json({message:"Patient updated successfully"});
        }else{
            return res.status(500).json({message:"Error updating patient"});
        }
    }catch(err){
        return res.status(500).json({message:err.message});
    }finally{
        connection?.end();
    }
};
export const deleteSinglepatient = async (req, res) => {
    let connection;
    try{
        const patientId = req.params?.id;
        if(!patientId)
            return res.status(400).json({message:"Patient id is required"});

        connection = await connectToMySQL();
        const [result] = await connection.execute(
            `SELECT * FROM patients WHERE id = ?`,
            [patientId]
        );
        if(result.length === 0){
            return res.status(404).json({message:"Patient not found"});
        }

        const [deleteResult] = await connection.execute(
            `DELETE FROM patients WHERE id = ?`,
            [patientId]
        );
        if(deleteResult.affectedRows === 1){
            return res.status(200).json({message:"Patient deleted successfully"});
        }else{
            return res.status(500).json({message:"Error deleting patient"});
        }
    }catch(err){
        return res.status(500).json({message:err.message});
    }finally{
        connection?.end();
    }
};