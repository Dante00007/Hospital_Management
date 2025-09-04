import connectToMySQL from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
export const addNewDoctor = async (req, res) => {
    let connection;
    try{
        const {name,specialization,contact_number} = req.body;
        

        connection = await connectToMySQL();
        
        const user_id = req.user?.userId;
        const newDoctorId = uuidv4();

        const [result] = await connection.execute(
            `INSERT INTO doctors (id,name,specialization,contact_number,created_by) VALUES (?,?,?,?,?)`,
            [newDoctorId,name,specialization,contact_number,user_id]
        );

        if(result.affectedRows === 1){
            return res.status(200).json({message:"Doctor added successfully"});
        }else{
            return res.status(500).json({message:"Error adding patient"});
        }
    }catch(err){
        return res.status(500).json({error:err.message});
    }finally{
        connection?.end();
    }
};
export const getAllDoctors = async (req, res) => {
    let connection;
    try{
        connection = await connectToMySQL();
        const [result] = await connection.execute(
            `SELECT * FROM doctors`
        );
        if(result.length > 0){
            res.status(200).json(result);
        }else{
            return res.status(404).json({message:"Error getting patients"});
        }
    }catch(err){
        return res.status(500).json({error:err.message});
    }finally{
        connection?.end();
    }
};
export const getSingleDoctor = async (req, res) => {
    let connection;
    try{
        const doctorId = req.params?.id;
        if(!doctorId)
            return res.status(400).json({message:"Patient id is required"});

        connection = await connectToMySQL();
        const [result] = await connection.execute(
            `SELECT * FROM doctors WHERE id = ?`,
            [doctorId]
        );
        if(result.length > 0){
            res.status(200).json(result[0]);
        }else{
            return res.status(404).json({message:"Doctor not found"});
        }
    }catch(err){
        return res.status(500).json({error:err.message});
    }finally{
        connection?.end();
    }
};
export const updateSingleDoctor = async (req, res) => {
    let connection;
    try{
        const doctorId = req.params?.id;
        const {contact_number} = req.body;
        if(!doctorId)
            return res.status(400).json({message:"Patient id is required"});

        connection = await connectToMySQL();
        const [result] = await connection.execute(
            `SELECT * FROM doctors WHERE id = ?`,
            [doctorId]
        );
        if(result.length === 0){
            return res.status(404).json({message:"Doctor not found"});
        }

        const [updateResult] = await connection.execute(
            `UPDATE doctors SET contact_number = ? WHERE id = ?`,
            [contact_number,doctorId]
        );
        if(updateResult.affectedRows === 1){
            return res.status(200).json({message:"Doctor updated successfully"});
        }else{
            return res.status(500).json({message:"Error updating patient"});
        }
    }catch(err){
        return res.status(500).json({error:err.message});
    }finally{
        connection?.end();
    }


};
export const deleteSingleDoctor = async (req, res) => {
    let connection;
    try{
        const doctorId = req.params?.id;
        if(!doctorId)
            return res.status(400).json({message:"Patient id is required"});

        connection = await connectToMySQL();
        const [result] = await connection.execute(
            `SELECT * FROM doctors WHERE id = ?`,
            [doctorId]
        );
        if(result.length === 0){
            return res.status(404).json({message:"Doctor not found"});
        }

        const [deleteResult] = await connection.execute(
            `DELETE FROM doctors WHERE id = ?`,
            [doctorId]
        );
        if(deleteResult.affectedRows === 1){
            return res.status(200).json({message:"Doctor deleted successfully"});
        }else{
            return res.status(500).json({message:"Error deleting patient"});
        }
    }catch(err){
        return res.status(500).json({error:err.message});
    }finally{
        connection?.end();
    }   
};