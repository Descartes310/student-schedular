import 'antd/dist/antd.css';
import PhoneInput from 'react-phone-input-2';
import { useHistory } from 'react-router-dom';
import 'react-phone-input-2/lib/bootstrap.css';
import "react-phone-input-2/lib/bootstrap.css";
import '../../Assets/container/StudentList.css';
import { getCountry, getTags } from '../../services/Student';
import React, { useEffect, useState, useReducer } from 'react'
import { PageHeader, Form, Input, Button, Select } from 'antd';
import { getSubjects, createTeacher } from '../../services/Teacher';

const formReducer = (state, event) => {
    return {
        ...state,
        [event.name]: event.value
    }
}

function CreateTeacher() {

    const history = useHistory();
    const [country, setCountry] = useState(null);
    const [grades, setGrades] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [subjectsList, setSubjectsList] = useState([]);
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    const [sortingName, setSortingName] = useState("name");
    const [sortingType, setSortingType] = useState("desc");

    const [listProps, setListProps] = useState({
        index: 0,
        size: 10,
    });

    const [open1, setOpen1] = useState(false);
    const [tagsList, setTagsList] = useState([]);
    const [tags, setTags] = useState([]);

    const getEnabledTags = () => {
        setLoading(true)
        getTags(listProps.index, listProps.size, sortingName, sortingType).then(data => {
            if (data) {
                if (data.content) {
                    setTagsList(data.content.filter(t => t.enabled === true));
                }
            }
        }).finally(() => setLoading(false))
    }

    const handleChangeTags = (value) => {
        setTags(value);
    }


    useEffect(() => {
        getAllSubjects();
        getCountry().then(data => {
            setCountry(data.countryCode.toString().toLowerCase());
        })
        getEnabledTags();
        // getTenantsList();
    }, []);

    const handleChange = event => {
        setFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const handleChangeSelect = (value) => {
        setGrades(value.toString().split(',').map(i => Number(i)));
    }

    const handleChangeSubjects = (value) => {
        setSubjects(value);
    }

    const getAllSubjects = () => {
        getSubjects().then(data => {
            setSubjectsList(data.content)
        });
    }

    const handleSubmit = () => {

        if (formData.firstName && formData.lastName && formData.iemail && formData.schoolName && formData.schoolBoard && phone) {
            if (formData.firstName.toString().length <= 0
                || formData.lastName.toString().length <= 0
                || formData.schoolName.toString().length <= 0
                || formData.schoolBoard.toString().length <= 0
                || phone.toString().length <= 0
                || formData.iemail.toString().length <= 0
            ) {
                alert("Please, fill the form!");
                // return
            }
        } else {
            alert("Please, fill the form!");
            // return
        }


        setSubmitting(true);

        createTeacher(formData.firstName, formData.lastName, formData.iemail, formData.schoolName, formData.schoolBoard, grades, subjects.map(sid => { return { id: sid }}), phone).then(data => {
            history.push(`/teacherprofiles`);
        }).catch(err => {
            alert("Error occured when saving data, please retry!")
        })
            .finally(() => setSubmitting(false));
    }

    return (

        <div>
            <PageHeader
                ghost={false}
                title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Create Teacher</p>}
                extra={[
                ]}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    style={{ width: '80%', marginLeft: '10%' }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Fist Name" required style={{ flex: 1, marginRight: '10px' }} autoComplete="off">
                            <Input type="text" name="firstName" onChange={handleChange} autoComplete="off" />
                        </Form.Item>
                        <Form.Item label="Last Name" required style={{ flex: 1, marginLeft: '10px' }} autoComplete="off">
                            <Input type="text" name="lastName" onChange={handleChange} autoComplete="off" />
                        </Form.Item>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Email" required style={{ flex: 1, marginRight: '10px' }} autoComplete="off">
                            <Input type="email" name="iemail" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Phone Number" required style={{ flex: 1, marginLeft: '10px' }}>
                            <PhoneInput
                                enableSearch
                                countryCodeEditable={false}
                                disableCountryCode={false}
                                inputClass={"form-control"}
                                searchStyle={{
                                    width: "90%",
                                }}
                                inputStyle={{
                                    borderRadius: "0px",
                                    width: "inherit",
                                    paddingTop: '5px',
                                    paddingBottom: '5px'
                                }}
                                country={country}
                                // value={phone}
                                onChange={(value, country, e, formattedValue) => {
                                    setPhone(formattedValue)
                                }}
                            />
                        </Form.Item>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Grades" required style={{ flex: 1, marginRight: '10px' }}
                            onClick={() => setOpen(open ? false : true)}>
                            <Select
                                mode="multiple"
                                allowClear
                                open={open}
                                onFocus={() => setOpen(true)}
                                onBlur={() => setOpen(false)}
                                style={{ width: '100%' }}
                                onSelect={() => setOpen(false)}
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

                        {
                            subjectsList.length > 0 ?

                                <Form.Item label="Subjects" required style={{ flex: 1, marginLeft: '10px' }} onClick={() => setOpen2(open2 ? false : true)}>
                                    <Select mode="multiple"
                                        allowClear
                                        open={open2}
                                        onFocus={() => setOpen2(true)}
                                        onBlur={() => setOpen2(false)}
                                        style={{ width: '100%' }}
                                        onSelect={() => setOpen2(false)}
                                        placeholder="Please select subjects"
                                        onChange={handleChangeSubjects}>
                                        {
                                            subjectsList.map(subject => {
                                                return (
                                                    <Select.Option value={subject.id} key={subject.id}>{subject.name}</Select.Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                : null}
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="School Name" required style={{ flex: 1, marginRight: '10px' }}>
                            <Input type="text" name="schoolName" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="School Board" required style={{ flex: 1, marginLeft: '10px' }}>
                            <Input type="text" name="schoolBoard" onChange={handleChange} />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button disabled={submitting} type="primary" size="large" htmlType="submit">
                            {
                                submitting ? 'Loading...' : 'Create a Teacher Profile'
                            }
                        </Button>
                    </Form.Item>
                </Form>
            </PageHeader>
        </div>
    )
}
export default CreateTeacher
