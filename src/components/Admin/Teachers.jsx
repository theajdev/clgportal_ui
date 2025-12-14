import React, { useCallback, useEffect, useRef, useState } from 'react'
import $ from 'jquery';
import jszip from 'jszip';
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-fixedcolumns-bs5/css/fixedColumns.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";
import "datatables.net-select-bs5/css/select.bootstrap5.min.css";
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

  const tableTeacherRef = useRef();
  const getTeacherDetailsRef = useRef();
  const handleAllRef = useRef();
  const modalTeacherElRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    getAllCourses()
      .then((dept) => setDepts(dept))
      .catch((err) => console.log(err));
  }, []);

  const getTeacherDetails = useCallback((teachers) => {

    if (depts.length === 0) return;

    const tableEl = tableTeacherRef.current;

    // If table already exists → destroy it completely
    if ($.fn.dataTable.isDataTable(tableEl)) {
      $(tableEl).DataTable().clear().destroy();
      $(tableEl).empty(); // prevents duplicated headers
    }

    const dt = $(tableEl).DataTable({
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
            columns: [0, 1, 2, 3, 4, 5, 6],
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

        processing: `
                          <div className="text-center">
                            <strong role="status">Loading Teachers...</strong>
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
                            <h5 class="mt-3 text-muted fw-bold">No Teachers Available</h5>
                            <p class="text-secondary">Please adjust your filter or add a new teacher.</p>
                          </div>
                        `
      },

      data: teachers, // ✅ direct data assignment here
      order: [[1, 'asc']],
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
          data: function (row, type, val, meta) {
            if (row.deptId === null || row.deptId === undefined || row.deptId === '') {
              return '-'; // Replace blank with dash
            } else {
              let dept = null;
              depts.forEach((d) => {
                if (d.id === row.deptId) {
                  dept = d.deptDesc;
                };
              });
              return dept;
            }
          }
        }, {
          title: "Action",
          className: "text-center",
          data: function (row, type, val, meta) {
            return `<div class="dropdown-center">
  <button class="btn dropdown-toggle btn-success" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Action
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item btn edit-btn bg-warning text-white text-center" href="javascript:void(0);"  data-id="${row.id}"> <i class="bi bi-pencil-square me-2"></i> Edit</a></li>
    <li><a class="dropdown-item btn delete-btn bg-danger  text-white text-center" href="javascript:void(0)" data-id="${row}" ><i class="bi bi-trash me-2"></i> Delete</a></li>
    
  </ul>
</div>`;
          }
        }
      ],



    });

    // Inject dropdown HTML dynamically using departments list
    $('.my-custom-dropdown').html(`
        <select data-mdb-select-init id="deptFilter" class="form-select form-select-sm" style="width:180px;" >
          <option value="">All Departments</option>
          ${depts
        .map(d => `<option value="${d.deptDesc}">${d.deptDesc}</option>`)
        .join("")}
        </select>
      `);

    // Filtering Logic
    $('#deptFilter').on('change', function () {
      dt.column(9).search(this.value).draw(); // Change column index as needed
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
        setTeacher({
          ...rowData,
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
              deleteTeacherId(id);
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
              handleAllRef.current?.();
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
      });
  }, [depts]);


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

    getAllTeachers().then((res) => {
      getTeacherDetailsRef.current?.(res);
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
    getTeachersByStatus('V').then((res) => {
      getTeacherDetails(res);
    }).catch((err) => {
      console.log(err);
      toast.error("Something went wrong.", {
        position: "top-right",
      });
    });

  };



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
    getTeacherDetailsRef.current = getTeacherDetails;
    handleAllRef.current = handleAll;
    getAllTeachers().then((data) => {
      getTeacherDetails(data);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {


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
  }, [getTeacherDetails, handleAll]);

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


  //handle invalid
  const handleInvalid = (event) => {
    event.preventDefault();
    setSelected("Invalid");
    getTeachersByStatus('I').then((res) => {
      console.log(res);
      getTeacherDetails(res);
    }).catch((err) => {
      console.log(err);
    });
  }

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
              <div className=' table-wrapper'>
                <table className="table nowrap display" ref={tableTeacherRef}>
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
      </div>

    </>
  )
}

export default Teachers