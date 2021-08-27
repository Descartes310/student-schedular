import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import TextArea from 'antd/lib/input/TextArea';
import { PageHeader, Form, Button } from 'antd';
import '../../Assets/container/StudentList.css';
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { createMessage } from '../../services/Teacher';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getParentProfile, getTeacherProfiles } from '../../services/Student';

function AddMessage(props) {

    const history = useHistory();
    const [form] = Form.useForm();
    const { params } = props.match;
    const [body, setBody] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recipients, setRecipients] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [selectedRecipients, setSelectedRecipients] = useState([]);

    useEffect(() => {
        if(params.id === 'teacher') {
            getTeachers();
        } else {
            getParents();
        }
    }, []);

    const getParents = () => {
        getParentProfile(0, 50000, "createDate", 'desc').then(data => {
            if (data) {
                if (data.content) {
                    setRecipients(data.content);
                }
            }
        }).finally(() => setLoading(false));
    }

    const getTeachers = () => {
        getTeacherProfiles(0, 50000, "createDate", 'desc').then(data => {
            if (data) {
                if (data.content) {
                    setRecipients(data.content);
                }
            }
        }).finally(() => setLoading(false));
    }

    const handleSubmit = () => {
        if (body === null || selectedRecipients.length <= 0) {
            alert('Fill the form');
            return;
        }
        setSubmitting(true)
        createMessage(params.id, body, selectedRecipients).then(data => {
            history.push(`/short-messages/${params.id}`)
        }).catch(err => {
            alert("Error occured when saving data, please retry!")
        }).finally(() => setSubmitting(false))
    }

    return (

        <div>
            <PageHeader
                ghost={false}
                title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Create Message</p>}
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
                        <Form.Item label="Recipients" required style={{ flex: 1, marginRight: '10px' }}>
                            <Autocomplete
                                multiple
                                size="small"
                                loading={loading}
                                options={recipients}
                                id="asynchronous-search"
                                onChange={(__, sr) => {
                                    setSelectedRecipients(sr)
                                }}
                                getOptionLabel={(record) => record.firstName + ' ' + record.lastName}
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
                    </div>
                    <Form.Item label="Body" required>
                        <TextArea type="text" name="body" value={body} onChange={(e) => setBody(e.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={() => handleSubmit} disabled={submitting} type="primary" size="large" htmlType="submit">
                            {
                                submitting ? 'Loading...' : 'Create a Message'
                            }
                        </Button>
                    </Form.Item>
                </Form>
            </PageHeader>
        </div>
    )
}
export default AddMessage
