import React, { useCallback, useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import jszip from 'jszip';
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";
import "datatables.net-select-bs5/css/select.bootstrap5.min.css";
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import { toast } from 'react-toastify';
import { getAllCourses } from '../../services/AdminServices/DeptService';
import { addNewStudent, deleteStudent, getAllStudents, getStudentsByStatus, modifyStudent } from '../../services/TeacherService/StudentService';
import { checkTokenAndLogout } from '../../services/auth';
import "datatables.net-bs5";
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-responsive-bs5';

const ManageStudents = () => {
  window.JSZip = jszip;
  const [depts, setDepts] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selected, setSelected] = useState("All");

  const [student, setStudent] = useState({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    //mobileNo: "",
    //address: 0,
    userName: "",
    email: "",
    password: "",
    guardianName: "",
    status: "",
    deptId: "",
  });

  const [validation, setValidation] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    email: false,
    userName: false,
    password: false,
    guardianName: false,
    status: false,
    deptId: false,
  });


  const validateFields = () => {
    const errors = {};

    // Required fields
    if (!student.firstName.trim()) { errors.firstName = true; }
    if (!student.lastName.trim()) { errors.lastName = true; }
    if (!student.userName.trim()) { errors.userName = true; }
    //if (!student.mobileNo) { errors.mobileNo = true; }
    //if (!student.address) { errors.address = true; }
    if (!student.email.trim()) {
      errors.email = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(student.email)) {
        errors.email = true;
        toast.error("Invalid email format");
      }
    }

    if (!isUpdate) {
      if (!student.password.trim()) { errors.password = true; }
    }

    if (!student.status) { errors.status = true; }

    if (!student.deptId) { errors.deptId = true; }


    setValidation(prev => ({ ...prev, ...errors }));

    return Object.keys(errors).length === 0;
  };

  const tableRef = useRef();
  const getStudentDetailsRef = useRef();
  const handleAllRef = useRef();
  const modalElRef = useRef(null);
  const modalRef = useRef(null);

  const getStudentDetails = useCallback((studs) => {
    const tableEl = tableRef.current;

    // If table already exists → destroy it completely
    if ($.fn.dataTable.isDataTable(tableEl)) {
      $(tableEl).DataTable().clear().destroy();
      $(tableEl).empty(); // prevents duplicated headers
    }

    $(tableEl).DataTable({
      processing: true,
      fixedHeader: true,

      dom:
        "<'row mb-3'<'col-12 col-md-6 d-flex align-items-center justify-content-start mb-2 mb-md-0'f>" +
        "<'col-12 col-md-6 d-flex justify-content-start justify-content-md-end'B>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row mt-3'<'col-sm-5'i><'col-sm-7'p>>",

      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Students List',
          text: '<i class="bi bi-file-earmark-excel"></i> Excel',
          className: 'btn btn-success btn-sm',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7],
            format: {
              body: function (data, row, column, node) {
                if (column === 1) {
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
            columns: [1, 2, 3, 4, 5, 6, 7],
            format: {
              body: function (data, row, column, node) {
                if (column === 1) {
                  return row + 1;
                }
                return data;
              }
            }
          }
        }
      ],
      language: {

        processing: `
                      <div className="text-center">
                        <strong role="status">Loading students...</strong>
                        <div className="spinner-grow spinner-grow-sm text-danger" role='status'></div>
                        <div className="spinner-grow spinner-grow-sm text-success" role="status"></div>
                        <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                        <div className="spinner-grow spinner-grow-sm text-warning" role="status"></div>
                        <div className="spinner-grow spinner-grow-sm text-light" role="status"></div>
                        <div className="spinner-grow spinner-grow-sm text-dark" role="status"></div>
                      </div>
                  `,
        emptyTable: `
                      <div class="text-center py-4">
                        <i class="bi bi-database-x text-danger" style="font-size: 2.5rem;"></i>
                        <h5 class="mt-3 text-muted fw-bold">No Students Available</h5>
                        <p class="text-secondary">Please adjust your filter or add a new student.</p>
                      </div>
                    `
      },

      data: studs, // ✅ direct data assignment here
      order: [[1, 'asc']],
      on: {
        draw: (e) => {
          let start = e.dt.page.info().start;

          e.dt.column(1, { page: 'current' })
            .nodes()
            .each((cell, i) => {
              cell.textContent = start + i + 1;
            });
        }
      },
      columns: [
        {
          className: 'dt-control',
          orderable: false,
          data: null,
          defaultContent: '<i class="bi bi-plus-circle text-success fw-bold" style="font-size: 1.2rem;"></i>'
        },
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
            if (row.userName === null || row.userName === undefined || row.userName === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.userName;
            }
          }

        },
        {
          title: "Guardian Name",
          className: "text-center",
          data: function (row, type, val, meta) {
            if (row.guardianName === null || row.guardianName === undefined || row.guardianName === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.guardianName;
            }
          },
        }
      ],
      responsive: {
        details: {
          type: 'column',
          target: 'td.dt-control',
          renderer: function (api, rowIdx, columns) {
            const rowData = api.row(rowIdx).data();
            // Wrap the child table in a td with colspan=3
            let childTableWrapper = $('<td colspan="3"/>');
            let table = $('<table class="table table-borderless mb-0"/>');

            columns.forEach(col => {
              if (col.hidden) {

                let value = col.data;
                if (value === null || value === undefined || value === '') {
                  value = '-'; // Replace blank with dash
                }

                table.append(
                  $('<tr/>').append(
                    $('<td/>').html(`<strong>${col.title}:</strong>`),
                    $('<td/>').text(value)
                  )
                );
              }
            });

            // Add action buttons row
            table.append(
              $('<tr/>').append(
                $('<td/>').html(`
            <button class="btn btn-info me-2 edit-btn" data-id="${rowData.id}">
              <i class="bi bi-pencil-square"></i> Edit
            </button>
            <button class="btn btn-danger delete-btn" data-id="${rowData}">
              <i class="bi bi-trash"></i> Delete
            </button>
          `)
              )
            );

            childTableWrapper.append(table);
            return childTableWrapper.prop('outerHTML');
          }
        }
      }


    });

    $(tableEl).on('click', 'td.dt-control', function () {
      let tr = $(this).closest('tr');
      let icon = $(this).find('i');

      if (tr.hasClass('dt-hasChild')) {
        // Row is currently expanded → will collapse
        icon.removeClass('bi-plus-circle text-success').addClass('bi-dash-circle text-danger');
      } else {
        // Row is collapsed → will expand
        icon.removeClass('bi-dash-circle text-danger').addClass('bi-plus-circle text-success');
      }
    });

    $(tableEl).off('click', '.edit-btn')
      .on('click', '.edit-btn', function (e) {
        const table = $(tableEl).DataTable();
        const rowData = table.row($(this).parents('tr')).data();
        setIsUpdate(true);
        setStudent({
          ...rowData,
          password: ''  // <-- important: don't show hashed password
        });

        modalRef.current.show();

      });

    $(tableEl)
      .off('click', '.delete-btn')
      .on('click', '.delete-btn', function (e) {
        const table = $(tableEl).DataTable();
        const rowData = table.row($(this).parents('tr')).data();
        const id = rowData.id;
        const name = rowData.firstName + " " + rowData.lastName;
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
            </svg><p><b>Are you sure you want to delete the student {name}?</b></p><div className='d-flex p-2 justify-content-center'><button className='btn btn-outline-warning flex-row' onClick={() => {
              deleteStudentId(id);
            }}>Yes</button>
              <button className='btn btn-outline-secondary ms-2 flex-row' onClick={() => {
                closeToast();
              }}>No</button></div></div>
        ), { position: "top-center", icon: false });


        const deleteStudentId = (id) => {
          deleteStudent(id).then(response => {
            toast.info("Student deleting please wait...", { position: "top-right", autoClose: 1200 });

            setTimeout(() => {
              toast.dismiss();
              setStudent({
                id: "",
                firstName: "",
                middleName: "",
                lastName: "",
                //mobileNo: "",
                //address: 0,
                userName: "",
                email: "",
                password: "",
                guardianName: "",
                status: "",
                deptId: "",
              });
              toast.success(response.message, { position: "top-right", autoClose: 1600 });
            }, 2000);

            setTimeout(() => {
              toast.dismiss();
              handleAllRef.current?.();
            }, 3500);
            return true;
          }).catch((error) => {
            console.log("error", JSON.stringify(error));
            toast.error("student not deleted.", {
              position: "top-right",
            });
            return false;
          });
        }
      });
  }, []);

  // handle all
  const handleAll = useCallback((event) => {
    setSelected("All");
    setStudent({
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      //mobileNo: "",
      //address: 0,
      userName: "",
      email: "",
      password: "",
      guardianName: "",
      status: "",
      deptId: "",
    });

    getAllStudents().then((res) => {
      getStudentDetailsRef.current?.(res);
    }).catch((err) => {
      console.log(err);
      toast.error("Something went wrong.", {
        position: "top-right",
      });
    });

  }, []);



  //handle valid
  const handleValid = (event) => {
    event.preventDefault();
    setSelected("Valid");
    getStudentsByStatus('V').then((res) => {
      getStudentDetails(res);
    }).catch((err) => {
      console.log(err);
      toast.error("Something went wrong.", {
        position: "top-right",
      });
    });

  };

  useEffect(() => {


    const el = modalElRef.current;
    if (!el) return;

    // Create modal with static backdrop (cannot close by clicking outside)
    modalRef.current = new bootstrap.Modal(el, {
      backdrop: 'static',
      keyboard: false
    });

    checkTokenAndLogout();
    getStudentDetailsRef.current = getStudentDetails;


    handleAllRef.current = handleAll;

    getAllStudents().then((data) => {
      document.title = "Manage Students";
      getStudentDetails(data);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {

      // Delay tooltip setup until after DOM updates

      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
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



    const handleModalClose = () => {
      setValidation({
        firstName: false,
        middleName: false,
        lastName: false,
        email: false,
        userName: false,
        password: false,
        guardianName: false,
        status: false,
        deptId: false,
      });
    };

    el.addEventListener("hidden.bs.modal", handleModalClose);

    return () => {
      el.removeEventListener("hidden.bs.modal", handleModalClose);
    };


  }, [getStudentDetails, handleAll]);


  //field change handler
  const fieldChanged = (event) => {
    const { name, value } = event.target;

    setStudent({ ...student, [event.target.name]: event.target.value });

    setStudent(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when the user starts typing
    setValidation(prev => ({
      ...prev,
      [name]: false
    }));
  };

  // add new student
  const newStudent = () => {
    setIsUpdate(false);
    setStudent({
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      //mobileNo: "",
      //address: 0,
      userName: "",
      email: "",
      password: "",
      guardianName: "",
      status: "",
      deptId: "",
    });
    modalRef.current.show();
  };

  // save Student
  const saveStudent = (event) => {
    event.preventDefault();
    if (!validateFields()) return;

    addNewStudent(student).then((res) => {
      toast.info("student adding please wait...", {
        position: "top-right",
        autoClose: 1200,
      });

      setTimeout(() => {
        toast.dismiss();
        setStudent({
          id: "",
          firstName: "",
          middleName: "",
          lastName: "",
          //mobileNo: "",
          //address: 0,
          userName: "",
          email: "",
          password: "",
          guardianName: "",
          status: "",
          deptId: "",
        });


        toast.success("Student added.", { position: "top-right", autoClose: 1600 });
        modalRef.current.hide();
      }, 2000);

      setTimeout(() => {
        toast.dismiss();
        handleAll();
      }, 3500);
      // Append new student to the list
    }).catch((err) => {
      console.log("Error: " + err.response.data.message);
    })
  };

  // update student
  const updateStudent = (event) => {
    event.preventDefault();
    setIsUpdate(true);
    if (!validateFields()) return;
    // ✅ Only include password if user entered a new one
    const updatedStudent = { ...student };
    if (student.password && student.password.trim() !== '') {
      updatedStudent.password = student.password;
    }

    modifyStudent(student, student.id).then(response => {

      toast.info("student updating please wait.", {
        position: "top-right",
        autoClose: 1200,
      });

      setTimeout(() => {
        toast.dismiss();
        setStudent({
          id: "",
          firstName: "",
          middleName: "",
          lastName: "",
          //mobileNo: "",
          //address: 0,
          userName: "",
          email: "",
          password: "",
          guardianName: "",
          status: "",
          deptId: "",
        });
        toast.success("student updated.", { position: "top-right", autoClose: 1600 });

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

  //handle invalid
  const handleInvalid = (event) => {
    event.preventDefault();
    setSelected("Invalid");
    getStudentsByStatus('I').then((res) => {
      getStudentDetails(res);
    }).catch((err) => {
      console.log(err);
    });
  }

  const handleClose = () => {

    modalRef.current.hide();

  }

  return (
    <div className='row'>
      <div className='mx-auto col-12'>
        <div className="card mt-2">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
            {/* Left-aligned Notice Button */}
            <button color="primary" className="btn btn-primary" onClick={e => newStudent()}>
              <i className="bi bi-person-video3 fs-6 me-2"></i><span className='me-4'>Student</span>
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
            <div className='table-wrapper'>
              <table ref={tableRef} className="table display nowrap" id="datatable">
                <thead>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="studentModal" ref={modalElRef} aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{isUpdate ? "Update Student" : "Add New Student"}</h1>
              <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <input
                type='text'
                name="firstName"
                className={`form-control mb-3 ${validation.firstName ? 'ripple-invalid' : ''}`}
                placeholder='First Name'
                value={student.firstName}
                onChange={fieldChanged}
              />
              <input
                type='text'
                name="middleName"
                className='form-control mb-3'
                placeholder='Middle Name'
                value={student.middleName}
                onChange={fieldChanged}
              />
              <input
                type='text'
                name="lastName"
                className={`form-control mb-3 ${validation.lastName ? 'ripple-invalid' : ''}`}
                placeholder='Last Name'
                value={student.lastName}
                onChange={fieldChanged}
              />
              <input
                type='text'
                name="userName"
                className={`form-control mb-3 ${validation.userName ? 'ripple-invalid' : ''}`}
                placeholder='userName'
                value={student.userName}
                onChange={fieldChanged}
              />
              {/* <input
                type='text'
                name="mobileNo"
                className={`form-control mb-3 ${validation.mobileNo ? 'ripple-invalid' : ''}`}
                placeholder='mobile number'
                value={student.mobileNo}
                onChange={fieldChanged}
              /> 
              <textarea
                size="50"
                name="address"
                className={`form-control mb-3 ${validation.address ? 'ripple-invalid' : ''}`}
                placeholder='Address'
                value={student.address}
                onChange={fieldChanged}
              /> */}
              <input
                type='text'
                name="email"
                className={`form-control mb-3 ${validation.email ? 'ripple-invalid' : ''}`}
                placeholder='email'
                value={student.email}
                onChange={fieldChanged}
              />
              <input
                type={`${isUpdate ? "hidden" : "password"}`}
                name="password"
                className={`form-control mb-3 ${validation.password ? 'ripple-invalid' : ''}`}
                placeholder='password'
                value={student.password}
                onChange={fieldChanged}
              />

              <input
                type="text"
                name="guardianName"
                className={`form-control mb-3 ${validation.guardianName ? 'ripple-invalid' : ''}`}
                placeholder='guardianName'
                value={student.guardianName}
                onChange={fieldChanged}
              />

              <select
                name="status"
                className={`form-control mb-3 ${validation.status ? 'ripple-invalid' : ''}`}
                aria-label="Select Status"
                value={student.status}
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
                value={student.deptId || ""}
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
                <button type="button" className="btn btn-warning" onClick={e => updateStudent(e)}>Update</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={e => saveStudent(e)}>Save</button>
              )
              }
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageStudents;