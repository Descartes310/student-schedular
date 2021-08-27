import axios from 'axios';
import * as routes from '../routes';

export const createSubject = (data) => {
    return axios.post(`${routes.SUBJECT}`, [data]).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const updateSubject = (id, data) => {
    return axios.patch(`${routes.SUBJECT}/${id}`, data).then(res => {
        return res;
    }).catch(err => console.log(err));
}

export const getCourses = (page = 0, size = 1000, sortName = "subject", sortType = "asc", name = '', gradeMin = 0, gradeMax = 30) => {
    return axios.get(`${routes.COURSE}?page=${page}&size=${size}&subject=${name}gradeMin=${gradeMin}&gradeMax=${gradeMax}&sort=${sortName},${sortType ? sortType : 'asc'}`)
        .then(res => {
            return res.data;
        })
}

export const createCourse = (data) => {
    return axios.post(`${routes.COURSE}`, [data]).then(res => {
        return res;
    }).catch(err => console.log(err));
}