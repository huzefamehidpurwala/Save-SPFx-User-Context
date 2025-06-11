import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config();

// Read allowed admins from config
const adminsPath = path.join(__dirname, '../../config/allowedAdmins.json');
const allowedAdmins = JSON.parse(readFileSync(adminsPath, 'utf8')).emails[0];

// Create a test token
const token = jwt.sign({ email: allowedAdmins }, process.env.JWT_SECRET!);
console.log('Test JWT Token:', token);
