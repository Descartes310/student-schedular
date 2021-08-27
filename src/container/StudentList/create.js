import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import '../../Assets/container/StudentList.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState, useReducer } from 'react';
import { createBooking, getCourses } from '../../services/Teacher';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PageHeader, Form, Input, Button, Table, Spin } from 'antd';
import { VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from "@ant-design/icons"
import { getStudentProfileByDate, findStudentProfileByFirstNameAndLastName, getSchedule } from '../../services/Student'


const formReducer = (state, event) => {
    return {
        ...state,
        [event.name]: event.value
    }
}

function CreateBooking() {

    const history = useHistory();
    const [form] = Form.useForm();
    const [dat, setDat] = useState(null);
    const [dates, setDates] = useState([]);
    const [open, setOpen] = useState(false);
    const [subjec, setSubjec] = useState(null);
    const [comment, setComment] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [student, setStudent] = useState(null);
    const [gradeMin, setGradeMin] = useState("0");
    const [schedules, setSchedules] = useState([]);
    const [children, setChildren] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [loadingS, setLoadingS] = useState(false);
    const [gradeMax, setGradeMax] = useState("100");
    const [selectedRow, setSelectedRow] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [sortingType, setSortingType] = useState("desc");
    const [formData, setFormData] = useReducer(formReducer, {});
    const [sortingName, setSortingName] = useState("createDate");

    const [open1, setOpen1] = useState(false);
    const [tagsList, setTagsList] = useState([]);
    const [tags, setTags] = useState([]);

    const [tableProps, setTableProps] = useState({
        totalCount: 0,
        pageIndex: 0,
        pageSize: 30,
    });

    const rowSelection = {
        selectedRow,
        onChange: (selectedrow, records) => {
            console.log('selectedRowKeys changed: ', records);
            setSelectedRow(records);
            let record = records[0]
            let sch = {
                id: record.id,
                subject: record.subject,
                startDate: record.startDate,
                endDate: record.endDate,
                grades: record.grades,
                durationInMinutes: record.durationInMinutes,
                repeatPeriodInDays: record.repeatPeriodInDays,
                price: record.price,
            }
            console.log(sch)
            setSchedule(sch)
        },
        type: 'radio'
    };

    useEffect(() => {
        getAllCourses();
    }, []);

    const getAllCourses = () => {
        setLoading(true);
        getCourses().then(data => {
            if (data) {
                if (data.content) {
                    setCourses(data.content);
                }
            }
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        getStudents();
        getListView();
    }, [sortingType, sortingName, tableProps.pageIndex]);

    const changeChildren = (value) => {
        setDates([]);
        setSubjects([]);
        setDat(null);
        setSubjec(null);
        if (value === null) {
            setChildren(null)
        }
        let _children = studentList.filter(c => c.id === value.id)[0];
        setChildren(_children);
        getSchedule(_children.grade ? _children.grade : 0, -1).then(data => {
            setSchedules(data.content)
            var obj = {};
            for (var i = 0, len = data.content.length; i < len; i++)
                obj[data.content[i]['subject']] = data.content[i];

            data.content = new Array();
            for (var key in obj)
                data.content.push(obj[key]);
            setSubjects(data.content)
        });
    }

    const handleSubmit = () => {
        //let s = schedules.filter(s => s.startDate == dat).filter(s => s.subject == subjec)[0];
        if (comment === null || schedule === null)
            alert('Fill the form');
        setSubmitting(true);

        createBooking(children, schedule, comment).then(data => {
            history.push(`/studentlist`)
        }).catch(err => {
            alert("Error occured when saving data, please retry!")
            console.log(err)
        }).finally(() => setSubmitting(false));
    }

    const getStudents = (search = '') => {
        setLoadingS(true);
        if (search.length < 0) {
            getStudentProfileByDate(localStorage.getItem('toStart'), localStorage.getItem('toEnd'), 0, 100, 'firstName', 'asc').then(data => {
                if (data) {
                    if (data.content) {
                        setStudentList(data.content);
                    }
                }
            }).finally(() => setLoadingS(false))
        } else {
            findStudentProfileByFirstNameAndLastName(search, localStorage.getItem('toStart'), localStorage.getItem('toEnd'), 0, 100, null, 'firstName', 'asc').then(data => {
                if (data) {
                    if (data.content) {
                        setStudentList(data.content);
                    }
                }
            }).finally(() => setLoadingS(false))
        }

    }

    const getListView = () => {
        getSchedule(0, 100).then(data => {
            if (data) {
                if (data.content) {
                    setSchedules([])
                    setSchedules([...new Map(data.content.map(item => [item['id'], item])).values()]);
                    setTableProps({
                        ...tableProps,
                        totalCount: data.totalCount,
                        pageSize: 30,
                    });
                } else {
                    setSchedules([])
                    setTableProps({
                        ...tableProps,
                        totalCount: 0,
                        pageSize: 30,
                    });
                }
            } else {
                setSchedules([])
                setTableProps({
                    ...tableProps,
                    totalCount: 0,
                    pageSize: 30,
                });
            }
            setLoading(false);
        })
    }

    const columns = [
        {
            title: <div><span>Subject </span>
                {sortingName === "subject" && sortingType === "asc" && <VerticalAlignBottomOutlined />}
                {sortingName === "subject" && sortingType === "desc" && <VerticalAlignTopOutlined />}
                {sortingName === "subject" && sortingType === "" && ""}
            </div>,
            onHeaderCell: (column) => {
                return {
                    onClick: () => {
                        setSortingName("subject");
                        if (sortingType === "") { setSortingType("asc") }
                        else if (sortingType === "asc") { setSortingType("desc") }
                        else if (sortingType === "desc") { setSortingType("asc"); setSortingName("subject"); }
                    }
                };
            },
            render: (record) => {
                let course = courses.find(c => c.id === record.courseId);
                return (
                    <div>
                        {course ? course.subject.name : ''}
                    </div>
                )
            },
            key: 'subject',
        },
        {
            title: <div><span>Start Date </span>
                {sortingName === "startDate" && sortingType === "asc" && <VerticalAlignBottomOutlined />}
                {sortingName === "startDate" && sortingType === "desc" && <VerticalAlignTopOutlined />}
                {sortingName === "startDate" && sortingType === "" && ""}
            </div>,
            onHeaderCell: (column) => {
                return {
                    onClick: () => {
                        setSortingName("startDate");
                        if (sortingType === "") { setSortingType("asc") }
                        else if (sortingType === "asc") { setSortingType("desc") }
                        else if (sortingType === "desc") { setSortingType("asc"); setSortingName("startDate"); }
                    }
                };
            },
            render: (record) => {
                let s = record.startDate;
                let date = (new Date(s)).toLocaleDateString();
                let sTime = ((new Date(s)).toLocaleTimeString()).split(':');

                let sst = sTime[0] + ':' + sTime[1];

                return (
                    <span>
                        {date + " " + sst}
                    </span>
                )
            },
            key: 'startDate',
        },
        {
            title: <div><span>End Date </span>
                {sortingName === "endDate" && sortingType === "asc" && <VerticalAlignBottomOutlined />}
                {sortingName === "endDate" && sortingType === "desc" && <VerticalAlignTopOutlined />}
                {sortingName === "endDate" && sortingType === "" && ""}
            </div>,
            onHeaderCell: (column) => {
                return {
                    onClick: () => {
                        setSortingName("endDate");
                        if (sortingType === "") { setSortingType("asc") }
                        else if (sortingType === "asc") { setSortingType("desc") }
                        else if (sortingType === "desc") { setSortingType("asc"); setSortingName("endDate"); }
                    }
                };
            },
            render: (record) => {
                let f = record.endDate;
                let date = (new Date(f)).toLocaleDateString();
                return (
                    <span>
                        {date}
                    </span>
                )
            },
            key: 'endDate',
        },
        {
            title: 'Duration',
            key: 'durationInMinutes',
            render: (record) => {
                let course = courses.find(c => c.id === record.courseId);
                return (
                    <div>
                        {course ? course.durationInMinutes + ' min' : ''}
                    </div>
                )
            }
        },
        {
            title: 'Grades',
            key: 'grades',
            render: (record) => {
                let course = courses.find(c => c.id === record.courseId);
                if (!course) {
                    course = {};
                    course.grade = []
                }
                return (
                    <div>
                        {gradesToPrint(course)}
                    </div>
                )
            }
        },
        {
            title: 'Price',
            key: 'price',
            render: (record) => {
                let course = courses.find(c => c.id === record.courseId);
                return (
                    course && (
                        <div>
                            {course.prices[0].amount + ' ' + course.prices[0].currencyCode}
                        </div>
                    )
                )
            }
        },
        {
            title: 'Repeat',
            key: 'repeatPeriodInDays',
            render: (record) => {
                return (
                    <div>
                        {record.repeatPeriodInDays + ' d'}
                    </div>
                )
            }
        },
        {
            title: 'Language',
            key: 'language',
            render: (record) => {
                let course = courses.find(c => c.id === record.courseId);
                return (
                    <div>
                        {course ? course.language : ''}
                    </div>
                )
            }
        },
    ];

    const gradesToPrint = (profile) => {
        let i = 0;
        let result = '';
        if (profile === null) {
            return '';
        }
        if (profile.grades === null) {
            return '';
        }

        for (i = 0; i < profile.grades.length; i++) {
            if (i === 0) {
                result += profile.grades[i];
            } else {
                if (i === (profile.grades.length - 1))
                    if (Number(profile.grades[i - 1]) !== Number(profile.grades[i]) - 1)
                        result = result + ', ' + profile.grades[i];
                    else
                        result = result + '-' + profile.grades[i];
                else
                    if (Number(profile.grades[i - 1]) !== Number(profile.grades[i]) - 1)
                        if (Number(profile.grades[i]) !== Number(profile.grades[i + 1]) - 1)
                            result = result + ',' + profile.grades[i] + ', ' + profile.grades[i + 1];
                        else
                            result = result + ',' + profile.grades[i];
            }
        }

        return result;
    }

    const handleTableChange = (pagination, filters, sorter) => {
        setTableProps({
            ...tableProps,
            pageIndex: pagination.current - 1,
            pageSize: pagination.pageSize,
        });
        setLoading(true);
        setSchedules([]);
    };

    return (

        <div>
            <PageHeader
                ghost={false}
                title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Create Booking</p>}
                style={{ width: '100%' }}
                extra={[
                ]}
            >
                <Form
                    form={form}
                    autoComplete="off"
                    onFinish={handleSubmit}
                    layout="vertical"
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Student" required style={{ flex: 1, marginRight: '10px', marginLeft: '10px' }}>
                            <Autocomplete
                                id="asynchronous-search"
                                options={studentList}
                                size="small"
                                inputValue={student}
                                onInputChange={(__, newInputValue) => {
                                    setStudent(newInputValue);
                                    getStudents(newInputValue);
                                }}
                                onChange={(__, newValue) => {
                                    changeChildren(newValue);
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
                        <Form.Item label="Comment" required style={{ flex: 1, marginRight: '10px', marginLeft: '10px' }}>
                            <Input type="text" name="comment" style={{ marginTop: '3px', padding: '8px 8px', lineHeight: '14px' }} onChange={(e) => setComment(e.target.value)} />
                        </Form.Item>
                    </div>
                    {/* {
                        !tagsList ?
                            (<></>)
                            :
                            (<div style={{
                                display: 'flex',
                                flexDirection: 'row'
                            }}>
                                <Form.Item label="Tags" required style={{ flex: 1, marginRight: '10px', marginLeft: '10px' }} onClick={() => setOpen1(open1 ? false : true)}>
                                    <Select mode="multiple"
                                        allowClear
                                        loading={loadingS}
                                        open={open1}
                                        onFocus={() => setOpen1(true)}
                                        onBlur={() => setOpen1(false)}
                                        style={{ width: '100%' }}
                                        onSelect={() => setOpen1(false)}
                                        placeholder="Please select tags"
                                        onChange={handleChangeTags}>
                                        {
                                            tagsList.map(tag => {
                                                return (
                                                    <Select.Option value={tag.id} key={tag.id}>{tag.name}</Select.Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </div>)
                    } */}


                    {!schedules ? <Spin className="loading-table" /> :
                        <Table
                            className="table-padding"
                            style={{ marginLeft: '10px', marginRight: '10px' }}
                            columns={columns}
                            loading={loading}
                            dataSource={schedules}
                            onChange={handleTableChange}
                            pagination={{
                                total: tableProps.totalCount,
                                pageSize: tableProps.pageSize,
                                showTotal: (total, range) => `${range[0]}-${range[1]} out of ${total}`,
                            }}
                            rowSelection={rowSelection}
                            rowKey="id"
                        />}

                    <Form.Item>
                        <Button onClick={() => handleSubmit} disabled={submitting} type="primary" size="large" htmlType="submit">
                            {
                                submitting ? 'Loading...' : 'Create a Student booking'
                            }
                        </Button>
                    </Form.Item>
                </Form>
            </PageHeader>
        </div>
    )
}
export default CreateBooking
