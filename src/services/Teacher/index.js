import axios from 'axios'
import * as routes from '../routes';

export const getTeacherList = (page, size, sortName, sortType) => {
    return axios.get(`${routes.AVAILABILITY}?page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`, {
        headers: {
            // AccessControlAllowOrigin: "*",
            AccessControlAllowHeaders: "Content-Type",
            AccessControlAllowMethods: "GET, POST, OPTIONS, DELETE, PATCH",
            AccessControlAllowCredentials: "true"
        },
    })
        .then(res => {
            return res.data;
        })
}

export const markAsSupervisor = (id, value) => {

    let tenant = JSON.parse(localStorage.getItem("tenant" + JSON.parse(localStorage.getItem("user")).id));

    let data = {
        roles: [
            "supervisor"
        ],
        tenant: {
            key: tenant
        }
    }

    if (value)
        return axios.post(`${routes.TEACHER}/${id}/roles`, data)
            .then(res => {
                return res.data;
            })
    else
        return axios.delete(`${routes.TEACHER}/${id}/tenant/${tenant}/role/supervisor`)
            .then(res => {
                return res.data;
            })
}

export const markAsAdmin = (id, value) => {

    let tenant = JSON.parse(localStorage.getItem("tenant" + JSON.parse(localStorage.getItem("user")).id));

    let data = {
        roles: [
            "admin"
        ],
        tenant: {
            key: tenant
        }
    }

    if (value)
        return axios.post(`${routes.TEACHER}/${id}/roles`, data)
            .then(res => {
                return res.data;
            })
    else
        return axios.delete(`${routes.TEACHER}/${id}/tenant/${tenant}/role/admin`)
            .then(res => {
                return res.data;
            })
}

export const markAsApproved = (id, value) => {

    let tenant = JSON.parse(localStorage.getItem("tenant" + JSON.parse(localStorage.getItem("user")).id));

    let data = {
        tenants: [
            {
                tenant: {
                    key: tenant
                }
            }
        ]
    }

    if (value)
        return axios.post(`${routes.TEACHER}/${id}/approval`, data)
            .then(res => {
                return res.data;
            })
    else
        return axios.delete(`${routes.TEACHER}/${id}/approval`, data)
            .then(res => {
                return res.data;
            })
}

export const newTenant = (value) => {

    let data = {
        "key": value
    }

    let id = JSON.parse(localStorage.getItem("id"));

    return axios.post(`${routes.TEACHER}/${id}/tenant`, data)
        .then(res => {
            return res.data;
        })
}

export const deleteTenant = (value) => {

    let data = {
        "key": value
    }

    let id = JSON.parse(localStorage.getItem("id"));

    return axios.delete(`${routes.TEACHER}/${id}/tenant`, data)
        .then(res => {
            return res.data;
        })
}

