import React, { useRef, useState } from 'react'
import dayjs from 'dayjs';

/* MUI */
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { 
  SideBar, 
  BubblePage, 
  InputField,
  InputRadio,
  InputDatePicker,
  InputTextArea,
  InputSelect,
  InputYearPicker,
  InputTextField,
  FormButton,
} from '../../../../ComponentIndex';
import InputNumberField from '../../../../Shared/InputNumberField/InputNumberField';
import styles from './TraineeProfileCreation.module.scss';
import { EDUCATIONAL_ATTAINMENT, SEX } from '../../../../../assets/utilities/constants';
import { isNullishCoalesce } from 'typescript';

const TraineeProfileCreation = () => {
  var todayMinusEighteenYears = dayjs().subtract(18, 'year').toDate();
  var todayMinus60Years = dayjs().subtract(60, 'year').toDate();

  const EDUCATIONAL_ATTAINMENT_OPTIONS = [
    EDUCATIONAL_ATTAINMENT.HIGHSCHOOL,
    EDUCATIONAL_ATTAINMENT.UNDERGRADUATE,
    EDUCATIONAL_ATTAINMENT.COLLEGE
  ]

  const SEX_OPTIONS  = [
    SEX.MALE,
    SEX.FEMALE
  ]

  function submitForm(event) {
    event.preventDefault();

    if (birthdate === null) {
      setBirthdayErrorProps({
        error: true,
        helperText: 'Birthdate is required'
      })
    }

    if (yearGraduated === null) {
      setYearGraduatedErrorProps({
        error: true,
        helperText: 'Year Graduated is required'
      })
    }

    console.log("First Name: ", firstName);
    console.log("Middle Name: ", middleName);
    console.log("Last Name: ", lastName);
    console.log("Sex: ", sex);
    console.log("Birthday: ", dayjs(birthdate).format('MM/DD/YYYY'));
    console.log("Address: ", address);
    console.log("Contact number: ", contact);
    console.log("Email: ", email);
    console.log("Educational Attainment: ", educationalAttainment);
    console.log("Year: ", dayjs(yearGraduated).format('MM/DD/YYYY'));

    window.history.go(-1);

  }

  /* STATES */
  const [ firstName, setFirstName ] = useState('');
  const [ middleName, setMiddleName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ sex, setSex ] = useState('Male');
  const [ birthdate, setBirthdate ] = useState(null);
  const [ address, setAddress ] = useState("");
  const [ contact, setContact ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ educationalAttainment, setEducationalAttainment ] = useState("");
  const [ yearGraduated, setYearGraduated ] = useState(null);

  const [ birthdateErrorProps, setBirthdayErrorProps ] = useState({
    error: false
  })

  const [ yearGraduatedErrorProps, setYearGraduatedErrorProps ] = useState({
    error: false
  })

  return (
    <>
    <SideBar />
    <BubblePage>
      <div className={styles["TraineeProfileCreation"]}>
        <h1>Trainee Profile Creation</h1>
        
        <form
          className={styles["TraineeProfileCreation__form"]}
          onSubmit={submitForm}>
          {/* CHANGE TRAINEE ID HERE */}
          <InputField
            label="Trainee ID"
            value={1}
            disabled={true}
            variant={"traineeID"}
            style={{marginLeft: "auto"}} />

          <div className={styles["row-1"]}>
            <TextField
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              label="First Name"
              required={true}
              name="firstName"
              id="firstName-input"
              fullWidth={true} />

            <TextField
              value={middleName}
              onChange={e => setMiddleName(e.target.value)}
              label="Middle Name"
              name="middleName"
              id="middleName-input"
              fullWidth={true} />

            <TextField
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              label="Last Name"
              required={true}
              name="lastName"
              id="lastName-input"
              fullWidth={true} />
          </div>

          <div className={styles["row-2"]}>
            <div className={styles["sex"]}>
              <FormControl required>
                <FormLabel id="sex-radio-buttons-group">Enrollment Status</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="sex-radio-buttons-group"
                  name="sex-radio-buttons-group"
                  value={sex}
                  onChange={e => setSex(e.target.value)}
                >
                  {SEX_OPTIONS.map((option, index) => {
                    return (
                      <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                    )
                  })}
                </RadioGroup>
              </FormControl>
            </div>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  minDate={todayMinus60Years}
                  maxDate={todayMinusEighteenYears}
                  label="Birthdate" 
                  name="birthdate" 
                  value={birthdate}
                  onChange={(newValue) => {
                    setBirthdate(newValue);
                  }}
                  inputFormat="MM/dd/yyyy"
                  openTo="year"
                  renderInput={(params) => <TextField {...params} fullWidth required 
                  {...birthdateErrorProps}/>}
                />
              </LocalizationProvider>
          </div>

          <div className={styles["row-3"]}>
            <TextField
              id="address-multiline-static"
              label="Address" 
              name="address"
              multiline
              rows={4}
              value={address}
              onChange={e => setAddress(e.target.value)}
              fullWidth
              required />

            <div className={styles["contact_wrapper"]}>
              <TextField
                value={contact}
                onChange={e => setContact(e.target.value)}
                label="Contact"
                placeholder={"09561234567"}
                name="contact"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                fullWidth 
                required />
            </div>
          </div>

          <div className={styles["row-4"]}>
            <div className={styles["email"]}>
              <TextField
                value={email}
                onChange={e => setEmail(e.target.value)}
                label="Email"
                name="email"
                placeholder="johndoe@mail.com"
                inputProps={{ inputMode: 'numeric', pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'}}
                type="email"
                fullWidth
                required
              />
            </div>

            <div className={styles["education"]}>
              <div className={styles["educationalAttainment"]}>
                <FormControl fullWidth required>
                  <InputLabel id="educationalAttainment-select-label">Educational Attainment</InputLabel>
                  <Select
                    labelId="educationalAttainment-select-label"
                    id="educationalAttainment-select"
                    name="educationalAttainment"
                    value={educationalAttainment ?? ''}
                    label="Course"
                    onChange={e => setEducationalAttainment(e.target.value)}
                  >
                    {EDUCATIONAL_ATTAINMENT_OPTIONS.map((option, index) => {
                      return <MenuItem key={index} value={option}>{option}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </div>

              <div className={styles["yearGraduated"]}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    maxDate={new Date()}
                    label="Year"
                    name="year" 
                    value={yearGraduated}
                    onChange={value => setYearGraduated(value)}
                    inputFormat="yyyy"
                    openTo="year"
                    views={['year']}
                    renderInput={(params) => <TextField {...params} fullWidth required 
                    {...yearGraduatedErrorProps}/>}
                  />
                </LocalizationProvider>
              </div>
            </div>

          </div>

          <div className={styles["form_buttons"]}>
            <FormButton label="Submit" type="submit" />
            {/* GO BACK TO PREVIOUS PAGE */}
            <FormButton label="Cancel" variant="cancel" type="button" onClick={() => window.history.go(-1)}/>
          </div>
        </form>
      </div>
    </BubblePage>
    </>
  )
}

export default TraineeProfileCreation