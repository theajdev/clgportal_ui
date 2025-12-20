import React, { useCallback, useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import jszip from 'jszip';
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";
import "datatables.net-select-bs5/css/select.bootstrap5.min.css";
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import { addNewRole, deleteRole, getAllUserTypes, getUserTypesByStatus, UpdateRole } from '../../services/AdminServices/RoleService';
import { toast } from 'react-toastify';
import { checkTokenAndLogout } from '../../services/auth';
import "datatables.net-bs5";
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-responsive-bs5';

// Initialization for ES Users
const UserType = () => {
  window.JSZip = jszip;
  const [role, setRole] = useState({
    roleDisp: "",
    roleDesc: "",
    status: "",
    id: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [selected, setSelected] = useState("All");
  const [deleteInfo, setDeleteInfo] = useState({
    id: null,
    name: ""
  });
  const studModalElRef = useRef(null);
  const modalRef = useRef(null);
  const userTypeTableRef = useRef(null);      // ONLY for <table>
  const tableApiRef = useRef(null);      // ONLY for DataTable instance
  const statusRef = useRef("A");
  const deleteUserTypeModalRef = useRef(null);
  const deleteModalInstanceRef = useRef(null);

  const [validation, setValidation] = useState({
    roleDisp: false,
    roleDesc: false,
    status: false,
  });

  //field changed function
  const fieldChanged = (event) => {
    const { name, value } = event.target;
    setRole({ ...role, [event.target.name]: event.target.value });

    setRole(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when the user starts typing
    setValidation(prev => ({
      ...prev,
      [name]: false
    }));
  };

  const validateFields = () => {
    const errors = {};

    // Required fields
    if (!role.roleDesc.trim()) { errors.roleDesc = true; }
    if (!role.status.trim()) { errors.status = true; }

    // Update validation state

    setValidation(prev => ({ ...prev, ...errors }));

    return Object.keys(errors).length === 0;
  };

  //On page load
  useEffect(() => {
    document.title = "User Types - Admin";
    const el = studModalElRef.current;
    if (!el) return;

    // Create modal with static backdrop (cannot close by clicking outside)
    modalRef.current = new bootstrap.Modal(el, {
      backdrop: 'static',
      keyboard: false
    });

    checkTokenAndLogout();

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });


    const handleModalClose = () => {
      setValidation({
        roleDisp: false,
        roleDesc: false,
        status: false,
      });
    };

    el.addEventListener("hidden.bs.modal", handleModalClose);

    return () => {
      el.removeEventListener("hidden.bs.modal", handleModalClose);
    };
  }, []);

  useEffect(() => {
    if (tableApiRef.current) return;

    tableApiRef.current = $(userTypeTableRef.current).DataTable({
      ajax: function (_, callback) {
        $.blockUI({
          border: 'none',
          padding: '15px',
          backgroundColor: '#000',
          '-webkit-border-radius': '10px',
          '-moz-border-radius': '10px',
          opacity: .5,
          color: '#ffffff05',
          message: '<div class="blockui-message">Please Wait...<span class="spinner-border text-primary spinner-border-sm ms-1"></span></div>'
        });
        const api =
          statusRef.current === "A"
            ? getAllUserTypes()
            : getUserTypesByStatus(statusRef.current);

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
        leftColumns: 2
      },
      autoWidth: false,
      width: "100%",
      dom:
        "<'row mb-3'<'col-12 col-md-6 d-flex align-items-center justify-content-start mb-2 mb-md-0'f>" +
        "<'col-12 col-md-6 d-flex justify-content-start justify-content-md-end'B>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row mt-3'<'col-sm-5'i><'col-sm-7'p>>",

      buttons: [
        {
          extend: 'excelHtml5',
          title: 'User Types List',
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
                                <h5 class="mt-3 text-muted fw-bold">No User Types Available</h5>
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
          title: "User Types",
          className: "text-center",
          data: function (row, type, val, meta) {
            if (row.roleDisp === null || row.roleDisp === undefined || row.roleDisp === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.roleDisp;
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

    $(userTypeTableRef.current).on('click', '.edit-btn', function () {
      const data = tableApiRef.current.row($(this).parents('tr')).data();
      setIsUpdate(true);
      setRole({
        ...data,
        roleDesc: data.roleDisp,
      });
      modalRef.current.show();
    });

    // Handle Delete button click
    $(userTypeTableRef.current).on('click', '.delete-btn', function () {
      const id = $(this).data('id');
      const data = tableApiRef.current.row($(this).parents('tr')).data();

      const name = data.roleDisp;

      // ✅ Save into React state
      setDeleteInfo({ id, name });
      if (!deleteModalInstanceRef.current) {
        deleteModalInstanceRef.current = new bootstrap.Modal(
          deleteUserTypeModalRef.current,
          {
            backdrop: 'static',
            keyboard: false,
          }
        );
      }
      deleteModalInstanceRef.current.show();
    });
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  const deleteUserTypeId = (id) => {
    deleteRole(id).then(response => {
      toast.info("User type deleting please wait...", { position: "top-right", autoClose: 1200 });
      setTimeout(() => {
        toast.dismiss();
        setRole({
          roleDisp: "",
          roleDesc: "",
          status: "",
          id: "",
        });
        toast.success(response.message, { position: "top-right", autoClose: 1600 });
      }, 2000);

      setTimeout(() => {
        // ✅ CLOSE MODAL HERE
        deleteModalInstanceRef.current?.hide();
        setDeleteInfo({ id: null, name: "" });
        handleAll();
      }, 3500);
      return true;
    }).catch((error) => {
      console.log("error", JSON.stringify(error));
      toast.error("User type not deleted.", {
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
    setRole({
      roleDisp: "",
      roleDesc: "",
      status: "",
      id: "",
    });
    statusRef.current = "A";
    reloadTable();
  }, []);

  //handle valid
  const handleValid = (event) => {
    event.preventDefault();
    setSelected("Valid");
    statusRef.current = "V";
    reloadTable();

  };

  //handle invalid
  const handleInvalid = (event) => {
    event.preventDefault();
    setSelected("Invalid");
    statusRef.current = "I";
    reloadTable();
  }

  // add new user type
  const newUserType = () => {
    setIsUpdate(false);
    setRole({
      roleDisp: "",
      roleDesc: "",
      status: "",
      id: "",
    });
    modalRef.current.show();
  };

  // save Student
  const saveUserType = (event) => {
    event.preventDefault();
    if (!validateFields()) return;

    addNewRole(role).then((res) => {
      toast.info("User type adding please wait...", {
        position: "top-right",
        autoClose: 1200,
      });

      setTimeout(() => {
        toast.dismiss();
        setRole({
          roleDisp: "",
          roleDesc: "",
          status: "",
          id: "",
        });
        toast.success("User type added.", { position: "top-right", autoClose: 1600 });
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
  const updateUserType = (event) => {
    event.preventDefault();
    setIsUpdate(true);
    if (!validateFields()) return;

    UpdateRole(role, role.id).then(response => {

      toast.info("user type updating please wait.", {
        position: "top-right",
        autoClose: 1200,
      });

      setTimeout(() => {
        toast.dismiss();
        setRole({
          roleDisp: "",
          status: "",
          id: "",
        });
        toast.success("User type updated.", { position: "top-right", autoClose: 1600 });

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
          <div className="card mt-4 border-1 col-12">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              {/* Left-aligned Notice Button */}
              <button color="primary" className="btn btn-primary" onClick={e => newUserType()}>
                <i className="bi bi-person-circle fs-6 me-2 ms-2"></i> <span className='me-2'>User Type</span>
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
                <table className="table display nowrap" ref={userTypeTableRef}>
                  <thead>
                  </thead>
                  <tbody>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div >
      <div className="modal fade" ref={studModalElRef} id="userTypeModal" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{isUpdate ? "Update User Type" : "Add New User Type"}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input
                type='text'
                name="roleDesc"
                className={`form-control mb-3 ${validation.roleDesc ? 'ripple-invalid' : ''}`}
                placeholder='Enter User Type'
                value={role.roleDesc}
                onChange={fieldChanged}
              />
              <select
                name="status"
                className={`form-select mb-3 ${validation.status ? 'ripple-invalid' : ''}`}
                aria-label="Default select example"
                value={role.status}
                onChange={fieldChanged}
              >
                <option value="" disabled>Select</option>
                <option value="V">Valid</option>
                <option value="I">Invalid</option>
              </select>
            </div>
            <div className="modal-footer">

              {isUpdate ? (

                <button type="button" className="btn btn-warning" onClick={e => { updateUserType(e) }} data-mdb-ripple-init>Update</button>

              ) : (

                <button type="button" className="btn btn-primary" onClick={e => { saveUserType(e) }} data-mdb-ripple-init>Save</button>

              )

              }
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-mdb-ripple-init>Close</button>

            </div>
          </div>
        </div>
      </div>
      <div className="modal" tabIndex="-1" id="deleteTeacherModal" ref={deleteUserTypeModalRef}>
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
                  from the user types list.
                </p>
                <p className="text-muted mb-0">
                  This change cannot be reversed.
                </p></div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => deleteUserTypeId(deleteInfo.id)}>Yes</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserType;