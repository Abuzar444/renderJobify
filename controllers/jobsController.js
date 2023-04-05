import mongoose from 'mongoose';
import Job from '../models/Job.js';
import { DateTime } from 'luxon';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';

const createJob = async (req, res) => {
  const { position, company } = req.body;
  if (!position || !company) {
    throw new BadRequestError('Συμπλήρωσε όλα τα πεδία! (1. JobController)');
  }

  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const jobId = req.params.id;
  const { company, position } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Συμπλήρωσε όλα τα πεδία! (2. JobController)');
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`Δεν βρέθηκε εργασία με ταυτότητα: ${jobId}`);
  }

  // check permissions
  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`Δεν βρέθηκε εργασία με ταυτότητα: ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Επιτυχής διαγραφή εργασίας!' });
};

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }

  if (status !== 'Όλα') {
    queryObject.status = status;
  }

  if (jobType !== 'Όλα') {
    queryObject.jobType = jobType;
  }

  // NO AWAIT
  let result = Job.find(queryObject);

  // chain sort conditions
  if (sort === 'Νεότερες' || sort === 'Latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'Παλαιότερες' || sort === 'Oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'Α -> Ω' || sort === 'A -> Z') {
    result = result.sort('position');
  }
  if (sort === 'Ω -> Α' || sort === 'Z -> A') {
    result = result.sort('-position');
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    Εκκρεμεί: stats.Εκκρεμεί || 0,
    Συνέντευξη: stats.Συνέντευξη || 0,
    Απορρίφθηκε: stats.Απορρίφθηκε || 0,
    Εγκρίθηκε: stats.Εγκρίθηκε || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: '$createdAt',
          },
          month: {
            $month: '$createdAt',
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = DateTime.fromObject({ month: month, year: year })
        .setLocale('el')
        .toFormat('MMM y');

      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({
    // stats,
    defaultStats,
    monthlyApplications,
  });
};

export { createJob, deleteJob, updateJob, getAllJobs, showStats };
