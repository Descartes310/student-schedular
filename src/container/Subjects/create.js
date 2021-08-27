import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import { createSubject } from '../../services/Course';
import React, { useState, useReducer } from 'react';
import { PageHeader, Form, Input, Button } from 'antd';

const formReducer = (state, event) => {
    return {
        ...state,
        [event.name]: event.value
    }
}

const CreateSubject = () => {

    const history = useHistory();

    const [formData, setFormData] = useReducer(formReducer, {});
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleChange = event => {
        setFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const handleSubmit = () => {
        if (formData.name && formData.language) {
            if (formData.name.toString().length <= 0 || formData.language.toString().length <= 0) {
                alert("Please, fill the name and language!");
                return
            }
        } else {
            alert("Please, fill the form!");
            return
        }
        setSubmitting(true)

        let data = {
            name: formData.name,
            language: formData.language
        }
        
        createSubject(data).then(result => {
            history.push(`/subjects`)
        }).finally(() => setSubmitting(false));

    }

    return (
        <div>
            <PageHeader
                ghost={false}
                title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Create Subject</p>}
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
                            <Input type="text" name="name" onChange={handleChange} />
                        </Form.Item>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Form.Item label="Language" style={{ flex: 1, marginRight: '40px' }}>
                            <Input type="language" name="language" onChange={handleChange} />
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
export default CreateSubject;
