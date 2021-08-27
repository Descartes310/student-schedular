import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import '../../Assets/container/StudentList.css';
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { PageHeader, Form, Input, Button, Select } from 'antd';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createSchedule, getCoursesByGrade } from '../../services/Teacher';

function CreateSchedule() {

    const history = useHistory();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [grade, setGrade] = useState(null);
    const [endDate, setEndDate] = useState('');
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [courseId, setCourseId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [repeatPeriod, setRepeatPeriod] = useState('');


    useEffect(() => {
        if(grade)
            getAllCourses();
    }, [grade]);

    const getAllCourses = () => {
        setLoading(true);
        getCoursesByGrade(grade).then(data => {
            if (data) {
                if (data.content) {
                    setCourses(data.content);
                }
            }
        }).finally(() => setLoading(false))
    }

    const handleSubmit = () => {

        if (startDate && endDate) {
            if (startDate.toString().length <= 0 || endDate.toString().length <= 0) {
                alert("Please, fill dates!");
                return
            }
        } else {
            alert("Please, fill the form dates!");
            return
        }

        if (endDate < startDate) {
            alert("Start date cannot be after end date");
            return
        }

        if (!courseId) {
            alert("Please, fill the course!");
            return
        }

        setSubmitting(true)

        let date = new Date(startDate);
        let d = (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getDate().toString().padStart(2, '0') + '/' + date.getFullYear() + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':00 -0500';
        let fdate = new Date(endDate);
        let f = (fdate.getMonth() + 1).toString().padStart(2, '0') + '/' + fdate.getDate().toString().padStart(2, '0') + '/' + fdate.getFullYear() + ' ' + fdate.getHours().toString().padStart(2, '0') + ':' + fdate.getMinutes().toString().padStart(2, '0') + ':00 -0500';

        let data = {
            courseId: courseId,
            startDate: d,
            endDate: f,
            repeatPeriodInDays: repeatPeriod,
        }

        console.log(data)

        createSchedule([data]).then(result => {
            history.push(`/schedules`)
        }).finally(() => setSubmitting(false));
    }

    return (

        <div>
            <PageHeader
                ghost={false}
                title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Create Schedule</p>}
                extra={[
                ]}
            >
                <Form
                    form={form}
                    autoComplete="off"
                    onFinish={handleSubmit}
                    layout="vertical"
                    onKeyPress={event => {
                        if (event.which === 13 /* Enter */) {
                            event.preventDefault();
                        }
                    }}
                    style={{ width: '80%', marginLeft: '10%' }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Select a grade" required style={{ flex: 1, marginRight: '10px' }}>
                            <Select onChange={(e) => setGrade(e)}>
                                <Select.Option value={null}>Select a grade</Select.Option>
                                <Select.Option value={1}>1</Select.Option>
                                <Select.Option value={2}>2</Select.Option>
                                <Select.Option value={3}>3</Select.Option>
                                <Select.Option value={4}>4</Select.Option>
                                <Select.Option value={5}>5</Select.Option>
                                <Select.Option value={6}>6</Select.Option>
                                <Select.Option value={7}>7</Select.Option>
                                <Select.Option value={8}>8</Select.Option>
                                <Select.Option value={9}>9</Select.Option>
                                <Select.Option value={10}>10</Select.Option>
                                <Select.Option value={11}>11</Select.Option>
                                <Select.Option value={12}>12</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Select the course" required style={{ flex: 1, marginRight: '10px', marginLeft: '10px' }}>
                            <Autocomplete
                                id="asynchronous-search"
                                options={courses}
                                size="small"
                                inputValue={course}
                                onInputChange={(__, newInputValue) => {
                                    setCourse(newInputValue);
                                }}
                                onChange={(__, newValue) => {
                                    setCourseId(newValue.id);
                                }}
                                open={open}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                loading={loading}
                                getOptionLabel={(record) => record.name}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="outlined"
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

                        <Form.Item label="Repeat period (in days)" required style={{ flex: 1, marginRight: '10px' }}>
                            <Input type="number" name="repeatPeriodInDays" onChange={(e) => setRepeatPeriod(e.target.value)} />
                        </Form.Item>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Start date" required style={{ flex: 1, marginRight: '10px' }}>
                            <Input type="date" name="startDate" onChange={(e) => setStartDate(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="End date" required style={{ flex: 1, marginRight: '10px' }}>
                            <Input type="date" name="endDate" onChange={(e) => setEndDate(e.target.value)} />
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button disabled={submitting} type="primary" size="large" htmlType="submit">
                            {
                                submitting ? 'Loading...' : 'Create a Schedule'
                            }
                        </Button>
                    </Form.Item>
                </Form>
            </PageHeader>
        </div>
    )
}
export default CreateSchedule
