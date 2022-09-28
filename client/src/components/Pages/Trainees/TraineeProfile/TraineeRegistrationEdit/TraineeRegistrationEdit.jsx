import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../../../../../assets/utilities/swr';
import axios from "axios";
/* MUI */
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import {
  SideBar,
  BubblePage,
  InputField,
  FormButton
} from '../../../../ComponentIndex';
import { ENROLLMENT_STATUS } from '../../../../../assets/utilities/constants';
import styles from './TraineeRegistrationEdit.module.scss';

import { useGroupedBatches } from '../../../../../assets/utilities/swr';
import { putTraineeRegistration } from '../../../../../assets/utilities/axiosUtility';

// TODO: VALIDATION
const TraineeRegistrationEdit = () => {
  const navigate = useNavigate();

  const [ courseOptions, setCourseOptions ] = useState([]);
  const ENROLLMENT_STATUS_OPTIONS = [
    ENROLLMENT_STATUS.ACTIVE,
    ENROLLMENT_STATUS.DROPPED,
    ENROLLMENT_STATUS.FINISHED
  ]

  /* STATES */
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedEnrollmentStatus, setSelectedEnrollmentStatus] = useState(ENROLLMENT_STATUS_OPTIONS[0]);

  const location = useLocation();

  const traineeID = location.state.traineeID;

  // GET NUMBER OF REGISTRATIONS FOR UNIQUE ID
  const [ regID ] = useState(location.state.regID);

  // FETCH REG DETAILS
  useEffect(
    () => {
      axios.get(`https://goncar-system-backend.herokuapp.com/api/trainees/${traineeID}/registrations/${regID}`)
      .then (function (response) {
        setSelectedCourse(response.data[0]?.batch?.courses?.courseName ?? "");
        setSelectedEnrollmentStatus(response.data[0]?.registrationStatus);
        setTimeout(
          () => {
            setSelectedBatch(response.data[0]?.batch?.batchName ?? "");
          }
        , [100])
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  , [traineeID, regID]);

  // FETCH AVAILABLE COURSES
  const { courses, isCoursesLoading, isCoursesError } = useCourses();

  useEffect(
    () => {
      if (isCoursesError) alert("Error fetching courses! Please refresh or check your internet connection.");
      let courseFlattened = [];

      // FLATTEN
      if (!isCoursesLoading) {
        for (let course of courses) {
          courseFlattened.push(course.courseName);
        }
      }

      setCourseOptions(courseFlattened);
    }
  , [courses, isCoursesLoading, isCoursesError])

  // FETCH EXISTING BATCHES
  const { groupedBatches, isGroupedBatchesLoading, isGroupedBatchesError } = useGroupedBatches();
  
  const [coursesMap, setCoursesMap] = useState({}); // KEY: courseName, VALUE: courseId
  const [batchesMap, setBatchesMap] = useState({}); // KEY: courseId, VALUE: Array of batches
  const [batchesIDMap, setBatchesIDMap] = useState({}); // KEY: batchName, VALUE: batchID
  const [availableBatches, setAvailableBatches] = useState([]);

  useEffect (
    () => {
      if (isGroupedBatchesError) alert("Error fetching grouped batches! Please refresh or check your internet connection.");
      let coursesFlattened = {};
      let batchesFlattened = {};
      if (!isGroupedBatchesLoading) {
        for (let i = 0; i < groupedBatches.length; i++) {
          // MAP COURSES TO RESPECTIVE courseId
          coursesFlattened[groupedBatches[i].courseName] =  groupedBatches[i].courseId
          // MAP BATCHES TO RESPECTIVE courseId
          batchesFlattened[groupedBatches[i].courseId] = groupedBatches[i].batch;
        }
      }

      setCoursesMap(coursesFlattened);
      setBatchesMap(batchesFlattened);
    }
  , [groupedBatches, isGroupedBatchesLoading, isGroupedBatchesError])

  // ON CHANGE OF SELECTED COURSE
  useEffect(
    () => {
      // CLEAR BATCH FIELD EVERYTIME SELECTED COURSE CHANGES
      setSelectedBatch("");
      console.log('asdasd')

      let courseIdentification = coursesMap[selectedCourse];
      
      let batchesInCourse = batchesMap[courseIdentification] ?? [];
      let batchIDNameMap = {};
      let batchNamesFlattened = [];

      for (let batches of batchesInCourse) {
        batchIDNameMap[batches.batchName] = batches.batchId;
        batchNamesFlattened.push(batches.batchName);
      }

      setBatchesIDMap(batchIDNameMap);
      setAvailableBatches(batchNamesFlattened);
    }
  , [selectedCourse, batchesMap, coursesMap])

  function submitForm(event) {
    event.preventDefault();

    let data = {
      batchId: batchesIDMap[selectedBatch],
      registrationStatus: selectedEnrollmentStatus
    }

    putTraineeRegistration(traineeID, regID, data)
    .then(
      (status) => {
        if (status === 200) {
          navigate(`/trainees/${traineeID}`);
        }
        else alert(`BAD REQUEST: ${status}`);
      }
    )
  }

  return (
    <>
      <SideBar />
      <BubblePage>
        <h1 className={styles["title"]}>Edit Trainee Registration</h1>

        <form className={styles["TraineeRegistrationCreation"]} onSubmit={submitForm}>
          <div className={styles["header"]}>
            {/* CHANGE VALUES HERE */}
            <InputField
              label="Registration No."
              value={regID ?? ""}
              disabled={true}
              variant={"traineeID"}
            />

            <InputField
              label="Trainee ID"
              value={traineeID ?? ""}
              disabled={true}
              variant={"traineeID"}
            />
          </div>

          { courseOptions.length === 0 || (availableBatches.length === 0 && selectedCourse) ?
            <Alert severity="warning">
              <AlertTitle>Warning: Missing Data Field/s</AlertTitle>
              {courseOptions.length === 0 ? <p><strong>No courses available</strong> &mdash; add under <Link to={'/administrative/courses/new'} style={{color: "#0c4982", textDecoration: "none"}}>Administrative</Link>.</p> : null}
              {(availableBatches.length === 0 && selectedCourse) ? <p><strong>No batches available</strong> &mdash; add under <Link to={'/batches/new'} style={{color: "#0c4982", textDecoration: "none"}}>Batches</Link>.</p> : null}
            </Alert>
            : null
          }

          <div className={styles["row-2"]}>
            <FormControl fullWidth required>
              <InputLabel id="course-select-label">Course</InputLabel>
              <Select
                labelId="course-select-label"
                id="cousrse-select"
                name="course"
                value={selectedCourse ?? ''}
                label="Course"
                onChange={e => setSelectedCourse(e.target.value)}
              >
                {courseOptions.map((option, index) => {
                  return <MenuItem key={index} value={option}>{option}</MenuItem>
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel id="batch-select-label">Batch</InputLabel>
              <Select
                labelId="batch-select-label"
                id="batch-select"
                name="batch"
                value={selectedBatch ?? ""}
                label="Course"
                onChange={e => setSelectedBatch(e.target.value)}
                disabled={selectedCourse ? false : true}
                defaultValue={""}
              >
                {availableBatches.map((option, index) => {
                  return <MenuItem key={index} value={option}>{option}</MenuItem>
                })}
              </Select>
            </FormControl>
          </div>

          <div className={styles["row-5"]}>
            <FormControl required>
              <FormLabel id="enrollment-status-radio-buttons-group">Enrollment Status</FormLabel>
              <RadioGroup
                row
                aria-labelledby="enrollment-status-radio-buttons-group"
                name="enrollment-status-radio-buttons-group"
                value={selectedEnrollmentStatus ?? ""}
                onChange={e => setSelectedEnrollmentStatus(e.target.value)}
              >
                {ENROLLMENT_STATUS_OPTIONS.map((option, index) => {
                  return (
                    <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                  )
                })}
              </RadioGroup>
            </FormControl>
          </div>

          <div className={styles["form_buttons"]}>
            <FormButton label="Update" type="submit" />
            {/* GO BACK TO PREVIOUS PAGE */}
            <FormButton label="Cancel" variant="cancel" type="button" onClick={() => window.history.go(-1)}/>
          </div>
        </form>
      </BubblePage>
    </>
  )
}

export default TraineeRegistrationEdit;