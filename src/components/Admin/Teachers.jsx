import React, { useCallback, useEffect, useRef, useState } from 'react'
import jszip from 'jszip';
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-fixedcolumns-bs5/css/fixedColumns.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";
import "datatables.net-select-bs5/css/select.bootstrap5.min.css";
import $ from "jquery";
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import { addTeacher, deleteTeacher, getAllTeachers, getTeachersByStatus, modifyTeacher } from '../../services/AdminServices/TeacherService';
import { getAllCourses } from '../../services/AdminServices/DeptService';
import { toast } from 'react-toastify';
import { checkTokenAndLogout } from '../../services/auth';
import "datatables.net-bs5";
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import "datatables.net-fixedcolumns-bs5";

const Teachers = () => {
  window.JSZip = jszip;
  const [teacher, setTeacher] = useState({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNo: "",
    address: 0,
    username: "",
    email: "",
    password: "",
    status: "",
    deptId: "",
  });

  const [depts, setDepts] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selected, setSelected] = useState("All");
  const [deleteInfo, setDeleteInfo] = useState({
    id: null,
    name: ""
  });
  const [validation, setValidation] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    email: false,
    username: false,
    mobileNo: false,
    address: false,
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
    if (!teacher.mobileNo) { errors.mobileNo = true; }
    if (!teacher.address) { errors.address = true; }
    if (!teacher.email.trim()) {
      errors.email = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(teacher.email)) {
        errors.email = true;
        toast.error("Invalid email format");
      }
    }

    if (!isUpdate) {
      if (!teacher.password.trim()) { errors.password = true; }
    }

    if (!teacher.status) { errors.status = true; }
    if (!teacher.deptId) { errors.deptId = true; }

    setValidation(prev => ({ ...prev, ...errors }));

    return Object.keys(errors).length === 0;
  };

  const modalTeacherElRef = useRef(null);
  const modalRef = useRef(null);
  const statusRef = useRef("A");
  const tableDomRef = useRef(null);      // ONLY for <table>
  const tableApiRef = useRef(null);      // ONLY for DataTable instance
  const deptMapRef = useRef({});
  const deleteTeacherModalRef = useRef(null);
  const deleteModalInstanceRef = useRef(null);

  useEffect(() => {
    document.title = "Teacher - Admin";
    const el = modalTeacherElRef.current;
    if (!el) return;

    // Create modal with static backdrop (cannot close by clicking outside)
    modalRef.current = new bootstrap.Modal(el, {
      backdrop: 'static',
      keyboard: false
    });
    checkTokenAndLogout();
    getAllCourses()
      .then((dept) => {
        console.log("Departments from API:", dept); // 👈 here
        setDepts(dept);
      })
      .catch((err) => console.log(err));

    const handleModalClose = () => {
      // Clear validation errors

      setValidation({
        firstName: false,
        middleName: false,
        lastName: false,
        email: false,
        username: false,
        mobileNo: false,
        address: false,
        password: false,
        status: false,
        deptId: false,
      });
    };

    el.addEventListener("hidden.bs.modal", handleModalClose);

    return () => {
      el.removeEventListener("hidden.bs.modal", handleModalClose);
    };
  }, []);

  useEffect(() => {
    const map = {};
    depts.forEach(d => {
      map[String(d.id)] = d.deptDesc;   // normalize key
    });
    deptMapRef.current = map;
  }, [depts]);

  useEffect(() => {
    if (depts.length === 0) return;
    if (tableApiRef.current) return;

    tableApiRef.current = $(tableDomRef.current).DataTable({
      ajax: function (_, callback) {
        $.blockUI({
          message: `<div class="blockui-box">
                      <i class="fa-solid fa-spinner fa-spin fa-spin-pulse fa-2x blockui-icon"></i>
                      <div class="blockui-text">Please wait...</div>
                    </div>`,
          css: {
            border: 'none',
            backgroundColor: 'transparent'
          },
          overlayCSS: {
            backgroundColor: '#000',
            opacity: 0.5,
            cursor: 'wait'
          }
        });
        const api =
          statusRef.current === "A"
            ? getAllTeachers()
            : getTeachersByStatus(statusRef.current);

        api.then(res => {
          callback({ data: res });
          $.unblockUI();
        }).catch(() => {
          $.unblockUI();
        });
      },
      scrollY: "300px",
      scrollX: true,
      scrollCollapse: true,
      fixedColumns: {
        leftColumns: 3
      },
      autoWidth: false,
      width: "100%",
      dom:
        "<'row mb-3'" +
        "<'col-12 col-md-6 d-flex align-items-center gap-2 justify-content-start mb-2 mb-md-0'" +
        "f <'my-custom-dropdown'>" +
        ">" +
        "<'col-12 col-md-6 d-flex justify-content-start justify-content-md-end'B>" +
        ">" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row mt-3'<'col-sm-5'i><'col-sm-7'p>>",

      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Teachers List',
          text: '<i class="bi bi-file-earmark-excel"></i> Excel',
          className: 'btn btn-success btn-sm',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            format: {
              body: function (data, row, column, node) {
                if (column === 0) {
                  return row + 1;
                }
                return data;
              }
            }
          }
        }, {
          extend: 'print',
          className: 'btn btn-dark btn-sm',
          text: '<i class="bi bi-printer"></i> Print',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            format: {
              body: function (data, row, column, node) {
                if (column === 0) {
                  return row + 1;
                }
                return data;
              }
            }
          },
          customize: function (win) {
            $(win.document.body).css('zoom', '0.8');
            $(win.document.body).find('table')
              .addClass('compact')
              .css('width', '100%');
          }
        }
      ],
      language: {
        emptyTable: `<div class="text-center py-4">
                            <i class="bi bi-database-x text-danger" style="font-size: 2.5rem;"></i>
                            <h5 class="mt-3 text-muted fw-bold">No Teachers Available</h5>
                            <p class="text-secondary">Please adjust your filter or add a new teacher.</p>
                          </div>
                        `
      }, order: [[1, 'asc']],
      on: {
        draw: (e) => {
          let start = e.dt.page.info().start;

          e.dt.column(0, { page: 'current' })
            .nodes()
            .each((cell, i) => {
              cell.textContent = start + i + 1;
            });
        }
      },
      columns: [
        {
          title: "Sr. No.",
          className: "text-center",
          data: null,
        },

        {
          title: "First Name",
          className: "text-center",
          data: function (row, type, val, meta) {
            if (row.firstName === null || row.firstName === undefined || row.firstName === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.firstName;
            }
          }

        },
        {
          title: "Last Name",
          className: "text-center",
          data: function (row, type, val, meta) {
            if (row.lastName === null || row.lastName === undefined || row.lastName === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.lastName;
            }
          }
        },
        {
          title: "Middle Name",
          className: "text-center",
          data: function (row, type, val, meta) {
            if (row.middleName === null || row.middleName === undefined || row.middleName === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.middleName;
            }
          }

        },
        {
          title: "Mobile No",
          className: "text-center",
          data: function (row, type, val, meta) {
            if (row.mobileNo === null || row.mobileNo === undefined || row.mobileNo === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.mobileNo;
            }
          },
        },
        {
          title: "Address",
          className: "text-center",
          data: function (row, type, val, meta) {
            if (row.address === null || row.address === undefined || row.address === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.address;
            }
          },
        },
        {
          title: "Email",
          className: "text-center",
          data: function (row, type, val, meta) {
            if (row.email === null || row.email === undefined || row.email === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.email;
            }
          }
        },
        {
          title: "Username",
          className: "text-center",
          data: function (row, type, val, meta) {
            if (row.username === null || row.username === undefined || row.username === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.username;
            }
          }
        },
        {
          title: "Department",
          className: "text-center",
          data: row => deptMapRef.current[String(row.deptId)] || "-"
        }, {
          title: "Action",
          className: "text-center",
          data: function (row, type, val, meta) {
            return `<div class="dropdown">
                      <button class="btn dropdown-toggle btn-outline-primary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Action
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item edit-btn text-center" href="javascript:void(0);"  data-id="${row.id}">Edit <i class="bi bi-pencil-square text-warning"></i></a></li>
                        <li><a class="dropdown-item delete-btn text-center" href="javascript:void(0);" data-id="${row.id}" >Delete <i class="bi bi-trash text-danger"></i></a></li>
                      </ul>
                    </div>`;
          }
        }
      ],
    });


    // Handle Edit button click
    $(tableDomRef.current).on('click', '.edit-btn', function () {
      const data = tableApiRef.current.row($(this).parents('tr')).data();
      setIsUpdate(true);
      setTeacher({
        ...data,
      });
      modalRef.current.show();
    });

    // Handle Delete button click
    $(tableDomRef.current).on('click', '.delete-btn', function () {
      const id = $(this).data('id');
      const data = tableApiRef.current.row($(this).parents('tr')).data();
      const name = data.firstName + " " + data.lastName;
      // ✅ Save into React state
      setDeleteInfo({ id, name });
      if (!deleteModalInstanceRef.current) {
        deleteModalInstanceRef.current = new bootstrap.Modal(
          deleteTeacherModalRef.current,
          {
            backdrop: 'static',
            keyboard: false,
          }
        );
      }

      deleteModalInstanceRef.current.show();
    });
  }, [depts]);

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
          mobileNo: 0,
          address: "",
          email: "",
          password: "",
          status: "",
          deptId: "",
        });
        toast.success(response.message, { position: "top-right", autoClose: 1600 });
      }, 2000);

      setTimeout(() => {
        toast.dismiss();
        // ✅ CLOSE MODAL HERE
        deleteModalInstanceRef.current?.hide();
        setDeleteInfo({ id: null, name: "" });
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

  const reloadTable = () => {
    if (!tableApiRef.current) return;
    tableApiRef.current.ajax.reload(() => {
      // 🔥 THIS IS THE KEY LINE
      tableApiRef.current.rows().invalidate('data').draw(false);
    }, false);
  };

  // handle all
  const handleAll = useCallback((event) => {
    setSelected("All");
    setTeacher({
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      mobileNo: 0,
      address: "",
      email: "",
      password: "",
      status: "",
      deptId: "",
    });
    statusRef.current = "A";
    reloadTable();
  }, []);

  const handleValid = (event) => {
    event.preventDefault();
    setSelected("Valid");
    statusRef.current = "V";
    reloadTable();
  };

  const handleInvalid = (event) => {
    event.preventDefault();
    setSelected("Invalid");
    statusRef.current = "I";
    reloadTable();
  };

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
      mobileNo: 0,
      address: "",
      email: "",
      password: "",
      status: "",
      deptId: "",
    });
    modalRef.current.show();
  };

  // save teacher
  const saveTeacher = (event) => {
    event.preventDefault();
    if (!validateFields()) return;

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
          mobileNo: 0,
          address: "",
          email: "",
          password: "",
          status: "",
          deptId: "",
        });
        toast.success("Teacher added.", { position: "top-right", autoClose: 1600 });
        modalRef.current.hide();
      }, 2000);

      setTimeout(() => {
        toast.dismiss();
        handleAll();
      }, 3500);
      // Append new teacher to the list
    }).catch((err) => {
      console.log(err.response.data.message);
    });
  };

  // update teacher
  const updateTeacher = (event) => {
    event.preventDefault();
    setIsUpdate(true);
    if (!validateFields()) return;
    // ✅ Only include password if user entered a new one
    const updatedTeacher = { ...teacher };
    if (teacher.password && teacher.password.trim() !== '') {
      updatedTeacher.password = teacher.password;
    }
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
          mobileNo: 0,
          address: "",
          email: "",
          password: "",
          status: "",
          deptId: "",
        });
        toast.success("teacher updated.", { position: "top-right", autoClose: 1600 });
        modalRef.current.hide();
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
            <div className="card-body">
              <div className='table-wrapper' id="teacherTableWrapper">
                <table className="table nowrap display" id="teacherTable" ref={tableDomRef}>
                  <thead></thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="teacherModal" ref={modalTeacherElRef} aria-labelledby="exampleModalLabel" aria-hidden="true" >
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
                  name="mobileNo"
                  className={`form-control mb-3 ${validation.mobileNo ? 'ripple-invalid' : ''}`}
                  placeholder='mobile number'
                  value={teacher.mobileNo}
                  onChange={fieldChanged}
                />
                <textarea
                  size="50"
                  name="address"
                  className={`form-control mb-3 ${validation.address ? 'ripple-invalid' : ''}`}
                  placeholder='Address'
                  value={teacher.address}
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
                  <button type="button" className="btn btn-warning" onClick={e => { updateTeacher(e) }}>Update</button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={e => { saveTeacher(e) }}>Save</button>
                )
                }
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal" tabIndex="-1" id="deleteTeacherModal" ref={deleteTeacherModalRef}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">
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
                  <span className='ms-3 fw-bold text-warning'>Warning</span>
                </h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className='text-center p-2'>
                  <p className="fw-semibold fs-5">
                    Are you sure?
                  </p>
                  <p>
                    You’re about to remove{" "}
                    <span className="fw-bold text-danger">{deleteInfo.name}</span>{" "}
                    from the teachers list.
                  </p>
                  <p className="text-muted mb-0">
                    This change cannot be reversed.
                  </p></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => deleteTeacherId(deleteInfo.id)}>Yes</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Teachers 