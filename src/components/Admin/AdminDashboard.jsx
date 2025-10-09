import React, { useEffect } from 'react'
import { getRoleCount } from '../../services/AdminServices/RoleService';
import { toast } from 'react-toastify';
import { getCourseCount } from '../../services/AdminServices/DeptService';
import { getTeacherCount } from '../../services/AdminServices/TeacherService';
import { getNoticeCount } from '../../services/AdminServices/NoticeService';

const AdminDashboard = () => {
    const [roleCount, setRoleCount] = React.useState(0);
    const [deptCount, setDeptCount] = React.useState(0);
    const [teacherCount, setTeacherCount] = React.useState(0);
    const [noticeCount, setNoticeCount] = React.useState(0);
    useEffect(() => {

        document.title = "Admin"

        getRoleCount().then((data) => {
            setRoleCount(data);
        }).catch((error) => {
            console.log(error);
            toast.error("Error in loading count of roles");
        });

        getCourseCount().then((data) => {
            setDeptCount(data);
        }).catch((error) => {
            console.log(error);
            toast.error("Error in loading count of departments");
        });

        getTeacherCount().then((data) => {
            setTeacherCount(data);
        }).catch((error) => {
            console.log(error);
            toast.error("Error in loading count of teachers");
        });

        getNoticeCount().then((data) => {
            setNoticeCount(data);
        }).catch((error) => {
            console.log(error);
            toast.error("Error in loading count of notices");
        });



    }, []);


    return (
        <div>
            <div className='container'>
                <section>
                    <div className="row mt-5">
                        <div className="col-xl-3 col-sm-6 col-12 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between px-md-1">
                                        <div>
                                            <h3 className="text-danger">{roleCount}</h3>
                                            <p className="mb-0">User Types</p>
                                        </div>
                                        <div className="align-self-center">
                                            <i className="bi bi-person-circle text-danger fs-1"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6 col-12 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between px-md-1">
                                        <div>
                                            <h3 className="text-success">{deptCount}</h3>
                                            <p className="mb-0">Departments</p>
                                        </div>
                                        <div className="align-self-center">
                                            <i className="bi bi-buildings-fill fs-1"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6 col-12 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between px-md-1">
                                        <div>
                                            <h3 className="text-warning">{teacherCount}</h3>
                                            <p className="mb-0">Teachers</p>
                                        </div>
                                        <div className="align-self-center">
                                            <i className="bi bi-person-vcard text-warning fs-1"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6 col-12 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between px-md-1">
                                        <div>
                                            <h3 className="text-info">{noticeCount}</h3>
                                            <p className="mb-0">Notices</p>
                                        </div>
                                        <div className="align-self-center">
                                            <i className="bi bi-pencil-fill text-info fs-1"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </div>
        </div>
    )
}

export default AdminDashboard