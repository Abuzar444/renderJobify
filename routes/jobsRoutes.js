import express from 'express'
import { createJob, deleteJob, updateJob, getAllJobs, showStats } from '../controllers/jobsController.js'
import testUser from '../middleware/test-user.js';

const jobsRouter = express.Router()

jobsRouter.route('/').post(testUser, createJob).get(getAllJobs);
jobsRouter.route('/stats').get(showStats); // place before :id
jobsRouter.route('/:id').delete(testUser, deleteJob).patch(testUser, updateJob);

export default jobsRouter