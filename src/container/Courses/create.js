import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import '../../Assets/container/StudentList.css';
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { PageHeader, Form, Input, Button, Select } from 'antd';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getSubjects } from '../../services/Teacher';
import { createCourse } from '../../services/Course';

const { TextArea } = Input;

const formReducer = (state, event) => {
    return {
        ...state,
        [event.name]: event.value
    }
}

function CreateCourse() {

    const history = useHistory();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [grade, setGrade] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [name, setName] = useState('');
    const [language, setLanguage] = useState('');
    const [price, setPrice] = useState(0);
    const [currency, setCurrency] = useState('');
    const [subject, setSubject] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [grades, setGrades] = useState([]);
    const [openGrades, setOpenGrades] = useState(false);
    const [subjectId, setSubjectId] = useState(null);
    const [duration, setDuration] = useState(0);


    useEffect(() => {
        getAllSubjects();
    }, []);

    const getAllSubjects = () => {
        setLoading(true);
        getSubjects().then(data => {
            if (data) {
                if (data.content) {
                    setSubjects(data.content);
                }
            }
        }).finally(() => setLoading(false))
    }

    const handleSubmit = () => {

        if (name.toString().length <= 0 || language.toString().length <= 0 || !subject || currency.toString().length <= 0 || grades.length <= 0) {
            alert("Please, fill form!");
            return
        }

        if (!subjectId) {
            alert("Please, fill the subject!");
            return
        }

        // setSubmitting(true)

        let data = {
            subject: { id: subjectId },
            grades: grades,
            language: language,
            name: name,
            prices: [{
                amount: price,
                currencyCode: currency
            }],
        }

        console.log(data)

        createCourse(data).then(result => {
            history.push(`/courses`)
        }).finally(() => setSubmitting(false));
    }

    const handleChangeSelect = (value) => {
        setGrades(value.toString().split(',').map(i => Number(i)));
    }

    return (

        <div>
            <PageHeader
                ghost={false}
                title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Create Course</p>}
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
                        <Form.Item label="Name" required style={{ flex: 1, marginRight: '10px' }}>
                            <Input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Language" required style={{ flex: 1, marginRight: '10px' }}>
                            <Input type="text" name="language" value={language} onChange={(e) => setLanguage(e.target.value)} />
                        </Form.Item>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Grades" required style={{ flex: 1, marginRight: '10px' }}
                            onClick={() => setOpenGrades(!openGrades)}>
                            <Select
                                mode="multiple"
                                allowClear
                                open={openGrades}
                                defaultValue={grades}
                                onFocus={() => setOpenGrades(true)}
                                onBlur={() => setOpenGrades(false)}
                                style={{ width: '100%' }}
                                onSelect={() => setOpenGrades(false)}
                                placeholder="Please select grades"
                                onChange={handleChangeSelect}
                            >
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
                        <Form.Item label="Select the subject" required style={{ flex: 1, marginRight: '10px', marginLeft: '10px' }}>
                            <Autocomplete
                                id="asynchronous-search"
                                options={subjects}
                                size="small"
                                inputValue={subject}
                                onInputChange={(__, newInputValue) => {
                                    setSubject(newInputValue);
                                }}
                                onChange={(__, newValue) => {
                                    setSubjectId(newValue.id);
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

                        <Form.Item label="Duration (in minutes)" required style={{ flex: 1, marginRight: '10px' }}>
                            <Input type="number" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
                        </Form.Item>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Price" required style={{ flex: 1, marginRight: '10px' }}>
                            <Input type="number" name="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Currency" required style={{ flex: 1, marginRight: '10px' }}>
                            <Input type="text" name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button disabled={submitting} type="primary" size="large" htmlType="submit">
                            {
                                submitting ? 'Loading...' : 'Create a course'
                            }
                        </Button>
                    </Form.Item>
                </Form>
            </PageHeader>
        </div>
    )
}
export default CreateCourse;
