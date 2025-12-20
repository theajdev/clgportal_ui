import React, { useCallback, useEffect, useRef, useState } from 'react'
import $ from 'jquery';
import jszip from 'jszip';
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";
import "datatables.net-select-bs5/css/select.bootstrap5.min.css";
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import { addCourse, deleteCourse, getAllCourses, getCoursesByStatus, updateDepartment } from '../../services/AdminServices/DeptService';
import { toast } from 'react-toastify';
import { checkTokenAndLogout } from '../../services/auth';
import "datatables.net-bs5";
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-responsive-bs5';

const Cousres = () => {
  //declarations
  window.JSZip = jszip;
  const [course, setCourse] = useState({
    id: '',
    deptDesc: '',
    status: '',
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [selected, setSelected] = useState("All");
  const statusRef = useRef("A");
  const courseModalElRef = useRef(null);
  const modalRef = useRef(null);
  const [deleteInfo, setDeleteInfo] = useState({
    id: null,
    name: ""
  });
  const deleteModalRef = useRef(null);
  const deleteModalInstanceRef = useRef(null);

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

  const courseTableDomRef = useRef(null);      // ONLY for <table>
  const tableApiRef = useRef(null);      // ONLY for DataTable instance

  // on page load
  useEffect(() => {
    document.title = "Department - Admin";
    checkTokenAndLogout();
    const el = courseModalElRef.current;
    if (!el) return;
    // Create modal with static backdrop (cannot close by clicking outside)
    modalRef.current = new bootstrap.Modal(el, {
      backdrop: 'static',
      keyboard: false
    });

    const handleModalClose = () => {
      // Clear validation errors
      setValidation({
        deptDesc: false,
        status: false,
      });
    };

    el.addEventListener("hidden.bs.modal", handleModalClose);

    return () => {
      el.removeEventListener("hidden.bs.modal", handleModalClose);
    };

  }, []);


  useEffect((data) => {

    if (tableApiRef.current) return;

    tableApiRef.current = $(courseTableDomRef.current).DataTable({
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
            ? getAllCourses()
            : getCoursesByStatus(statusRef.current);

        api.then(res => {
          callback({ data: res });
          $.unblockUI();
        }).catch(() => {
          $.unblockUI();
        });
      },
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
          title: 'Departments List',
          text: '<i class="bi bi-file-earmark-excel"></i> Excel',
          className: 'btn btn-success btn-sm',
          exportOptions: {
            columns: [0, 1],
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
            columns: [0, 1],
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
                                  <h5 class="mt-3 text-muted fw-bold">No Courses Available</h5>
                                  <p class="text-secondary">Please adjust your filter or add a new user types.</p>
                     </div>`
      },
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
          title: "Courses",
          className: "text-center",
          data: function (row, type, val, meta) {
            if (row.deptDesc === null || row.deptDesc === undefined || row.deptDesc === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.deptDesc;
            }
          }

        }, {
          title: "Actions",
          className: "text-center",
          data: function (row, type, val, meta) {
            return `<div class="dropdown-center">
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

    $(courseTableDomRef.current).on('click', '.edit-btn', function () {
      const data = tableApiRef.current.row($(this).parents('tr')).data();
      setIsUpdate(true);
      setCourse({
        ...data
      });
      modalRef.current.show();
    });

    $(courseTableDomRef.current).on('click', '.delete-btn', function () {
      const id = $(this).data('id');
      const data = tableApiRef.current.row($(this).parents('tr')).data();
      const name = data.deptDesc;
      setDeleteInfo({ id, name });
      if (!deleteModalInstanceRef.current) {
        deleteModalInstanceRef.current = new bootstrap.Modal(
          deleteModalRef.current,
          {
            backdrop: 'static',
            keyboard: false,
          }
        );
      }

      deleteModalInstanceRef.current.show();
    });
  }, []);

  const deleteCourseId = (id) => {
    deleteCourse(id).then(response => {
      toast.info("Course deleting please wait...", { position: "top-right", autoClose: 1200 });
      setTimeout(() => {
        toast.dismiss();
        setCourse({
          id: '',
          deptDesc: '',
          status: '',
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
      toast.error("Course not deleted.", {
        position: "top-right",
      });
      return false;
    });
  };

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
    setCourse({
      id: '',
      deptDesc: '',
      status: '',
    });
    statusRef.current = "A";
    reloadTable();
  }, []);

  //handle invalid
  const handleInvalid = (event) => {
    event.preventDefault();
    setSelected("Invalid");
    statusRef.current = "I";
    reloadTable();
  }

  //handle valid
  const handleValid = (event) => {
    event.preventDefault();
    setSelected("Valid");
    statusRef.current = "V";
    reloadTable();
  };

  // add new Course
  const newCourse = () => {
    setIsUpdate(false);
    setCourse({
      id: '',
      deptDesc: '',
      status: '',
    });
    modalRef.current.show();
  };

  // save Student
  const saveCourse = (event) => {
    event.preventDefault();
    if (!validateFields()) return;

    addCourse(course).then((res) => {
      toast.info("Course adding please wait...", {
        position: "top-right",
        autoClose: 1200,
      });

      setTimeout(() => {
        toast.dismiss();
        setCourse({
          id: '',
          deptDesc: '',
          status: '',
        });

        toast.success("Course added.", { position: "top-right", autoClose: 1600 });
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
  const updateCourse = (event) => {
    event.preventDefault();
    setIsUpdate(true);
    if (!validateFields()) return;

    updateDepartment(course, course.id).then(response => {
      toast.info("Course updating please wait.", {
        position: "top-right",
        autoClose: 1200,
      });

      setTimeout(() => {
        toast.dismiss();
        setCourse({
          id: '',
          deptDesc: '',
          status: '',
        });

        toast.success("Course updated.", { position: "top-right", autoClose: 1600 });

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
        <div className='mx-auto'>
          <div className="card mt-4">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              {/* Left-aligned Notice Button */}
              <button color="primary" className="btn btn-primary" onClick={e => newCourse()}>
                <i className="bi bi-book-fill fs-6 me-2 ms-2"></i> <span className='me-2'>Department</span>
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
                <table className="table table-responsive" ref={courseTableDomRef}>
                  <thead></thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="coursesModal" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={courseModalElRef}>
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
                <button type="button" className="btn btn-warning" onClick={e => { updateCourse(e) }}>Update</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={e => { saveCourse(e) }}>Save</button>
              )
              }

              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" tabIndex="-1" id="deleteCourseModal" ref={deleteModalRef}>
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
                  from the course list.
                </p>
                <p className="text-muted mb-0">
                  This change cannot be reversed.
                </p></div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => deleteCourseId(deleteInfo.id)}>Yes</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default Cousres