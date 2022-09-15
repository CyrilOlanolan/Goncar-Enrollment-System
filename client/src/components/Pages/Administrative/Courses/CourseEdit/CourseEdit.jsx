import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* MUI */
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import {
  SideBar,
  BubblePage,
  InputField,
  FormButton,
} from "../../../../ComponentIndex";
import styles from "./CourseEdit.module.scss";
import {
  useCourse,
  useTrainingYears,
} from "../../../../../assets/utilities/swr";

import { putCourse } from "../../../../../assets/utilities/axiosUtility";

// VALIDATION FOR START DATE AND END DATE
const CourseEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* STATE */
  const [courseID] = useState(location.state.courseID);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [units, setUnits] = useState("");
  const [hoursRequired, setHoursRequired] = useState("");
  const [trainingYear, setTrainingYear] = useState("");

  const [availableTrainingYears, setAvailableTrainingYears] = useState([]);

  // MAPS
  const [trainingYearNameID, setTrainingYearNameID] = useState({}); //KEY: TRAINING YEAR NAME, VALUE=TRAINING YEAR ID

  // FETCH TRAINING YEAR HERE
  const { trainingYears, isTrainingYearsLoading, isTrainingYearsError } =
    useTrainingYears();

  useEffect(() => {
    if (isTrainingYearsError)
      alert("Error fetching training years! Please check internet connection.");

    let flatten = [];
    let trainingYearMap = {};

    if (!isTrainingYearsLoading) {
      for (let trainingYear of trainingYears) {
        flatten.push(trainingYear.trainingYearSpan);
        trainingYearMap[trainingYear.trainingYearSpan] =
          trainingYear.trainingYearId;
      }
      setAvailableTrainingYears(flatten);
      setTrainingYearNameID(trainingYearMap);
    }
  }, [trainingYears, isTrainingYearsLoading, isTrainingYearsError]);

  // FETCH COURSE DETAILS HERE
  const { course, isCourseLoading, isCourseError } = useCourse(courseID);

  useEffect(
    () => {
      if (isCourseError) alert("ERROR fetching course details. Check internet connection!");

      if (!isCourseLoading) {
        setCourseName(course?.courseName);
        setTrainingYear(course?.trainingYears?.trainingYearSpan);
        setCourseDescription(course?.courseDescription);
        setUnits(course?.units);
        setHoursRequired(course?.requiredHours);
      }
    }
  , [ course, isCourseLoading, isCourseError ])

  function handleSubmit(event) {
    event.preventDefault();

    let data = {
      courseName: courseName,
      courseDescription: courseDescription,
      requiredHours: Number(hoursRequired),
      units: Number(units),
      trainingYearId: trainingYearNameID[trainingYear]
    };

    console.log(data);

    putCourse(courseID, data)
    .then(
      (status) => {
        if (status === 200) {
          navigate('/administrative/courses');
        }
        else alert(`BAD REQUEST: ${status}`);
      }
    )
  }

  return (
    <>
      <SideBar />
      <BubblePage>
        <h1 className={styles["title"]}>Edit Course</h1>
        <form className={styles["CourseEdit"]} onSubmit={handleSubmit}>
          <div className={styles["IDs"]}>
            <InputField
              label="Course ID"
              value={courseID}
              disabled={true}
              variant={"traineeID"}
              style={{ marginLeft: "auto" }}
            />
          </div>

          <div className={styles["row-2"]}>
            <TextField
              value={courseName ?? ""}
              onChange={(e) => setCourseName(e.target.value)}
              label="Course Name"
              name="courseName"
              id="courseName-input"
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel id="training-year-select-label">
                Training Year
              </InputLabel>
              <Select
                labelId="training-year-select-label"
                id="training-year-select"
                name="training-year"
                value={trainingYear ?? ""}
                label="Training Year"
                onChange={(e) => setTrainingYear(e.target.value)}
              >
                {availableTrainingYears.map((option, index) => {
                  return (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>

          <div className={styles["row-3"]}>
            <TextField
              value={courseDescription ?? ""}
              onChange={(e) => setCourseDescription(e.target.value)}
              label="Course Description"
              name="courseDescription"
              id="courseDescription-input"
              required
              multiline
              rows={4}
              fullWidth
            />
          </div>

          <div className={styles["row-4"]}>
            <TextField
              value={units ?? ""}
              onChange={(e) => setUnits(e.target.value)}
              label="Units"
              name="units"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              fullWidth
              required
            />
            <TextField
              value={hoursRequired ?? ""}
              onChange={(e) => setHoursRequired(e.target.value)}
              label="Hours Required"
              name="hoursRequired"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              fullWidth
              required
            />
          </div>

          <div className={styles["form_buttons"]}>
            <FormButton label="Update" type="submit" />
            {/* GO BACK TO PREVIOUS PAGE */}
            <FormButton
              label="Cancel"
              variant="cancel"
              type="button"
              onClick={() => window.history.go(-1)}
            />
          </div>
        </form>
      </BubblePage>
    </>
  );
};

export default CourseEdit;
