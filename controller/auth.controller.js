import connectToMySQL from '../db/db.js';
import bcrypt from 'bcryptjs'
import {v4 as uuidv4} from 'uuid'
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

export const register = async (req, res) => {
    let connection = null;
    try {
        const { name, email, password,confirmPassword} = req.body;

        if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

        const connection = await connectToMySQL();

        const [existingUsers] = await connection.execute(
            "SELECT * FROM users WHERE BINARY email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserId = uuidv4();

        const [result] = await connection.execute(
            `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
            [newUserId, name, email, hashedPassword]
        );

        if (result.affectedRows === 1) {
            generateTokenAndSetCookie(newUserId, res);

            res.status(201).json({
                id: newUserId,
                name,
                email,
            });
        } else {
            res.status(400).json({ error: "Failed to create user" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }finally{
        if (connection) {
            connection.end();
        }
    }
};

export const login = async (req, res) => {
    let connection; 
    try {
        connection = await connectToMySQL();

        const { email, password } = req.body;

        
        const [existingUsers] = await connection.execute(
            "SELECT id, name, email, password FROM users WHERE email = ?",
            [email]
        );
        
        const user = existingUsers[0];

        
        const isPasswordValid = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordValid) {
            return res.status(400).json({ error: "Invalid Email or Password" });
        }
       
        generateTokenAndSetCookie(user.id, res);
        
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
        });

    } catch (err) {
        console.error("Error in login controller:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (connection) {
            connection.end();
        }
    }
};

