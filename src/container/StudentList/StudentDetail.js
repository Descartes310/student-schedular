import Moment from 'react-moment';
import { Form, Input } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { Row, Col, PageHeader, Button, Card } from 'antd';
import { useLocation, useHistory } from "react-router-dom";
import React, { useState, useEffect, useReducer } from 'react';
import { assignStudentToAnotherTeacher, getBooking, sendMessageToBooking, getStudentDetail, getBookingAvailability } from '../../services/Student';
import { createComment, updateComment, approveComment, getCourses, getTeacherProfileById, getScheduleById, getBookingComments } from '../../services/Teacher';

const formReducer = (state, event) => {
    return {
        ...state,
        [event.name]: event.value
    }
}

function StudentDetail(props) {

    const history = useHistory();
    const { params } = props.match;
    const location = useLocation();
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState(null);
    const [comments, setComments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [studentDetail, setStudentDetail] = useState(location.state.student);

    useEffect(() => {
        getComments();
        getAllCourses();
        getAvailability();
    }, []);

    useEffect(() => {
        if (studentDetail.teacherAvailability) {
            getTeacherProfileById(studentDetail.teacherAvailability.teacherProfile.id).then(teacher => {
                if (teacher) {
                    let tmpStudent = studentDetail;
                    tmpStudent.teacherAvailability.teacherProfile = teacher;
                    setStudentDetail(tmpStudent);
                }
            })
        }

        getScheduleById(studentDetail.schedule.id).then(schedule => {
            if (schedule) {
                let tmpStudent = studentDetail;
                tmpStudent.schedule = schedule;
                setStudentDetail(tmpStudent);
            }
        })
    }, [loading]);

    const handleChange = event => {
        setFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const getAllCourses = () => {
        getCourses().then(data => {
            if (data) {
                if (data.content) {
                    setCourses(data.content);
                }
            }
        })
    }
    const getComments = () => {
        getBookingComments(studentDetail.id).then(data => {
            console.log(data)
            if (data) {
                if (data.content) {
                    setComments(data.content);
                }
            }
        })
    }

    const getAvailability = () => {
        getBookingAvailability(studentDetail.id).then(data => {
            if (data.length > 0) {
                let tmp = data[0];
                tmp.parent = studentDetail.parent;
                tmp.schedule = studentDetail.schedule;
                tmp.studentProfile = studentDetail.studentProfile;
                setStudentDetail(tmp);
            }
        }).finally(() => setLoading(false))
    }

    const getDetailView = () => {
        getStudentDetail(params.id).then(data => {
            setStudentDetail(data)
            history.push(`/studentlist/studentDetail/${data.id}`)
        })
    }

    const handleSubmit = () => {
        if (comment === null) {
            createComment(studentDetail, content).then(data => {
                // history.push('/studentlist')
                setContent('');
                getComments();
            })
        } else {
            updateComment(comment.id, content).then(data => {
                // history.push('/studentlist')
                getComments();
            })
        }
    }

    const handleSubmitSendMessage = () => {
        if (message === null) {
            alert("Please, enter a message");
            return
        } else {
            setSubmitting(true);
            getBooking(studentDetail.id).then(result => {
                sendMessageToBooking(result.data.id, formData.message).then(result => {
                    setSubmitting(false);
                    setMessage('');
                    setFormData([]);
                })
            })
        }
    }

    const handleApproval = (c) => {
        approveComment(c).then(data => {
            // history.push('/studentlist')
            getComments();
        })
    }

    const handleComment = (comment) => {
        setComment(comment);
        setContent(comment.content)
    }

    const rejectStudent = () => {
        assignStudentToAnotherTeacher(null, studentDetail.id)
            .then(res => {
                getDetailView();
                //window.location.reload();
            })
    };

    return (
        <div>
            {studentDetail ?
                <PageHeader
                    ghost={false}
                    title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>{studentDetail.studentProfile.firstName} {studentDetail.studentProfile.lastName}</p>}
                    extra={[
                        <div style={{ display: 'flex' }}>
                            <Button key='3' type="primary"
                                style={{ display: 'flex' }}
                                onClick={(e) => { e.stopPropagation(); history.push(`/studentlist/${studentDetail.id}/update`, { student: studentDetail }) }}
                            >
                                Edit
                            </Button>
                            <Button key='4' type="primary"
                                style={{ display: studentDetail.teacherAvailability ? 'block' : 'none' }}
                                onClick={() => {
                                    rejectStudent()
                                }}
                            >
                                REJECT STUDENT
                            </Button>
                        </div>
                    ]}
                >
                    <Row gutter={24} style={{ marginBottom: '3%' }}>
                        <Card title="Student informations" hoverable={true} bordered={true} style={{ width: "48%", marginLeft: '2%' }}>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    <h4>Period</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >
                                        <Moment local format="D MMM YYYY HH:MM" withTitle>
                                            {studentDetail.schedule.startDate}
                                        </Moment>
                                    </h4>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    <h4 >Subject</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.schedule.courseId ? courses.find(c => c.id === studentDetail.schedule.courseId) ? courses.find(c => c.id === studentDetail.schedule.courseId).name : '' : ''}</h4>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    <h4>Grade</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.studentProfile.grade ? studentDetail.studentProfile.grade : 0}</h4>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    <h4 >Email</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.studentProfile.email}</h4>
                                </Col>
                            </Row><Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    <h4>Parent Email</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.studentProfile.parent ? studentDetail.studentProfile.parent.email : studentDetail.parent ? studentDetail.parent.email : ''}</h4>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    <h4 >Booking URL</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 onClick={() => window.open(studentDetail.conferenceUrl ? studentDetail.conferenceUrl.includes('http') ? studentDetail.conferenceUrl : 'http://' + studentDetail.conferenceUrl : '')}>{studentDetail.conferenceUrl}</h4>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    <h4 >Student URL</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 onClick={() => window.open(studentDetail.studentProfile.conferenceUrl.includes('http') ? studentDetail.studentProfile.conferenceUrl : 'http://' + studentDetail.studentProfile.conferenceUrl)}>{studentDetail.studentProfile.conferenceUrl}</h4>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    <h4>Phone</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.studentProfile.parent ? studentDetail.studentProfile.parent.phoneNumber : studentDetail.parent ? studentDetail.parent.phoneNumber : ''}</h4>
                                </Col>
                            </Row>

                            <Row gutter={16} style={{ display: studentDetail.effectiveStartDate ? 'flex' : 'none' }}>
                                <Col className="gutter-row" span={8}>
                                    <h4>Effective Start Date</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.effectiveStartDate ?
                                        <Moment local format="D MMM YYYY HH:MM" withTitle>
                                            {studentDetail.effectiveStartDate}
                                        </Moment> :
                                        'Undefined'}
                                    </h4>
                                </Col>
                            </Row>

                            <Row gutter={16} style={{ display: studentDetail.rejectDate ? 'flex' : 'none' }}>
                                <Col className="gutter-row" span={8}>
                                    <h4>Rejection Date</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.rejectDate ?
                                        <Moment local format="D MMM YYYY HH:MM" withTitle>
                                            {studentDetail.rejectDate}
                                        </Moment> :
                                        'Undefined'}
                                    </h4>
                                </Col>
                            </Row>

                            <Row gutter={16} style={{ display: studentDetail.teacherAssignedDate ? 'flex' : 'none' }}>
                                <Col className="gutter-row" span={8}>
                                    <h4>Teacher Assigned Date</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.teacherAssignedDate ?
                                        <Moment local format="D MMM YYYY HH:MM" withTitle>
                                            {studentDetail.teacherAssignedDate}
                                        </Moment> :
                                        'Undefined'}
                                    </h4>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="Teacher informations" hoverable={true} bordered={true} style={{ width: "48%", marginLeft: '2%' }}>
                            <Row gutter={16} style={{ display: studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? 'flex' : 'none' : 'none' }}>
                                <Col className="gutter-row" span={8}>
                                    <h4>Name</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? studentDetail.teacherAvailability.teacherProfile.firstName : '' : ''} {studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? studentDetail.teacherAvailability.teacherProfile.lastName : '' : ''}</h4>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ display: studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? 'flex' : 'none' : 'none' }}>
                                <Col className="gutter-row" span={8}>
                                    <h4>Subjects</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? studentDetail.teacherAvailability.teacherProfile.subjects ? studentDetail.teacherAvailability.teacherProfile.subjects.map(s => s.name).join(', ') : '' : '' : ''}</h4>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ display: studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? 'flex' : 'none' : 'none' }}>
                                <Col className="gutter-row" span={8}>
                                    <h4 >Grades</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? studentDetail.teacherAvailability.teacherProfile.grades ? studentDetail.teacherAvailability.teacherProfile.grades.join(', ') : '' : '' : ''}</h4>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ display: studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? 'flex' : 'none' : 'none' }}>
                                <Col className="gutter-row" span={8}>
                                    <h4>ConferenceUrl</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 onClick={() => studentDetail.teacherAvailability ?
                                        studentDetail.teacherAvailability.teacherProfile ?
                                            window.open(studentDetail.teacherAvailability.teacherProfile.conferenceUrl.includes('http') ? studentDetail.teacherAvailability.teacherProfile.conferenceUrl : 'http://' + studentDetail.teacherAvailability.teacherProfile.conferenceUrl) : null : null}>{studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? studentDetail.teacherAvailability.teacherProfile.conferenceUrl : '' : ''}</h4>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ display: studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? 'flex' : 'none' : 'none' }}>
                                <Col className="gutter-row" span={8}>
                                    <h4 >Email</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? studentDetail.teacherAvailability.teacherProfile.email : '' : ''}</h4>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ display: studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? 'flex' : 'none' : 'none' }}>
                                <Col className="gutter-row" span={8}>
                                    <h4>Phone</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.teacherAvailability ? studentDetail.teacherAvailability.teacherProfile ? studentDetail.teacherAvailability.teacherProfile.phoneNumber : '' : ''}</h4>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ display: studentDetail.teacherAvailability ? 'flex' : 'none' }}>
                                <Col className="gutter-row" span={8}>
                                    <h4 >Comment</h4>
                                </Col>
                                <Col className="gutter-row" span={14}>
                                    <h4 >{studentDetail.teacherAvailability ? studentDetail.teacherAvailability.studentCount : ''}</h4>
                                </Col>
                            </Row>
                        </Card>
                    </Row>

                    {/* <Row gutter={24} style={{ marginBottom: '3%' }}>
                        <Card title="Send a message" hoverable={true} bordered={true} style={{ width: "100%", marginLeft: '2%' }}>
                            <Row gutter={16}>
                                <Form.Item label="Message" required style={{ flex: 1, marginRight: '10px' }}>
                                    <Input type="text" name="message" onChange={handleChange} />
                                </Form.Item>

                                <Form.Item>
                                    <Button disabled={submitting} type="primary" size="medium" htmlType="submit" onClick={() => handleSubmitSendMessage()}>
                                        {
                                            submitting ? 'Loading...' : 'SEND'
                                        }
                                    </Button>
                                </Form.Item>
                            </Row>
                        </Card>
                    </Row> */}

                    <Row gutter={24} style={{ marginBottom: '3%' }}>
                        <Card title="Feedback section" hoverable={true} bordered={true} style={{ width: "100%", marginLeft: '2%' }}>
                            <Row gutter={16}>
                                <Form.Item label={comment ? "Message (press escape to create)" : "Message"} required style={{ flex: 1, marginRight: '10px' }}>
                                    <Input.TextArea rows={4} type="text" name="content" value={content} onChange={(e) => setContent(e.target.value)} onKeyUp={(e) => {
                                        if (e.key === 'Escape') {
                                            setComment(null);
                                            setContent('')
                                        }
                                    }} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" size="medium" htmlType="submit" onClick={() => handleSubmit()}>
                                        {comment ? 'Update comment' : 'Add comment'}
                                    </Button>
                                </Form.Item>
                            </Row>
                            {comments ?
                                comments.map(c => (
                                    <>
                                        <Row gutter={16} style={{ height: 50 }}>
                                            <Col className="gutter-row" style={{ width: '90%' }} onClick={() => handleComment(c)}>
                                                <h4>{c.content ? c.content : 'No message found in this feedback'}</h4>
                                            </Col>
                                            <Col className="gutter-row" style={{ width: '10%' }} onClick={() => handleApproval(c)}>
                                                <CheckOutlined style={{ fontSize: '20px', marginRight: '20px', color: c.approver ? 'green' : 'gray' }} onClick={() => handleApproval(c)} />
                                            </Col>
                                        </Row>
                                    </>
                                ))
                                : null}

                        </Card>
                    </Row>
                </PageHeader> : null}
        </div>
    )
}

export default StudentDetail
