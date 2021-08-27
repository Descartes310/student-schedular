import 'antd/dist/antd.css';
import Moment from 'react-moment';
import { useHistory } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import '../../Assets/container/StudentList.css'
import React, { useEffect, useState } from 'react';
import { PageHeader, Form, Button, Select } from 'antd';
import { updateBooking, getCourses } from '../../services/Teacher';
import { getStudentProfileByDate, getSchedule } from '../../services/Student';

function UpdateBooking() {

    const history = useHistory();
    const location = useLocation();
    const [data] = useState(location.state.student);
    const [studentList, setStudentList] = useState([]);
    const [form] = Form.useForm();
    const [schedules, setSchedules] = useState([]);
    const [courses, setCourses] = useState([]);
    const [subjec, setSubjec] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getAllCourses();
        setSubjec(data.schedule.id)
        getStudents();
        getSchedule(data.studentProfile.grade, -1).then(data => {
            setSchedules(data.content)

        });
    }, []);

    const getAllCourses = () => {
        getCourses().then(data => {
            if (data) {
                if (data.content) {
                    setCourses(data.content);
                }
            }
        })
    }

    const changeChildren = (id) => {
        setSubjec(null);
        let _children = studentList.filter(c => c.id === id)[0];
        getSchedule(_children.grade ? _children.grade : 0, -1).then(data => {
            setSchedules(data.content)

        });
    }

    const changeSubject = (subjectId) => {
        setSubjec(subjectId);
    }

    const handleSubmit = () => {
        if (!subjec) {
            alert('Fill the form');
            return;
        }

        //setSubmitting(true);

        updateBooking(data.id, schedules.find(s => s.id === subjec)).then(data => {
            history.push(`/studentlist`)
        }).catch(err => {
            alert("Error occured when saving data, please retry!")
            console.log(err)
        }).finally(() => setSubmitting(false));
    }

    const getStudents = () => {
        getStudentProfileByDate(localStorage.getItem('toStart'), localStorage.getItem('toEnd'), 0, 100, 'firstName', 'asc').then(data => {
            if (data) {
                if (data.content) {
                    setStudentList(data.content);
                }
            }
        })
    }

    return (

        <div>
            <PageHeader
                ghost={false}
                title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Update Booking</p>}
                extra={[
                ]}
            >
                <Form
                    form={form}
                    autoComplete="off"
                    onFinish={handleSubmit}
                    layout="vertical"
                    style={{ width: '80%', marginLeft: '10%' }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        {/* <Form.Item label="Student" required style={{ flex: 1, marginRight: '10px' }}>
                            <Autocomplete
                                id="asynchronous-search"
                                options={studentList}
                                size="small"
                                inputValue={student}
                                // closeIcon={<EditOutlined style={{ color: 'blue' }}/>}
                                onInputChange={(__, newInputValue) => {
                                    setStudent(newInputValue);
                                }}
                                onChange={(__, newValue) => {
                                    changeChildren(newValue.id);
                                }}
                                defaultValue={data.studentProfile}
                                open={open}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                loading={loadingS}
                                getOptionLabel={(record) => record.firstName + " " + record.lastName}
                                // style={{ minWidth: 450, marginLeft: -250 }}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="outlined"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loadingS ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                }
                            />
                        </Form.Item> */}
                        <Form.Item label="Subject" required style={{ flex: 1, marginLeft: '10px' }}>
                            <Select onChange={(e) => changeSubject(e)} value={schedules.find(s => s.id === subjec) ? subjec : null}>
                                <option value={null}>Select a subject</option>
                                {
                                    schedules.filter(s => courses.find(c => c.id === s.courseId)).map(s => {
                                        return (
                                            <option value={s.id} key={s.id}>
                                                {courses.find(c => c.id === s.courseId).name + " | " } 
                                                {/* {s.startDate} */}
                                                <Moment local format="D MMM YYYY HH:MM" withTitle>{s.startDate}</Moment>
                                            </option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </div>
                    {/* <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Start date" required style={{ flex: 1, marginRight: '10px' }}>
                            <Select
                                onChange={(e) => changeDate(e)}
                                defaultValue={schedules.find(s => s.id === subjec) ?
                                    <Moment local format="D MMM YYYY HH:MM" withTitle> {data.schedule.startDate}</Moment> : null}>
                                <option value={null}>Select a start date</option>
                                {
                                    dates.map(date => {
                                        return (
                                            <option value={date.startDate} key={date.id}>
                                                <Moment local format="D MMM YYYY HH:MM" withTitle>
                                                    {date.startDate}
                                                </Moment>
                                            </option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="Teacher availability" required style={{ flex: 1, marginLeft: '10px' }}>
                            <Autocomplete
                                id="asynchronous-search"
                                options={list}
                                size="small"
                                inputValue={teacherName}
                                // closeIcon={<EditOutlined style={{ color: 'blue' }}/>}
                                onInputChange={(__, newInputValue) => {
                                    console.log(newInputValue)
                                    setTeacherName(newInputValue);
                                }}
                                defaultValue={data.teacherAvailability}
                                onChange={(__, newValue) => {
                                    setTeacherName(newValue.teacherProfile.firstName + " " + newValue.teacherProfile.lastName);
                                    if (newValue != null) {
                                        let teachers = list.filter(t => t.teacherProfile.firstName + " " + t.teacherProfile.lastName == newValue.teacherProfile.firstName + " " + newValue.teacherProfile.lastName);
                                        if (teachers.length === 0) {
                                            alert('This teacher is not found');
                                        } else {
                                            assigningStudents(teachers[0], data.id);
                                        }
                                    }
                                }}
                                open={open2}
                                onOpen={() => {
                                    setOpen2(true);
                                }}
                                onClose={() => {
                                    setOpen2(false);
                                }}
                                loading={loading}
                                getOptionLabel={(record) => record.teacherProfile.firstName + " " + record.teacherProfile.lastName}
                                // style={{ minWidth: 450, marginLeft: -250 }}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="outlined"
                                        onChange={(e) => changeTeacherSearch(e)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !open) {
                                                let teachers = list.filter(t => t.teacherProfile.firstName + " " + t.teacherProfile.lastName == teacherName);
                                                if (teachers.length === 0) {
                                                    alert('This teacher is not found');
                                                } else {
                                                    assigningStudents(teachers[0], data.id);
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                }
                            />
                        </Form.Item>
                    </div> */}
                    <Form.Item>
                        <Button onClick={() => handleSubmit} disabled={submitting} type="primary" size="large" htmlType="submit">
                            {
                                submitting ? 'Loading...' : 'Update Student booking'
                            }
                        </Button>
                    </Form.Item>
                </Form>
            </PageHeader>
        </div>
    )
}
export default UpdateBooking
