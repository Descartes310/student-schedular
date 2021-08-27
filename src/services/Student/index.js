import axios from 'axios';
import * as routes from '../routes';

export const getStudentListById = (TeacherId, type = 'availabilityId') => {
    // return axios.get(`${routes.SERVER_ADDRESS}/teacher-availability/${TeacherId}/student-bookings`)
    return axios.get(`${routes.BOOKING}?${type}=${TeacherId}`)
        .then(res => {
            console.log(res.data);
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getStudentList = (page, size, sortName, sortType) => {

    return axios.get(`${routes.BOOKING}?page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getStudentListByDate = (start, end, page, size, sortName, sortType) => {
    return axios.get(`${routes.BOOKING}?startDate=${start}&endDate=${end}&page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getParentProfile = (page, size, sortName, sortType) => {
    return axios.get(`${routes.PARENT}?page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getParentById = (id) => {
    return axios.get(`${routes.PARENT}/${id}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

// export const getTenant = (key) => {
//     return axios.get(`tenant-profile/${key}`)
//         .then(res => {
//             return res.data;
//         })
//         .catch(err => {
//         })
// }

export const getScheduleByDate = (gradeMin, gradeMax, start, end, page, size, sortName, sortType) => {
    return axios.get(`${routes.SCHEDULE}?gradeMin=${gradeMin}&gradeMax=${gradeMax}&startDate=${start}&endDate=${end}&page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getSchedules = (page, size, sortName, sortType) => {
    return axios.get(`${routes.SCHEDULE}?page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getSchedule = (min = 0, max = 100) => {
    let page = 0;
    let size = 10000;
    let filter = 'startDate';
    let sort = 'asc';
    max = max === -1 ? min : max;
    // let tenant = JSON.parse(localStorage.getItem("tenant"+JSON.parse(localStorage.getItem("user")).id));
    return axios.get(`${routes.SCHEDULE}?gradeMin=${min}&gradeMax=${max}&page=${page}&size=${size}&sort=${filter},${sort}`)
        .then(res => {
            return res.data;
        })
}


export const getCountry = () => {
    return axios.get(`http://ip-api.com/json`)
        .then(res => {
            return res.data;
        })
}

export const getStudentProfileByDate = (start, end, page, size, sortName, sortType) => {
    return axios.get(`${routes.STUDENT}?startDate=${start}&endDate=${end}&page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getTeacherProfileByDate = (start, end, page, size, sortName, sortType) => {
    return axios.get(`${routes.TEACHER}?startDate=${start}&endDate=${end}page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getTeacherProfiles = (page, size, sortName, sortType) => {
    return axios.get(`${routes.TEACHER}?page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getStudentDetail = (studentId) => {
    return axios.get(`${routes.BOOKING}/${studentId}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getBookings = (studentId) => {
    return axios.get(`${routes.BOOKING}/${studentId}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const findStudentListByFirstNameAndLastName = (firstName, start, end, page, size, tag, sortName, sortType) => {
    return axios.get(`${routes.BOOKING}?firstName=${firstName}&startDate=${start}&endDate=${end}&page=${page}&size=${size}&tag=${tag}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const findParentProfileByEmail = (email, page, size, sortName, sortType) => {
    return axios.get(`${routes.PARENT}?email=${email}&page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const findScheduleByGrade = (gradeMin, gradeMax, start, end, page, size, sortName, sortType) => {
    return axios.get(`${routes.SCHEDULE}?gradeMin=${gradeMin}&gradeMax=${gradeMax}&startDate=${start}&endDate=${end}&page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const findStudentProfileByFirstNameAndLastName = (firstName, start, end, page, size, tag, sortName, sortType) => {
    return axios.get(`${routes.STUDENT}?firstName=${firstName}&startDate=${start}&endDate=${end}&page=${page}&size=${size}&tag=${tag}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const findTeacherProfileByFirstNameAndLastName = (firstName, start, end, page, size, tag, sortName, sortType) => {
    //return axios.get(`students_bookings/search/findByStudentProfileFirstNameIgnoreCaseContainingOrStudentProfileLastNameIgnoreCaseContaining?firstName=${firstName}&lastName=${lastName}&sort=${sortName},${sortType}`)
    return axios.get(`${routes.TEACHER}?firstName=${firstName}&startDate=${start}&endDate=${end}&page=${page}&size=${size}&tag=${tag}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getShortMessages = (type, term, page, size, sortName, sortType) => {
    //return axios.get(`${routes.SERVER_ADDRESS}/students_bookings/search/findByStudentProfileFirstNameIgnoreCaseContainingOrStudentProfileLastNameIgnoreCaseContaining?firstName=${firstName}&lastName=${lastName}&sort=${sortName},${sortType}`)
    return axios.get(`${routes.MESSAGE}/${type}?term=${term}&page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getChild = (id) => {
    return axios.get(`${routes.SERVER_ADDRESS}/${routes.STUDENT}?parentId=${id}`)
        .then(res => {
            return res.data;
        })
}

export const getShortMessagesTemplates = (type, page, size) => {
    //return axios.get(`${routes.SERVER_ADDRESS}/students_bookings/search/findByStudentProfileFirstNameIgnoreCaseContainingOrStudentProfileLastNameIgnoreCaseContaining?firstName=${firstName}&lastName=${lastName}&sort=${sortName},${sortType}`)
    return axios.get(`${routes.SERVER_ADDRESS}/${type}?page=${page}&size=${size}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const assignStudentlistToTeacher = (teacherId, studentIds) => {
    return axios.get(`${routes.SERVER_ADDRESS}/${routes.SCHEDULE}/${teacherId}/${studentIds}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const deleteStudentBooking = (studentIds) => {
    return axios.get(`${routes.SERVER_ADDRESS}/${routes.BOOKING}/disable/${studentIds}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getBookingAvailability = (bookingId) => {
    return axios.get(`${routes.AVAILABILITY}/booking?id=${bookingId}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const assignStudentToAnotherTeacher = (teacherId, studentId) => {
    // console.log(`${routes.SERVER_ADDRESS}/meet/assign/${studentIds}/${teacherId}`);
    let data = {
        teacherId,
        studentId
    }

    return axios.post(`${routes.AVAILABILITY}/${teacherId}/booking/${studentId}`, data)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const assignMeetingToAnotherTeacher = (teacherId, url) => {
    let data = {
        "teacherProfile": {
            "conferenceUrl": url
        }
    }
    return axios.patch(`${routes.SERVER_ADDRESS}/${routes.AVAILABILITY}/${teacherId}`, data)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const bridgeManagement = (status) => {
    return axios.get(`${routes.SERVER_ADDRESS}/bridge?open=${status}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const persistManagement = (status) => {
    return axios.get(`${routes.SERVER_ADDRESS}/meet/bridge?persist=${status}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const bridgeStatus = () => {
    return axios.get(`${routes.SERVER_ADDRESS}/meet/bridge/status`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const editSubject = (id, subject) => {
    return axios.get(`${routes.SERVER_ADDRESS}/${routes.BOOKING}/update/${id}?subject=${subject}`)
        .then(res => {
            return res;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const getBooking = (id) => {
    return axios.get(`${routes.SERVER_ADDRESS}/${routes.BOOKING}/${id}`)
        .then(res => {
            return res;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const editSubjectGrade = (id, subjects, grades) => {
    return axios.get(`${routes.SERVER_ADDRESS}/${routes.AVAILABILITY}/update/${id}?subjects=${subjects}&grades=${grades}`)
        .then(res => {
            return res;
        })
        .catch(err => {
            //alert(err.message);
        })
}

export const deleteSchedule = (ids) => {
    let data = ids.split(',');
    let url = '';
    data.forEach((d, i) => {
        if(i === data.length-1)
            url += 'id='+d
        else 
            url += 'id='+d+'&'
    })
    return axios.delete(`${routes.SERVER_ADDRESS}/${routes.SCHEDULE}?${url}`).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const deleteStudentProfiles = (ids) => {
    let data = ids.split(',');
    let url = '';
    data.forEach((d, i) => {
        if(i === data.length-1)
            url += 'id='+d
        else 
            url += 'id='+d+'&'
    })
    return axios.delete(`${routes.SERVER_ADDRESS}/${routes.SCHEDULE}?${url}`).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const deleteTeacherProfile = (ids) => {
    let data = ids.split(',');
    let url = '';
    data.forEach((d, i) => {
        if(i === data.length-1)
            url += 'id='+d
        else 
            url += 'id='+d+'&'
    })
    return axios.delete(`${routes.SERVER_ADDRESS}/${routes.SCHEDULE}?${url}`).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const deleteParents = (ids) => {
    let data = ids.split(',');
    let url = '';
    data.forEach((d, i) => {
        if(i === data.length-1)
            url += 'id='+d
        else 
            url += 'id='+d+'&'
    })
    return axios.delete(`${routes.SERVER_ADDRESS}/${routes.PARENT}?${url}`).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const deleteAvailabilities = (ids) => {
    let data = ids.split(',');
    let url = '';
    data.forEach((d, i) => {
        if(i === data.length-1)
            url += 'id='+d
        else 
            url += 'id='+d+'&'
    })
    return axios.delete(`${routes.SERVER_ADDRESS}/${routes.AVAILABILITY}?${url}`).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const deleteBookings = (ids) => {
    let data = ids.split(',');
    let url = '';
    data.forEach((d, i) => {
        if(i === data.length-1)
            url += 'id='+d
        else 
            url += 'id='+d+'&'
    })
    return axios.delete(`${routes.SERVER_ADDRESS}/${routes.BOOKING}?${url}`).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const sendStudentsMessage = (message_id) => {
    return axios.post(`${routes.SERVER_ADDRESS}/message​/${message_id}/students`).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const sendMessageBookings = (message_id) => {
    return axios.post(`${routes.SERVER_ADDRESS}/message/${message_id}/bookings`).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const sendMessageToBooking = (booking_id, message) => {
    var config = {
        headers: {
            'Content-Length': 0,
            'Content-Type': 'text/plain'
        },
       responseType: 'text'
    };
    return axios.post(`${routes.SERVER_ADDRESS}/message/booking/${booking_id}`, message, config).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const getTags = (page, size, sortName, sortType) => {
    return axios.get(`${routes.TAG}?page=${page}&size=${size}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
        .catch(err => console.log(err))
}
export const getTagByName = (name) => {
    return axios.get(`${routes.TAG}?name=${name}`)
        .then(res => {
            return res.data;
        })
        .catch(err => console.log(err))
}

export const addTag = (data) => {
    return axios.post(`${routes.TAG}`,data)
        .then(res => {
            return res.data;
        })
        .catch(err => console.log(err))
}

export const updateTag = (id,data) => {
    return axios.patch(`${routes.TAG}/${id}`, data)
        .then(res => {
            return res.data;
        })
        .catch(err => console.log(err))
}

export const enableTags = (data) => {
    return axios.post(`${routes.TAG}/enable`,data)
        .then(res => {
            return res.data;
        })
        .catch(err => console.log(err))
}

export const disableTags = (data) => {
    return axios.post(`${routes.TAG}/disable`,data)
        .then(res => {
            return res.data;
        })
        .catch(err => console.log(err))
}

export const getTagByDate = (page, size, sortName, sortType, name, date) => {
    return axios.get(`${routes.TAG}?page=${page}&size=${size}&sort=${sortName},${sortType}&name=${name}&createDate=${date}`)
        .then(res => {
            return res.data;
        })
        .catch(err => console.log(err))
}