import React, { useEffect, useState } from 'react'
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import { toast } from 'react-toastify';
import { getAllSubjects } from '../../services/AdminServices/SubjectService';
import { checkTokenAndLogout } from '../../services/auth';

const Subjects = () => {

  const [subject, setSubject] = useState({
    id: '',
    subjectDesc: '',
    status: '',
  });

  const [subjects, setSubjects] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selected, setSelected] = useState("All");
  const [isLoading, setIsLoading] = useState(false);  // State htmlFor loading

  useEffect(() => {
    checkTokenAndLogout();
    setIsLoading(true);
    getAllSubjects().then((res) => {
      console.log(res);
      setSubjects(res);
      setIsLoading(false);
    }).catch((err) => {
      console.log(err);
      setIsLoading(false);
    });

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  //field change handler
  const fieldChanged = (event) => {
    setSubject({ ...subject, [event.target.name]: event.target.value });
  };

  // add new Subject
  const newSubject = () => {
    setIsUpdate(false);
    setSubject({
      id: '',
      subjectDesc: '',
      status: '',
    });
    var myModal = new bootstrap.Modal(document.getElementById('subjectModal'), {
      keyboard: false
    });
    myModal.show();
  };

  // handle save subject
  const saveSubject = (e) => {

  };

  // handle edit subject
  const editSubjects = (row) => {
    setIsUpdate(true);
    setSubject({
      id: row.id,
      subjectDesc: row.subjectDesc,
      status: row.status,
    });
    var myModal = new bootstrap.Modal(document.getElementById('subjectModal'), {
      keyboard: false
    });
    myModal.show();
  };

  // handle delete subject
  const removeSubjects = (e, id, name) => {
    e.preventDefault();
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
        </svg><p><b>Are you sure you want to delete the course '{name}'?</b></p><div className='d-flex p-2 justify-content-center'><button className='btn btn-outline-warning flex-row' onClick={() => {
          // deleteSubjectId(id);
          closeToast();
        }}>Yes</button>
          <button className='btn btn-outline-secondary ms-2 flex-row' onClick={() => {
            closeToast();
          }}>No</button></div></div>
    ), { position: "top-center", icon: false });
  };

  // handle update subject
  const updateSubject = (e) => {

  };

  // handle filtering
  const handleAll = () => {
    setSelected("All");
  };

  const handleValid = () => {
    setSelected("Valid");
  };

  const handleInvalid = () => {
    setSelected("Invalid");
  };

  const handleRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    // Remove any old ripple
    document.querySelectorAll('.global-ripple').forEach(el => el.remove());

    const circle = document.createElement('span');
    circle.classList.add('global-ripple');

    const size = Math.max(rect.width, rect.height) * 2;
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - size / 2}px`;
    circle.style.top = `${e.clientY - size / 2}px`;

    document.body.appendChild(circle);

    circle.addEventListener('animationend', () => {
      circle.remove();
    });
  };

  return (
    <div>
      <div className='container'>
        <div className='row'>
          <div className='mx-auto'>
            <div className="card mt-4">
              <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <button color="primary" className='btn btn-bd-primary me-2' onClick={e => { handleRipple(e); newSubject() }}>
                  Subject
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
                    <strong role="status">Loading subjects...</strong>
                    <div className="spinner-grow spinner-grow-sm text-danger" role='status'></div>
                    <div className="spinner-grow spinner-grow-sm text-success" role="status"></div>
                    <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                    <div className="spinner-grow spinner-grow-sm text-warning" role="status"></div>
                    <div className="spinner-grow spinner-grow-sm text-light" role="status"></div>
                    <div className="spinner-grow spinner-grow-sm text-dark" role="status"></div>
                  </div>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Subject</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!subjects || subjects.length === 0) ? (
                          <tr>
                            <td colSpan="3" className="text-center"><div className="text-muted fw-semibold" style={{ fontSize: "1.2rem", padding: "20px" }}>
                              <span role="img" aria-label="sad" style={{ fontSize: "2.5rem" }}>🤷🏻</span> No subjects found
                            </div></td>
                          </tr>
                        ) : (

                          subjects.map((row) => (
                            <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>{row.subjectDesc}</td>
                              <td><button className='btn btn-info me-2' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Edit" onClick={e => { handleRipple(e); editSubjects(row) }}><i className="bi bi-pencil-square"></i></button> <button className='btn btn-danger' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete" onClick={e => { handleRipple(e); removeSubjects(e, row.id, row.deptDesc) }}><i className="bi bi-trash"></i></button></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="subjectModal" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{isUpdate ? "Update Subject" : "Add New Subject"}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input
                type='text'
                name="subject"
                className='form-control mb-3'
                placeholder='Enter Subject'
                value={subject.subjectDesc}
                onChange={fieldChanged}
              />
              <select
                name="status"
                className="form-select"
                aria-label="Default select example"
                value={subject.status}
                onChange={fieldChanged}
              >
                <option value="" disabled>Select</option>
                <option value="V">Valid</option>
                <option value="I">Invalid</option>
              </select>
            </div>
            <div className="modal-footer">
              {isUpdate ? (
                <button type="button" className="btn btn-warning" onClick={e => { handleRipple(e); updateSubject(e) }}>Update</button>
              ) : (
                <button type="button" className="btn btn-bd-primary" onClick={e => { handleRipple(e); saveSubject(e) }}>Save</button>
              )
              }

              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subjects