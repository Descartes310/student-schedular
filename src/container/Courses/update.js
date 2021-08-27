import 'antd/dist/antd.css';
import React, { useState, useEffect } from 'react';
import { updateSubject } from '../../services/Course';
import { PageHeader, Form, Input, Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';

const UpdateSubject = () => {

    const history = useHistory();
    const location = useLocation();

    const [form] = Form.useForm();
    const [name, setName] = useState('');
    const [language, setLanguage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [subject, setSubject] = useState(location.state.subject);

    useEffect(() => {
        setName(subject.name);
        setLanguage(subject.language);
    }, [subject])

    const handleSubmit = () => {
        if (name && language) {
            if (name.toString().length <= 0 || language.toString().length <= 0) {
                alert("Please, fill the name and language!");
                return
            }
        } else {
            alert("Please, fill the form!");
            return
        }
        setSubmitting(true)

        let data = {
            name: name,
            language: language
        }
        
        updateSubject(subject.id, data).then(result => {
            history.push(`/subjects`)
        }).finally(() => setSubmitting(false));

    }

    return (
        <div>
            <PageHeader
                ghost={false}
                title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Update Subject</p>}
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
                        <Form.Item label="Name" required style={{ flex: 1, marginRight: '40px' }}>
                            <Input type="text" name="name" value={name} onChange={e => setName(e.target.value)}/>
                        </Form.Item>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Language" style={{ flex: 1, marginRight: '40px' }}>
                            <Input type="language" name="language" value={language} onChange={e => setLanguage(e.target.value)}/>
                        </Form.Item>
                    </div>
                    <Form.Item style={{ flex: 1, marginRight: '40px', marginTop: '20px' }}>
                        <Button disabled={submitting} type="primary" size="large" htmlType="submit">
                            {
                                submitting ? 'Loading...' : 'Create a subject'
                            }
                        </Button>
                    </Form.Item>
                </Form>
            </PageHeader>
        </div >
    )
}
export default UpdateSubject;
