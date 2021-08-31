import './assets/css/global.css';
import './assets/css/custom.css';
import { Form, Input, Button } from 'antd'
import vector from './assets/images/logo.png';
import background from './assets/images/bg.jpg';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { sendLoginCode, getTeacherProfileById, getLoginCode } from "../../services/Teacher";

function Login(props) {

  const history = useHistory();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittingCode, setSubmittingCode] = useState(false);
  const [phone] = useState(props.match.params.phone);

  useEffect(() => {
    document.body.classList.add("img-bg");
    document.body.classList.add("min-height-full");
    if (window.location.pathname.includes('login/code')) {
      document.body.style.backgroundImage = `url(${background})`;
      document.getElementById('root').style.height = '100%';
      document.getElementsByClassName('ant-layout')[0].style.height = '100%';
      document.getElementsByClassName('childLayout')[0].style.background = 'rgba(255, 255, 255, 0)';
      document.getElementsByClassName('ant-layout')[0].style.background = 'rgba(255, 255, 255, 0)';
      document.getElementsByClassName('ant-layout')[1].style.height = '100%';
      document.getElementsByClassName('content-div')[0].style.height = '100%';
      document.getElementsByClassName('content-div')[0].style.backgroundColor = 'rgba(255, 255, 255, 0)';
    }
  }, []);

  const sendActivationCode = () => {
    setSubmittingCode(true);
    getLoginCode(phone).finally(() => {
      setSubmittingCode(false);
    })
  }

  const sendCode = () => {
    setSubmitting(true);
    setError(false);
    sendLoginCode(phone, code).then(token => {
      findTeacher(token);
    }).catch(err => {
      console.log(err);
      history.push('/login');
      setError(true);
    })
    .finally(() => {
      setSubmitting(false)
    })
  }

  const findTeacher = (token) => {
    console.log(token)
    getTeacherProfileById(token.id).then(teacher => {
      localStorage.setItem('user', JSON.stringify(teacher));
      localStorage.setItem('accessToken', token.access_token);
      localStorage.setItem('refreshToken', token.refresh_token);
      history.push('/teacherlist');
    }).catch(err => {
      console.log(err)
      history.push('/login');
    });
  }

  return (
    <section className="wrapper" style={{ height: '100%' }}>
      <header className="header" style={{ height: '100%' }}>
        <a className="header-logo" href=""><img src={vector} alt="" /></a>
      </header>
      <article className="loginBox min-height-full" style={{ height: '100%' }}>
        <div className="loginBox__inner">
          <h1 className="loginBox__title">Appui Scolaire de la Reussite</h1>
          <div className="loginBox__btn-wrapper" style={{ height: '100%' }}>
            <Form.Item>
              <Input
                type="text"
                name="name"
                value={code}
                className="loginBox__btn"
                style={{ paddingLeft: '5%' }}
                placeholder="Enter your activation code"
                onChange={(e) => { setError(false); setCode(e.target.value) }}
              />
            </Form.Item>
            <Button
              disabled={submitting || submittingCode}
              className="loginBox__btn"
              style={{ paddingBottom: '2.5rem' }}
              onClick={() => sendActivationCode()}
            >
              <span> {!submittingCode ? 'Resend the code' : 'Sending code...'}</span>
            </Button>
            <Button
              disabled={submitting || submittingCode}
              className="loginBox__btn"
              style={{ paddingBottom: '2.5rem' }}
              onClick={() => sendCode()}
            >
              <span> {!submitting ? 'Login' : 'Logging...'}</span>
            </Button>
          </div>
        </div>
      </article>
      <footer className="footer">

        <div className="footer-copyright">
          <span>© 2013 - 2021 Aproresco</span>
          <a href="#">Terms and Services</a> |
            <a href="#">Privacy</a> |
            <a href="#">Contact Us</a>
        </div>
      </footer>
    </section>
  );
}

export default Login;