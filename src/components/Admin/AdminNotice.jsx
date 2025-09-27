import React, { useEffect, useState } from 'react'
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import { getAllNotices } from '../../services/AdminServices/NoticeService';
import { toast } from 'react-toastify';
import { getAllCourses } from '../../services/AdminServices/DeptService';
const AdminNotice = () => {
  const [notice, setNotice] = useState({
    id: '',
    noticeTitle: '',
    noticeDesc: '',
    deptId: [],
    status: ''
  });

  const [notices, setNotices] = useState([]);
  const [depts, setDepts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  // State htmlFor loading
  const [isUpdate, setIsUpdate] = useState(false);
  const [selected, setSelected] = useState("All");

  const [validation, setValidation] = useState({
    noticeTitle: false,
    noticeDesc: false,
    deptId: false,
    status: false,
  });

  const validateFields = () => {
    const errors = {};

    if (!notice.noticeTitle.trim()) { errors.noticeTitle = true; }
    if (!notice.noticeDesc.trim()) { errors.noticeDesc = true; }


    setValidation(prev => ({ ...prev, ...errors }));

    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;


    setNotice({ ...notice, [event.target.name]: event.target.value });

    setNotice(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when the user starts typing
    setValidation(prev => ({
      ...prev,
      [name]: false
    }));
  };

  useEffect(() => {
    setIsLoading(true);
    getAllNotices().then((data) => {
      setNotices(data);
    }).catch((error) => {
      console.log("error", error);
      toast.error("Something went wrong.", {
        position: "top-right",
      });
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
  }, []);

  // handle new user type button click
  const newNotice = () => {
    setNotice({
      id: '',
      noticeTitle: '',
      noticeDesc: '',
      deptId: [],
      status: ''
    });

    setIsUpdate(false);

    // Open the Bootstrap modal programmatically
    const modalElement = document.getElementById('adminNoticeModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.show();
  };


  const handleAll = () => {
    setSelected("All");
  }

  const handleValid = () => {
    setSelected("Valid");
  }

  const handleInvalid = () => {
    setSelected("Invalid");
  }


  const updateNotice = (e) => {
    e.preventDefault();
    if (!validateFields()) return;

  }

  const sendNotice = (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setTimeout(() => {
      toast.dismiss();
      setNotice({
        id: '',
        noticeTitle: '',
        noticeDesc: '',
        deptId: [],
        status: ''
      });

      toast.success("Notice sent.", { position: "top-right", autoClose: 1600 });
      const modalElement = document.getElementById('adminNoticeModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }, 2000);

    setTimeout(() => {
      toast.dismiss();
      handleAll();
    }, 3500);

    return true;
  }

  //view notice
  const viewNotice = (notice) => {
    setIsUpdate(false);
    setNotice(notice);
    toast.info(`${notice.noticeDesc}`, { position: "top-right", autoClose: 1600 });
  };

  // edit notice
  const editNotice = (notice) => {
    setIsUpdate(true);
    setNotice(notice);
    var myModal = new bootstrap.Modal(document.getElementById('adminNoticeModal'), {
      keyboard: false
    });
    myModal.show();
  };


  //remove notice
  const removeNotice = (id, title) => {

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
    <div>
      <div className='container'>
        <div className='mx-auto'>
          <div className="card mt-4">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <button color="primary" className='btn btn-primary me-2' onClick={e => { handleRipple(e); newNotice() }}>
                Notice
              </button>
              <div className="input-group ms-auto input-group-limit">
                <span className="input-group-text" id="basic-addon1">Status</span>
                <button type='button' className='btn btn-outline-success' >
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
                  <strong role="status">Loading notices please wait...</strong>
                  <div className="spinner-grow spinner-grow-sm text-danger" role='status'></div>
                  <div className="spinner-grow spinner-grow-sm text-success" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-warning" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-light" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm text-dark" role="status"></div>
                </div>
                ) : (
                  <div className='table-wrapper'>
                    <table className="table table-responsive">
                      <thead>
                        <tr>
                          <th className="col-srno" scope="row">Sr. No.</th>
                          <th scope="row">Notice Title</th>
                          <th scope="row">Department</th>
                          <th scope="row">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!notices || notices.length === 0) ? (
                          <tr>
                            <td colSpan="4" className="text-center"><div className="text-muted fw-semibold" style={{ fontSize: "1.2rem", padding: "20px" }}>
                              <span role="img" aria-label="sad" style={{ fontSize: "2.5rem" }}>🤷🏻</span> No any notice found
                            </div></td>
                          </tr>
                        ) : (
                          notices.map((row) => (
                            <tr key={row.id}>
                              <td >{row.id}</td>
                              <td>{row.noticeTitle}</td>
                              <td>{
                                Array.isArray(row.deptId)
                                  ? row.deptId.map((id) => {
                                    const dept = depts.find(d => d.id === id);
                                    return dept ? dept.deptDesc : id;
                                  }).join(', ')
                                  : (() => {
                                    const dept = depts.find(d => d.id === row.deptId);
                                    return dept ? dept.deptDesc : row.deptId;
                                  })()
                              }</td>
                              <td>
                                <button class="btn btn-warning me-1" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="View Notice" onClick={e => { handleRipple(e); viewNotice(row) }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                  </svg></button>
                                <button className='btn btn-info me-1' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Edit" onClick={e => { handleRipple(e); editNotice(row) }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                  </svg></button>
                                <button className='btn btn-danger me-1' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete" onClick={e => { handleRipple(e); removeNotice(e, row.id, row.noticeTitle) }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                  </svg>
                                </button></td>
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
      <div className="modal fade" id="adminNoticeModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{isUpdate ? "Update notice" : "Add new notice"}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input type='text' className={`form-control mb-3 ${validation.noticeTitle ? 'ripple-invalid' : ''}`} placeholder='Notice title'
                value={notice.noticeTitle}
                onChange={handleChange} />

              <input type='text' className={`form-control mb-3 ${validation.noticeDesc ? 'ripple-invalid' : ''}`} placeholder='Notice'
                value={notice.noticeDesc}
                onChange={handleChange} />

              <select
                name="deptId"
                className={`form-control mb-3 ${validation.deptId ? 'ripple-invalid' : ''}`}
                aria-label="Select Department"
                value={notice.deptId || ""}
                onChange={handleChange}
              >
                <option value="" disabled>Select Department</option>
                {depts.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.deptDesc}</option>
                ))}
              </select>

              <select
                name="status"
                className={`form-select mb-3 ${validation.status ? 'ripple-invalid' : ''}`}
                aria-label="status"
                value={notice.status}
                onChange={handleChange}
              >
                <option value="" disabled>Select</option>
                <option value="V">Valid</option>
                <option value="I">Invalid</option>
              </select>

            </div>
            <div className="modal-footer">
              {isUpdate ? (

                <button type="button" className="btn btn-warning" onClick={e => { updateNotice(e) }}>Update</button>

              ) : (

                <button type="button" className="btn btn-primary" onClick={e => { sendNotice(e) }}>Save</button>

              )

              }
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminNotice