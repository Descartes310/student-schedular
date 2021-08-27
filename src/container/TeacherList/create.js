import 'antd/dist/antd.css';
import Moment from 'react-moment';
import { useHistory } from 'react-router-dom'
import '../../Assets/container/StudentList.css'
import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { PageHeader, Form, Button, Select } from 'antd';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createAvailibility, getCourses } from '../../services/Teacher';
import { getTeacherProfileByDate, getSchedule, findTeacherProfileByFirstNameAndLastName } from '../../services/Student'

function CreateAvailibility() {

    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [loadingS, setLoadingS] = useState(false);
    const [student, setStudent] = useState('');
    const [studentList, setStudentList] = useState([]);
    const [courses, setCourses] = useState([]);
    const [children, setChildren] = useState(null);
    const [form] = Form.useForm();
    const [schedules, setSchedules] = useState([]);
    const [dates, setDates] = useState([]);
    const [ends, setEnds] = useState([]);
    const [dat, setDat] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [subjec, setSubjec] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [sortingType, setSortingType] = useState("desc");

    useEffect(() => {
        getAllCourses();
    }, []);

    const changeChildren = (id) => {
        setDates([]);
        setDat(null);
        setSubjec(null);
        let _children = studentList.filter(c => c.id == id)[0];
        setChildren(_children);
        getSchedule(1).then(data => {
            setSchedules(data.content);
            setDat(null);
            setDates([...new Map(data.content.filter(s => _children.subjects.map(cs => cs.id).includes(courses.find(c => c.id === s.courseId) ? courses.find(c => c.id === s.courseId).subject.id : 'null')).map(item => [item['createDate'], item])).values()]);
            // setDates([...new Map(data.content.map(item => [item['createDate'], item])).values()]);
        });
    }

    const changeDate = (date) => {
        setDat(date);
        setEnds([...new Map(schedules.filter(s => children.subjects.includes(s.subject)).filter(s => s.startDate == date).map(item => [item['createDate'], item])).values()]);
        //setEnds([...new Map(schedules.filter(s => s.startDate == date).map(item => [item['createDate'], item])).values()]);
    }

    const changeEndDate = (date) => {
        setEndDate(date);
    }

    const handleSubmit = () => {
        let s = schedules.filter(s => s.startDate === dat).filter(s => s.endDate === endDate)[0];
        if (s === null || children === null) {
            alert('Fill the form');
            return
        }
        setSubmitting(true);

        createAvailibility(children, s).then(data => {
            history.push(`/teacherlist`)
        }).catch(err => {
            alert("Error occured when saving data, please retry!")
            console.log(err)
        }).finally(() => setSubmitting(false));
    }

    const getStudents = (newInputValue = '') => {
        setLoadingS(true);
        if (newInputValue.length < 1) {
            getTeacherProfileByDate(localStorage.getItem('toStart'), localStorage.getItem('toEnd'), 0, 100, 'firstName', sortingType).then(data => {
                if (data) {
                    if (data.content) {
                        setStudentList(data.content.filter(t => t.subjects));
                    }
                }
            }).finally(() => setLoadingS(false))
        } else {
            findTeacherProfileByFirstNameAndLastName(newInputValue, localStorage.getItem('toStart'), localStorage.getItem('toEnd'), 0, 100, null, 'firstName', sortingType).then(data => {
                if (data) {
                    if (data.content) {
                        setStudentList(data.content.filter(t => t.subjects));
                    }
                }
            }).finally(() => setLoadingS(false))
        }
    }

    const getAllCourses = () => {
        getCourses().then(data => {
            getStudents();
            if (data) {
                if (data.content) {
                    setCourses(data.content);
                }
            }
        })
    }

    return (

        <div>
            <PageHeader
                ghost={false}
                title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Create Availability</p>}
                extra={[
                ]}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    autoComplete="off"
                    layout="vertical"
                    style={{ width: '80%', marginLeft: '10%' }}
                >

                    <Form.Item label="Teacher" required>
                        <Autocomplete
                            id="asynchronous-search"
                            options={studentList}
                            size="small"
                            inputValue={student}
                            onInputChange={(__, newInputValue) => {
                                if (newInputValue != null) {
                                    setStudent(newInputValue);
                                    getStudents(newInputValue);
                                }
                            }}
                            onChange={(__, newValue) => {
                                if (newValue != null) {
                                    changeChildren(newValue.id);
                                }
                            }}
                            open={open}
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            loading={loadingS}
                            getOptionLabel={(record) => record.firstName + " " + record.lastName}
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
                    </Form.Item>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Start date" required style={{ flex: 1, marginRight: '10px' }}>
                            <Select onChange={(e) => changeDate(e)}>
                                <Select.Option value={null}>Select a start date</Select.Option>
                                {
                                    dates.map(date => {
                                        return (
                                            <Select.Option value={date.startDate} key={date.id}>
                                                <Moment local format="D MMM YYYY HH:MM" withTitle>
                                                    {date.startDate}
                                                </Moment>
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="End date" required style={{ flex: 1, marginLeft: '10px' }}>
                            <Select onChange={(e) => changeEndDate(e)}>
                                <Select.Option value={null}>Select an end date</Select.Option>
                                {
                                    ends.map(date => {
                                        return (
                                            <Select.Option value={date.endDate} key={date.id}>
                                                <Moment local format="D MMM YYYY HH:MM" withTitle>
                                                    {date.endDate}
                                                </Moment>
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button disabled={submitting || schedules.length <= 0} onClick={() => handleSubmit} type="primary" size="large" htmlType="submit">
                            {
                                submitting ? 'Loading...' : 'Create a Teacher Availability'
                            }
                        </Button>
                    </Form.Item>
                </Form>
            </PageHeader>
        </div>
    )
}
export default CreateAvailibility
