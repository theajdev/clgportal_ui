import React, { useEffect, useState } from 'react'
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import { addTeacher, deleteTeacher, getAllTeachers, getTeachersByStatus, modifyTeacher } from '../../services/AdminServices/TeacherService';
import { getAllCourses } from '../../services/AdminServices/DeptService';
import { toast } from 'react-toastify';
import { checkTokenAndLogout } from '../../services/auth';

const Teachers = () => {

  const [teacher, setTeacher] = useState({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    status: "",
    deptId: "",
  });

  const [teachers, setTeachers] = useState([]);
  const [depts, setDepts] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selected, setSelected] = useState("All");
  const [isLoading, setIsLoading] = useState(false);  // State htmlFor loading

  const [validation, setValidation] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    email: false,
    username: false,
    password: false,
    status: false,
    deptId: false,
  });

  const validateFields = () => {
    const errors = {};

    // Required fields
    if (!teacher.firstName.trim()) { errors.firstName = true; }
    if (!teacher.lastName.trim()) { errors.lastName = true; }
    if (!teacher.username.trim()) { errors.username = true; }
    if (!teacher.email.trim()) {
      errors.email = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(teacher.email)) {
        errors.email = true;
        toast.error("Invalid email format");
      }
    }

    if (!teacher.password.trim()) { errors.password = true; }
    if (!teacher.status) { errors.status = true; }
    if (!teacher.deptId) { errors.deptId = true; }

    setValidation(prev => ({ ...prev, ...errors }));

    return Object.keys(errors).length === 0;
  };


  useEffect(() => {
    document.title = "Teacher - Admin";
    checkTokenAndLogout();
    setIsLoading(true);
    getAllTeachers().then((data) => {
      setTeachers(data);
      setIsLoading(false);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);

      // Delay tooltip setup until after DOM updates
      setTimeout(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          new bootstrap.Tooltip(tooltipTriggerEl);
        });
      }, 0); // ensures DOM is updated
    });


    getAllCourses().then((dept) => {
      setDepts(dept);
    }).catch((err) => {
      console.log(err);
    });


    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });

    //cleanup validation errors on modal close
    const modalElement = document.getElementById('teacherModal');

    const handleModalClose = () => {
      // Clear validation errors
      setValidation({
        firstName: false,
        middleName: false,
        lastName: false,
        email: false,
        username: false,
        password: false,
        status: false,
        deptId: false,
      });
    };

    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', handleModalClose);
    }

    // Clean up listener on unmount
    return () => {
      if (modalElement) {
        modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      }
    };
  }, []);

  //field change handler
  const fieldChanged = (event) => {
    const { name, value } = event.target;

    setTeacher({ ...teacher, [event.target.name]: event.target.value });

    setTeacher(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when the user starts typing
    setValidation(prev => ({
      ...prev,
      [name]: false
    }));
  };

  // add new teacher
  const newTeacher = () => {
    setIsUpdate(false);
    setTeacher({
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      status: "",
      deptId: "",
    });
    var myModal = new bootstrap.Modal(document.getElementById('teacherModal'), {
      backdrop: 'static',
      keyboard: false
    });
    myModal.show();
  };

  // save teacher
  const saveTeacher = (event) => {
    event.preventDefault();
    if (!validateFields()) return;
    console.log(teacher);

    addTeacher(teacher).then((res) => {
      toast.info("teacher adding please wait...", {
        position: "top-right",
        autoClose: 1200,
      });

      setTimeout(() => {
        toast.dismiss();
        setTeacher({
          id: "",
          firstName: "",
          middleName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          status: "",
          deptId: "",
        });


        toast.success("Teacher added.", { position: "top-right", autoClose: 1600 });
        const modalElement = document.getElementById('teacherModal');
        const modalInstance =
          bootstrap.Modal.getInstance(modalElement) ||
          new bootstrap.Modal(modalElement, {
            backdrop: 'non-static',
            keyboard: false
          });
        if (modalInstance) {
          modalInstance.hide();
        }
      }, 2000);

      setTimeout(() => {
        toast.dismiss();
        handleAll();
      }, 3500);
      // Append new teacher to the list
    }).catch((err) => {
      console.log(err.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  // edit teacher
  const editTeacher = (teacher) => {
    setIsUpdate(true);
    setTeacher(teacher);
    var myModal = new bootstrap.Modal(document.getElementById('teacherModal'), {
      backdrop: 'static',
      keyboard: false
    });
    myModal.show();
  };


  // update teacher
  const updateTeacher = (event) => {
    event.preventDefault();
    setIsUpdate(true);
    if (!validateFields()) return;

    modifyTeacher(teacher, teacher.id).then(response => {

      toast.info("teacher updating please wait.", {
        position: "top-right",
        autoClose: 1200,
      });

      setTimeout(() => {
        toast.dismiss();
        setTeacher({
          id: "",
          firstName: "",
          middleName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          status: "",
          deptId: "",
        });
        toast.success("teacher updated.", { position: "top-right", autoClose: 1600 });

        const modalElement = document.getElementById('teacherModal');
        const modalInstance =
          bootstrap.Modal.getInstance(modalElement) ||
          new bootstrap.Modal(modalElement, {
            backdrop: 'non-static',
            keyboard: false
          });
        if (modalInstance) {
          modalInstance.hide();
        }
      }, 2000);

      setTimeout(() => {
        toast.dismiss();
        handleAll();
      }, 3500);
      return true;

    }).catch((error) => {
      console.log("error", JSON.stringify(error));
      toast.error(<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="38"
          height="38"
          fill="red"
          className="bi bi-exclamation-triangle"
          viewBox="0 0 16 16"
          aria-label="Warning"
          role="img"
        >
          <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
          <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
        </svg>
        <span className='fw-bold'>{error.response.data.message}</span>
      </div>, {
        position: "top-right",
        icon: false,
      });
      return false;
    });

  };


  // delete teacher
  const removeTeacher = (event, id, name) => {
    event.preventDefault();
    toast.info(({ closeToast }) => (
      <div className='text-center p-2'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="38"
          height="38"
          fill="red"
          className="bi bi-exclamation-triangle"
          viewBox="0 0 16 16"
          aria-label="Warning"
          role="img"
        >
          <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
          <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
        </svg><p><b>Are you sure you want to delete the teacher '{name}'?</b></p><div className='d-flex p-2 justify-content-center'><button className='btn btn-outline-warning flex-row' onClick={() => {
          deleteTeacherId(id);
          closeToast();
        }}>Yes</button>
          <button className='btn btn-outline-secondary ms-2 flex-row' onClick={() => {
            closeToast();
          }}>No</button></div></div>
    ), { position: "top-center", icon: false });

    const deleteTeacherId = (id) => {
      deleteTeacher(id).then(response => {
        toast.info("Teacher deleting please wait...", { position: "top-right", autoClose: 1200 });

        setTimeout(() => {
          toast.dismiss();
          setTeacher({
            id: "",
            firstName: "",
            middleName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            status: "",
            deptId: "",
          });
          toast.success(response.message, { position: "top-right", autoClose: 1600 });

        }, 2000);


        setTimeout(() => {
          toast.dismiss();
          handleAll();
        }, 3500);


        return true;
      }).catch((error) => {
        console.log("error", JSON.stringify(error));
        toast.error("teacher not deleted.", {
          position: "top-right",
        });
        return false;
      });
    }
  };

  // handle all
  const handleAll = (event) => {
    setSelected("All");
    setTeacher({
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      status: "",
      deptId: "",
    });
    getAllTeachers().then((res) => {
      console.log(res);
      setTeachers(res);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  //handle valid
  const handleValid = (event) => {
    event.preventDefault();
    setSelected("Valid");
    getTeachersByStatus('V').then((res) => {
      console.log(res);
      setTeachers(res);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  //handle invalid
  const handleInvalid = (event) => {
    event.preventDefault();
    setSelected("Invalid");
    getTeachersByStatus('I').then((res) => {
      console.log(res);
      setTeachers(res);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    });
  }


  const handleRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    // Remove any old ripple
    document.querySelectorAll('.global-ripple').forEach(el => el.remove());

    const circle = document.createElement('span');
    circle.classList.add('global-ripple');

    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - size / 2}px`;
    circle.style.top = `${e.clientY - size / 2}px`;

    document.body.appendChild(circle);

    circle.addEventListener('animationend', () => {
      circle.remove();
    });
  };

  return (
    <>

      <div className='row'>
        <div className='mx-auto col-12'>
          <div className="card mt-4">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              {/* Left-aligned Notice Button */}
              <button color="primary" className="btn btn-primary" onClick={e => newTeacher()}>
                <i className="bi bi-person-video3 fs-6 me-2"></i><span className='me-4'>Teacher</span>
              </button>

              {/* Right-aligned Dropdown Filter */}
              <div className="input-group input-group-limit w-auto dept">
                <button type="button" className="btn btn-outline-success btn-lg fs-6">
                  {selected}
                </button>
                <button
                  type="button"
                  className="btn btn-success dropdown-toggle dropdown-toggle-split"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className={`dropdown-item ${selected === "All" ? "active text-bg-primary" : ""}`}
                      onClick={handleAll}
                    >
                      All
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${selected === "Valid" ? "active text-bg-primary" : ""}`}
                      onClick={handleValid}
                    >
                      Valid
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${selected === "Invalid" ? "active text-bg-primary" : ""}`}
                      onClick={handleInvalid}
                    >
                      In-valid
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className={`card-body ${isLoading ? "disabled" : " "}`}>
              {
                isLoading ? (<div className="text-center">
                  <strong role="status">Loading teachers...</strong>
                  <div className="spinner-grow spinner-grow-sm text-danger" role='status'></div>
                  <div className="spinner-grow spinner-grow-sm text-success" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-warning" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-light" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-dark" role="status"></div>
                </div>
                ) : (
                  <div className=' table-wrapper'>
                    <table className="table table-responsible">
                      <thead>
                        <tr>
                          <th scope="row">Sr. No.</th>
                          <th scope="row">First Name</th>
                          <th scope="row">Last Name</th>
                          <th scope="row">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!teachers || teachers.length === 0) ? (
                          <tr>
                            <td colSpan="4" className="text-center"><div className="text-muted fw-semibold" style={{ fontSize: "1.2rem", padding: "20px" }}>
                              <span role="img" aria-label="sad" style={{ fontSize: "2.5rem" }}>🤷🏻</span> No teachers found
                            </div></td>
                          </tr>
                        ) : (

                          teachers.map((row) => (
                            <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>{row.firstName}</td>
                              <td>{row.lastName}</td>
                              <td><button className='btn btn-info me-2' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Edit" onClick={e => { handleRipple(e); editTeacher(row) }}><i className="bi bi-pencil-square"></i></button> <button className='btn btn-danger' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete" onClick={e => { handleRipple(e); removeTeacher(e, row.id, row.deptDesc) }}><i className="bi bi-trash"></i></button></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="modal fade" id="teacherModal" aria-labelledby="exampleModalLabel" aria-hidden="true" >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">{isUpdate ? "Update Teacher" : "Add New Teacher"}</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <input
                  type='text'
                  name="firstName"
                  className={`form-control mb-3 ${validation.firstName ? 'ripple-invalid' : ''}`}
                  placeholder='First Name'
                  value={teacher.firstName}
                  onChange={fieldChanged}
                />
                <input
                  type='text'
                  name="middleName"
                  className='form-control mb-3'
                  placeholder='Middle Name'
                  value={teacher.middleName}
                  onChange={fieldChanged}
                />
                <input
                  type='text'
                  name="lastName"
                  className={`form-control mb-3 ${validation.lastName ? 'ripple-invalid' : ''}`}
                  placeholder='Last Name'
                  value={teacher.lastName}
                  onChange={fieldChanged}
                />
                <input
                  type='text'
                  name="username"
                  className={`form-control mb-3 ${validation.username ? 'ripple-invalid' : ''}`}
                  placeholder='username'
                  value={teacher.username}
                  onChange={fieldChanged}
                />
                <input
                  type='text'
                  name="email"
                  className={`form-control mb-3 ${validation.email ? 'ripple-invalid' : ''}`}
                  placeholder='email'
                  value={teacher.email}
                  onChange={fieldChanged}
                />
                <input
                  type={`${isUpdate ? "hidden" : "password"}`}
                  name="password"
                  className={`form-control mb-3 ${validation.password ? 'ripple-invalid' : ''}`}
                  placeholder='password'
                  value={teacher.password}
                  onChange={fieldChanged}
                />

                <select
                  name="status"
                  className={`form-control mb-3 ${validation.status ? 'ripple-invalid' : ''}`}
                  aria-label="Select Status"
                  value={teacher.status}
                  onChange={fieldChanged}
                >
                  <option value="" disabled>Select Status</option>
                  <option value="V">Valid</option>
                  <option value="I">Invalid</option>
                </select>
                <select
                  name="deptId"
                  className={`form-control mb-3 ${validation.deptId ? 'ripple-invalid' : ''}`}
                  aria-label="Select Department"
                  value={teacher.deptId || ""}
                  onChange={fieldChanged}
                >
                  <option value="" disabled>Select Department</option>
                  {depts.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.deptDesc}</option>
                  ))}
                </select>

              </div>
              <div className="modal-footer">
                {isUpdate ? (
                  <button type="button" className="btn btn-warning" onClick={e => { handleRipple(e); updateTeacher(e) }}>Update</button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={e => { handleRipple(e); saveTeacher(e) }}>Save</button>
                )
                }
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Teachers