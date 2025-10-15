import React, { useEffect, useState } from 'react'
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import { addCourse, deleteCourse, getAllCourses, getCoursesByStatus, updateDepartment } from '../../services/AdminServices/DeptService';
import { toast } from 'react-toastify';
import { checkTokenAndLogout } from '../../services/auth';

const Cousres = () => {
  //declarations

  const [course, setCourse] = useState({
    id: '',
    deptDesc: '',
    status: '',
  });
  const [courses, setCourses] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selected, setSelected] = useState("All");
  const [isLoading, setIsLoading] = useState(false);  // State htmlFor loading
  const [validation, setValidation] = useState({
    deptDesc: false,
    status: false,
  });

  const validateFields = () => {
    const errors = {};

    if (!course.deptDesc.trim()) { errors.deptDesc = true; }
    if (!course.status.trim()) { errors.status = true; }


    setValidation(prev => ({ ...prev, ...errors }));

    return Object.keys(errors).length === 0;
  };

  //field change handler
  const fieldChanged = (event) => {
    const { name, value } = event.target;

    setCourse({ ...course, [event.target.name]: event.target.value });

    setCourse(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when the user starts typing
    setValidation(prev => ({
      ...prev,
      [name]: false
    }));

  };

  // on page load
  useEffect(() => {
    document.title = "Department - Admin";
    checkTokenAndLogout();
    setIsLoading(true);
    getAllCourses().then((res) => {
      console.log(res);
      setCourses(res);
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

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });

    //cleanup validation errors on modal close
    const modalElement = document.getElementById('coursesModal');

    const handleModalClose = () => {
      // Clear validation errors
      setValidation({
        deptDesc: false,
        status: false,
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

  // add new course
  const newCourse = () => {
    setIsUpdate(false);
    setCourse({ id: '', deptDesc: '', status: '' });
    var myModal = new bootstrap.Modal(document.getElementById('coursesModal'), {
      backdrop: 'static',
      keyboard: false
    });
    myModal.show();
  };

  // save course
  const saveCourse = (event) => {
    event.preventDefault();
    if (!validateFields()) return;

    addCourse(course).then(response => {

      toast.info("course adding please wait...", {
        position: "top-right",
        autoClose: 1200,
      });

      setTimeout(() => {
        toast.dismiss();
        setCourse({ id: '', deptDesc: '', status: '' });
        toast.success("course added.", { position: "top-right", autoClose: 1600 });
        const modalElement = document.getElementById('coursesModal');
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

  // edit courses
  const editCourses = (row) => {
    setCourse({ ...course, id: row.id, deptDesc: row.deptDesc, status: row.status });
    setIsUpdate(true);

    // Open the Bootstrap modal programmatically
    var myModal = new bootstrap.Modal(document.getElementById('coursesModal'), {
      backdrop: 'static',
      keyboard: false
    });
    myModal.show();
  };

  // update course
  const updateCourse = (event) => {
    event.preventDefault();
    setIsUpdate(true);
    if (!validateFields()) return;

    updateDepartment(course, course.id).then(response => {

      toast.info("course updating please wait.", {
        position: "top-right",
        autoClose: 1200,
      });

      setTimeout(() => {
        toast.dismiss();
        setCourse({ id: '', deptDesc: '', status: '' });
        toast.success("Course updated.", { position: "top-right", autoClose: 1600 });

        const modalElement = document.getElementById('coursesModal');
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
  }

  // remove courses
  const removeCourses = (event, id, courseDesc) => {
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
        </svg><p><b>Are you sure you want to delete the course '{courseDesc}'?</b></p><div className='d-flex p-2 justify-content-center'><button className='btn btn-outline-warning flex-row' onClick={() => {
          deleteCourseId(id);
          closeToast();
        }}>Yes</button>
          <button className='btn btn-outline-secondary ms-2 flex-row' onClick={() => {
            closeToast();
          }}>No</button></div></div>
    ), { position: "top-center", icon: false });

    const deleteCourseId = (id) => {
      deleteCourse(id).then(response => {
        toast.info("Course deleting please wait...", { position: "top-right", autoClose: 1200 });

        setTimeout(() => {
          toast.dismiss();
          setCourse({ id: '', deptDesc: '', status: '' });
          toast.success(response.message, { position: "top-right", autoClose: 1600 });

        }, 2000);


        setTimeout(() => {
          toast.dismiss();
          handleAll();
        }, 3500);

        setCourse({ id: '', deptDesc: '', status: '' });
        return true;
      }).catch((error) => {
        console.log("error", JSON.stringify(error));
        toast.error("course not deleted.", {
          position: "top-right",
        });
        return false;
      });
    }
  }

  // handle all
  const handleAll = (event) => {
    setSelected("All");
    setCourse({ id: '', deptDesc: '', status: '' });
    getAllCourses().then((res) => {
      console.log(res);
      setCourses(res);
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
    getCoursesByStatus('V').then((res) => {
      console.log(res);
      setCourses(res);
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
    getCoursesByStatus('I').then((res) => {
      console.log(res);
      setCourses(res);
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
        <div className='mx-auto'>
          <div className="card mt-4">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <button color="primary" className='btn btn-primary me-2' onClick={e => { handleRipple(e); newCourse() }}>
                <i class="bi bi-book-fill fs-8 me-2"></i>Course
              </button>
              <div className="input-group ms-auto input-group-limit">
                <span className="input-group-text" id="basic-addon1">Status</span>
                <button type='button' className='btn btn-outline-success'>
                  {selected}
                </button>
                <button type="button" className="btn btn-success dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" onClick={e => { handleRipple(e); }}>
                  <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className='dropdown-menu dropdown-menu-end'>
                  <li><button className={`dropdown-item ${selected === "All" ? "active" : ""}`} onClick={handleAll}>All</button></li>
                  <li><button className={`dropdown-item ${selected === "Valid" ? "active" : ""}`} onClick={handleValid}>Valid</button></li>
                  <li><button className={`dropdown-item ${selected === "Invalid" ? "active" : ""}`} onClick={handleInvalid}>In-valid</button></li>
                </ul>
              </div>
            </div>
            <div className={`card-body ${isLoading ? "disabled" : " "}`}>
              {
                isLoading ? (<div className="text-center">
                  <strong role="status">Loading courses...</strong>
                  <div className="spinner-grow spinner-grow-sm text-danger" role='status'></div>
                  <div className="spinner-grow spinner-grow-sm text-success" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-warning" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-light" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-dark" role="status"></div>
                </div>
                ) : (
                  <div className=' table-wrapper'>
                    <table className="table table-responsive">
                      <thead>
                        <tr>
                          <th scope="row" >Sr. No.</th>
                          <th scope="row">Course</th>
                          <th scope="row">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!courses || courses.length === 0) ? (
                          <tr>
                            <td colSpan="3" className="text-center"><div className="text-muted fw-semibold" style={{ fontSize: "1.2rem", padding: "20px" }}>
                              <span role="img" aria-label="sad" style={{ fontSize: "2.5rem" }}>🤷🏻</span> No courses found
                            </div></td>
                          </tr>
                        ) : (

                          courses.map((row) => (
                            <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>{row.deptDesc}</td>
                              <td><button className='btn btn-info me-2' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Edit" onClick={e => { handleRipple(e); editCourses(row) }}><i className="bi bi-pencil-square"></i></button> <button className='btn btn-danger' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete" onClick={e => { handleRipple(e); removeCourses(e, row.id, row.deptDesc) }}><i className="bi bi-trash"></i></button></td>
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
      </div>

      <div className="modal fade" id="coursesModal" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{isUpdate ? "Update Course" : "Add New Course"}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input
                type='text'
                name="deptDesc"
                className={`form-control mb-3 ${validation.deptDesc ? 'ripple-invalid' : ''}`}
                placeholder='Enter Course Description'
                value={course.deptDesc}
                onChange={fieldChanged}
              />
              <select
                name="status"
                className={`form-select mb-3 ${validation.status ? 'ripple-invalid' : ''}`}
                aria-label="Default select example"
                value={course.status}
                onChange={fieldChanged}
              >
                <option value="" disabled>Select</option>
                <option value="V">Valid</option>
                <option value="I">Invalid</option>
              </select>
            </div>
            <div className="modal-footer">
              {isUpdate ? (
                <button type="button" className="btn btn-warning" onClick={e => { handleRipple(e); updateCourse(e) }}>Update</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={e => { handleRipple(e); saveCourse(e) }}>Save</button>
              )
              }

              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cousres