export const getTenants = (start, end, page, size, sortName, sortType) => {
    return axios.get(`${routes.SERVER_ADDRESS}/search/tenant-profiles?startDate=${start}&endDate=${end}&page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
}

export const getCourses = (page = 0, size = 1000, sortName = "subject", sortType = "asc") => {
    return axios.get(`${routes.COURSE}?page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
}

export const getCoursesByGrade = (grade) => {
    let page = 0;
    let size = 1000;
    let sortType = "asc";
    let sortName = "subject";
    return axios.get(`${routes.COURSE}?gradeMin=${grade}&gradeMax=${grade}&page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
}

export const getSubjects = (page = 0, size = 1000, sortName = "name", sortType = "asc", subject = '') => {
    return axios.get(`${routes.SUBJECT}?page=${page}&size=${size}&subject=${subject}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
}

export const getSubjectById = (id) => {
    return axios.get(`${routes.SUBJECT}/${id}`)
        .then(res => {
            return res.data;
        })
}

export const getTenantByName = (displayName, page, size) => {
    return axios.get(`${routes.SERVER_ADDRESS}/search/tenant-profiles?displayName=${displayName}&size=${size}&page=${page}`)
        .then(res => {
            return res.data;
        })
}

export const getTeacherListByDate = (start, end, page, size, sortName = 'firstName', sortType = 'asc') => {
    if (start === null || end === null) {
        let today = new Date();
        today.setDate(today.getDate() - 1)
        let day = today.getDate() < 10 ? '0' + (today.getDate()) : (today.getDate())
        let month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        let year = today.getFullYear();
        let hours = today.getHours().toString().padStart(2, '0');
        let minutes = today.getMinutes().toString().padStart(2, '0');

        if (localStorage.getItem('startDate') === null || localStorage.getItem('toStart') === null) {
            localStorage.setItem('startDate', year + '-' + month + '-' + day)
            localStorage.setItem('toStart', month + '%2F' + day + '%2F' + year + '%20' + hours + ':' + minutes + ':00 -0500')
            start = month + '%2F' + day + '%2F' + year + '%20' + hours + ':' + minutes + ':00 -0500';
        }

        if (localStorage.getItem('startTime') === null) {
            localStorage.setItem('startTime', today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0'));
        }

        today = new Date();
        today.setDate(today.getDate() + 1);
        day = today.getDate() < 10 ? '0' + (today.getDate()) : (today.getDate())
        month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        year = today.getFullYear();
        hours = today.getHours().toString().padStart(2, '0');
        minutes = today.getMinutes().toString().padStart(2, '0');

        if (localStorage.getItem('endDate') === null || localStorage.getItem('toEnd') === null) {
            localStorage.setItem('endDate', year + '-' + month + '-' + day)
            localStorage.setItem('toEnd', month + '%2F' + day + '%2F' + year + '%20' + hours + ':' + minutes + ':00 -0500')
            end = month + '%2F' + day + '%2F' + year + '%20' + hours + ':' + minutes + ':00 -0500';

        }

        if (localStorage.getItem('endTime') === null) {
            localStorage.setItem('endTime', today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0'));
        }

    }
    return axios.get(`${routes.AVAILABILITY}?startDate=${start}&endDate=${end}&page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PATCH",
            "Access-Control-Allow-Credentials": "true"
        },
    })
        .then(res => {
            let result = res.data.content.map((ta, __) => {
                ta["teacherProfile"] = null;
                ta["schedule"] = null;

                getTeacherProfileById(ta.teacherProfileId).then(teacherProfile => {
                    ta.teacherProfile = teacherProfile;
                }).catch(err => console.log(err));
                getScheduleById(ta.scheduleId).then(schedule => {
                    ta.schedule = schedule;
                }).catch(err => console.log(err));
                return ta;
            });
            res.data.content = result;
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const deleteTeacherAvailabilities = (teacherIds) => {
    return axios.get(`${routes.AVAILABILITY}/disable/${teacherIds}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}


export const markTeacherAsPresent = (teacherIds, value) => {
    return axios.get(`${routes.AVAILABILITY}/update/${teacherIds}?present=${value}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getTeacherProfile = (email = null) => {
    email = email == null ? JSON.parse(localStorage.getItem("email")) : email;
    return axios.get(`${routes.TEACHER}/email/${email}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getTeacherProfileById = (id) => {
    return axios.get(`${routes.TEACHER}/${id}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const findTeacherListByFirstNameAndLastName = (firstName, start, end, page, size, tag, sortName, sortType) => {
    return axios.get(`${routes.AVAILABILITY}?firstName=${firstName}&startDate=${start}&endDate=${end}&page=${page}&size=${size}&tag=${tag}&sort=${sortName},${sortType ? sortType : 'asc'}`, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PATCH",
            "Access-Control-Allow-Credentials": "true"
        },
    })
        .then(res => {
            return res.data;
        })
}

export const googleSignIn = (id_token) => {
    const body = new FormData();
    body.append('token', id_token);
    body.append('provider', 'google');

    let data = { "token": id_token, "provider": 'google' }

    return axios.post(`${routes.SERVER_ADDRESS}/oauth/verify`, data).then(res => {
        localStorage.setItem('token', JSON.stringify(res.data));
        var date = new Date(); // Now
        date.setDate(date.getDate() + 30); // Set now + 30 days as the new date
        localStorage.setItem('expireAt', date);
        return res;
    })
}

export const googleSignUp = (user) => {
    const body = new FormData();
    body.append('email', user.email);
    body.append('family_name', user.familyName);
    body.append('given_name', user.givenName);
    body.append('avatar', user.imageUrl);
    body.append('name', user.name);
    body.append('google_id', user.googleId);
    body.append('password', '1234');

    return axios.post(`${routes.SERVER_ADDRESS}/auth/google/signup`, body).then(res => {
        console.log(res)
        return res;
    })
}

export const createSchedule = (data) => {
    return axios.post(`${routes.SCHEDULE}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const updateSchedule = (id, data) => {
    return axios.patch(`${routes.SCHEDULE}/${id}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const getScheduleById = (id) => {
    return axios.get(`${routes.SCHEDULE}/${id}`).then(res => {
        return res.data;
    }).catch(err => console.log(err));
}

export const createStudent = (firstName, lastName, email, schoolName, schoolBoard, grade, studentParentId) => {
    let data = {
        firstName,
        lastName,
        email,
        schoolName,
        schoolBoard,
        grade,
        studentParentId
    }
    return axios.post(`${routes.STUDENT}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const updateStudent = (id, firstName, lastName, email, schoolName, schoolBoard, grade, studentParentId, tags) => {
    let data = {
        firstName,
        lastName,
        email,
        schoolName,
        schoolBoard,
        grade,
        studentParentId,
        tags: tags
    }
    return axios.patch(`${routes.STUDENT}/${id}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const updateTenant = (key, displayName, conferenceUrlPrefix, maxTeacherPerSupervisor, supportUrl, videoServerUrl, staticWelcomeUrl, primaryContact) => {
    let data = {
        conferenceUrlPrefix,
        displayName,
        key,
        staticWelcomeUrl,
        videoServerUrl,
        maxTeacherPerSupervisor,
        primaryContact,
        supportUrl
    }
    return axios.patch(`${routes.SERVER_ADDRESS}/tenant-profile/${key}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const createTeacher = (firstName, lastName, iemail, schoolName, schoolBoard, grades, subjects, phone) => {
    let data = {
        firstName,
        lastName,
        email: iemail,
        schoolName,
        schoolBoard,
        grades: grades,
        phoneNumber: phone,
        subjects: subjects
        //tags: tags
    }
    return axios.post(`${routes.TEACHER}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

//TODO: replace the commenter id by connected user
export const createComment = (studentBooking, content) => {
    let data = {
        content,
        studentBooking,
        studentParent: studentBooking.parent,
        studentProfile: studentBooking.studentProfile,
        commenter: { id: '8a0081ed7b1d0a57017b1e706ed8003b' }
    }
    return axios.post(`${routes.COMMENT}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const getBookingComments = (bookinId) => {
    return axios.get(`${routes.COMMENT}?bookingId=${bookinId}`).then(res => {
        return res.data;
    }).catch(err => console.log(err));
}

export const updateComment = (id, content) => {
    let data = {
        content
    }
    return axios.patch(`${routes.SERVER_ADDRESS}/teacher-comment/${id}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

//TODO: replace the commenter id by connected user
export const approveComment = (c) => {
    let data = {
        ...c,
        approver: { id: '8a0081ed7b1d0a57017b1e706ed8003b' }
    }
    if (c.approver) {
        return axios.delete(`${routes.COMMENT}/${c.id}/approval`).then(res => {
            return res;
        }).catch(err => console.log(err));
    } else {
        return axios.post(`${routes.COMMENT}/${c.id}/approval/${'8a0081ed7b1d0a57017b1e706ed8003b'}`, data).then(res => {
            return res;
        }).catch(err => console.log(err));
    }
}



export const updateTeacher = (id, firstName, lastName, email, grades, subjects, phone, schoolName, schoolBoard, tags) => {
    let data = {
        firstName,
        lastName,
        schoolName,
        schoolBoard,
        externalEmail: email,
        grades: grades,
        phoneNumber: phone,
        subjects: subjects,
        tags: tags
    }
    return axios.patch(`${routes.TEACHER}/${id}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const createBooking = (studentProfile, schedule, studentComment) => {
    let data = {
        studentProfile,
        schedule,
        studentComment
    }
    return axios.post(`${routes.BOOKING}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const updateBooking = (id, schedule) => {
    let data = {
        id,
        schedule
    }
    return axios.patch(`${routes.BOOKING}/${id}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}


export const createAvailibility = (teacherProfile, schedule) => {
    let data = {
        teacherProfile: teacherProfile,
        schedule: schedule
    }
    return axios.post(`${routes.AVAILABILITY}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const updateAvailibility = (id, teacherProfile, schedule) => {
    let data = {
        teacherProfile,
        schedule
    }
    return axios.patch(`${routes.AVAILABILITY}/${id}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const createParent = (firstName, lastName, phoneNumber, countryCode, email) => {
    let data = {
        phoneNumber,
        countryCode,
        firstName,
        lastName,
        email
    }
    return axios.post(`${routes.PARENT}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const updateParent = (id, firstName, lastName, phoneNumber, countryCode, email) => {
    let data = {
        phoneNumber,
        countryCode,
        firstName,
        lastName,
        email,
    }
    return axios.patch(`${routes.PARENT}/${id}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const createMessage = (type, content, recipients) => {
    let data = {
        content,
        recipients,
        sender: { id: '8a0081ed7b1d0a57017b1e706ed8003b'}
    }
    return axios.post(`${routes.MESSAGE}/${type}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const sendTeachersMessage = (message_id) => {
    return axios.post(`${routes.SERVER_ADDRESS}/message​/${message_id}/teachers`).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const sendMessageAvailability = (message_id) => {
    return axios.post(`${routes.SERVER_ADDRESS}/message/${message_id}/availabilities`).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const updateAvailabilityAssistants = (availability_id, assistant_id) => {
    return axios.post(`${routes.AVAILABILITY}/${availability_id}/assistant/${assistant_id}`, {}).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const removeAvailabilityAssistants = (availability_id, assistant_id) => {
    return axios.delete(`${routes.AVAILABILITY}/${availability_id}/assistant/${assistant_id}`).then(res => {
        return res;
    }).catch(err => console.log(err));
}