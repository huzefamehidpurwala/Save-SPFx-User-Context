import { Router } from 'express';
import { UserContextController } from '../controllers/userContext';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

// POST endpoint for receiving SharePoint context
router.post('/user-context', /* validateUserContext, */ UserContextController.createOrUpdate);

// Protected GET endpoint for retrieving all user contexts
router.get('/user-context', authenticateJWT, UserContextController.getAll);

export default router;
