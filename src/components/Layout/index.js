import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css';
import '../../Assets/Layout.css'
import { useHistory } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CalendarOutlined,
  BookOutlined,
  TagsOutlined,
  FileOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const rootSubmenuKeys = ['teachers', 'students'];

function LayoutOfApp({ children }, props) {

  const history = useHistory();
  const [pathName, setPathName] = useState(window.location.pathname);
  const [logged, setLogged] = useState(true);
  const [key, setKey] = useState('1');
  const [openKeys, setOpenKeys] = React.useState(['teachers']);

  useEffect(() => {

    try {
      if (!logged) {
        document.body.classList.remove("img-bg");
        document.body.classList.remove("min-height-full");
        document.body.style.backgroundImage = null;
      }

      document.getElementById('root').style.height = '100%';

      if (JSON.parse(localStorage.getItem('user'))) {
        // let user = JSON.parse(localStorage.getItem('user'));
        // let tenant = localStorage.getItem('tenant' + user.id);
        // if (!tenant) {
        //   history.push('/settings');
        // }

        // if (!user.phoneNumber || !user.grades || !user.firstName || !user.lastName) {
        //   history.push('/settings');
        // }
        setLogged(true);
      } else {
        console.log(window.location.pathname)
        setLogged(false);
        if (window.location.pathname.includes('login/code'))
          history.push(window.location.pathname);
        else
          history.push('/login');
      }
    } catch (error) {
      //console.log(error)
      setLogged(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.reload();
    }

    let today = new Date();
    today.setDate(today.getDate() - 1)
    let day = today.getDate() < 10 ? '0' + (today.getDate()) : (today.getDate())
    let month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    let year = today.getFullYear();
    if (localStorage.getItem('startDate') == null || localStorage.getItem('toStart') == null) {
      localStorage.setItem('startDate', year + '-' + month + '-' + day)
      localStorage.setItem('toStart', month + '%2F' + day + '%2F' + year + '%20' + today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0') + ':00 -0500')
    }

    if (localStorage.getItem('startTime') == null) {
      localStorage.setItem('startTime', today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0'));
    }

    today = new Date();
    today.setDate(today.getDate() + 1);
    day = today.getDate() < 10 ? '0' + (today.getDate()) : (today.getDate())
    month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    year = today.getFullYear();

    if (localStorage.getItem('endDate') == null || localStorage.getItem('toEnd') == null) {
      localStorage.setItem('endDate', year + '-' + month + '-' + day)
      localStorage.setItem('toEnd', month + '%2F' + day + '%2F' + year + '%20' + today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0') + ':00 -0500')

    }

    if (localStorage.getItem('endTime') == null) {
      localStorage.setItem('endTime', today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0'));
    }

    // let expireAt = new Date(localStorage.getItem("expireAt"));

    // if (localStorage.getItem("expireAt") == null) {
    //   setLogged(false);
    //   history.push('/login');
    // } else
    //   if (localStorage.getItem("expireAt").length > 0)
    //     if (today.getTime() <= expireAt.getTime()) {
    //       setLogged(true);
    //       if (window.location.pathname == '/login')
    //         history.push('/teacherlist');
    //     } else {
    //       setLogged(false);
    //       history.push('/login');
    //     }
    //   else {
    //     setLogged(false);
    //     history.push('/login');
    //   }
    setPathName(window.location.pathname);
  }, [window.location.pathname, pathName])

  const logout = () => {
    setLogged(false);
    localStorage.removeItem("token");
    localStorage.removeItem("expireAt");
    localStorage.removeItem("user");
    //console.log('Logout')
    window.location.reload();
  }

  const handleClick = e => {
    setPathName(e.key);
    setKey(e.key);
  };

  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Layout>
      {
        logged ?
          <Sider className="sider">
            <h1>Appui Scolaire</h1>
            <Menu theme="dark" onClick={handleClick} selectedKeys={[key]} openKeys={openKeys} onOpenChange={onOpenChange} mode="inline">
              <SubMenu key="teachers" icon={<BookOutlined />} title="Teachers">
                <Menu.Item key="1" onClick={() => { history.push('/teacherlist') }}>Availabilities</Menu.Item>
                <Menu.Item key="2" onClick={() => { history.push('/teacherprofiles') }}>Profiles</Menu.Item>
                <Menu.Item key="3" onClick={() => { history.push('/short-messages/teacher') }}>Messages</Menu.Item>
              </SubMenu>
              <SubMenu key="students" icon={<UserOutlined />} title="Students">
                <Menu.Item key="5" onClick={() => { history.push('/studentlist') }}>Bookings</Menu.Item>
                <Menu.Item key="4" onClick={() => { history.push('/studentprofiles') }}>Profiles</Menu.Item>
                <Menu.Item key="6" onClick={() => { history.push('/short-messages/parent') }}>Messages</Menu.Item>
                <Menu.Item key="7" onClick={() => { history.push('/parentProfiles') }}>Parents</Menu.Item>
              </SubMenu>
              <Menu.Item key="schedules" icon={<CalendarOutlined />} onClick={() => { history.push('/schedules') }}>
                Schedules
              </Menu.Item>
              <Menu.Item key="tags" icon={<TagsOutlined />} onClick={() => { history.push('/tagList') }}>
                Tags
              </Menu.Item>
              <Menu.Item key="subjects" icon={<FileOutlined />} onClick={() => { history.push('/subjects') }}>
                Subjects
              </Menu.Item>
              <Menu.Item key="courses" icon={<DatabaseOutlined />} onClick={() => { history.push('/courses') }}>
                Courses
              </Menu.Item>
            </Menu>
          </Sider> : null
      }
      <Layout className="childLayout" style={{ marginLeft: !logged ? 0 : '200px' }}>
        <Content className="content">
          {
            logged ?
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                padding: '15px',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
                <SettingOutlined style={{ fontSize: '30px', marginRight: '20px' }} onClick={() => { history.push('/settings') }} />
                {/* <SafetyOutlined style={{ fontSize: '30px', marginRight: '20px' }} onClick={() => { history.push('/tenant') }} /> */}
                <LogoutOutlined style={{ fontSize: '30px' }} onClick={() => { logout(); }} />
              </div> : null}
          <div className="content-div" style={{ padding: 0 }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default LayoutOfApp
