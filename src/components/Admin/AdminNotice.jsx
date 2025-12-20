import React, { useEffect, useRef, useState } from 'react'
import $ from 'jquery';
import jszip from 'jszip';
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";
import "datatables.net-select-bs5/css/select.bootstrap5.min.css";
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import { createNotice, deleteNotice, getAllNotices, getNoticeByStatus, updateNotice } from '../../services/AdminServices/NoticeService';
import { toast } from 'react-toastify';
import { getAllCourses } from '../../services/AdminServices/DeptService';
import { checkTokenAndLogout } from '../../services/auth';
import dayjs from 'dayjs';
import "datatables.net-bs5";
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-responsive-bs5';
const AdminNotice = () => {
  window.JSZip = jszip;
  const [notice, setNotice] = useState({
    id: '',
    noticeTitle: '',
    noticeDesc: '',
    deptId: [],
    postedOn: '',
    status: ''
  });

  const input = notice.postedOn;
  const formatted = dayjs(input).format("DD-MM-YYYY HH:mm:ss");
  const [depts, setDepts] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selected, setSelected] = useState("All");
  const [deleteInfo, setDeleteInfo] = useState({
    id: null,
    name: ""
  });
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
    if (!notice.status || notice.status.trim() === "") { errors.status = true; } else if (!notice.deptId || notice.deptId.length === 0) { errors.deptId = true; }

    setValidation(prev => ({ ...prev, ...errors }));

    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

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


  const modalAdminNoticeElRef = useRef(null);
  const modalViewNoticeElRef = useRef(null);
  const modalRef = useRef(null);
  const modalViewRef = useRef(null);
  const statusRef = useRef("A");
  const tableDomRef = useRef(null);      // ONLY for <table>
  const tableApiRef = useRef(null);      // ONLY for DataTable instance
  const deleteNoticeModalRef = useRef(null);
  const deleteModalInstanceRef = useRef(null);
  const deptMapRef = useRef({});

  useEffect(() => {
    document.title = "Notice - Admin";
    const el = modalAdminNoticeElRef.current;
    if (!el) return;

    // Create modal with static backdrop (cannot close by clicking outside)
    if (!modalRef.current) {
      modalRef.current = new bootstrap.Modal(el, {
        backdrop: 'static',
        keyboard: false
      });
    }

    const viewEl = modalViewNoticeElRef.current;
    if (!viewEl) return;
    if (!modalViewRef.current) {
      modalViewRef.current = new bootstrap.Modal(viewEl, {
        backdrop: 'static',
        keyboard: false
      });
    }

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
        noticeTitle: false,
        noticeDesc: false,
        deptId: false,
        status: false,
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
            ? getAllNotices()
            : getNoticeByStatus(statusRef.current);

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
          title: 'Notice List',
          text: '<i class="bi bi-file-earmark-excel"></i> Excel',
          className: 'btn btn-success btn-sm',
          exportOptions: {
            columns: [0, 1, 2],
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
            columns: [0, 1, 2],
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
        emptyTable: `
                            <div class="text-center py-4">
                              <i class="bi bi-database-x text-danger" style="font-size: 2.5rem;"></i>
                              <h5 class="mt-3 text-muted fw-bold">No Any Notice Available</h5>
                              <p class="text-secondary">Please adjust your filter or add a new teacher.</p>
                            </div>
                          `
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
          title: "Title",
          className: "text-center",
          data: function (row, type, val, meta) {
            if (row.noticeTitle === null || row.noticeTitle === undefined || row.noticeTitle === '') {
              return '-'; // Replace blank with dash
            } else {
              return row.noticeTitle;
            }
          }
        },
        {
          title: "Departments",
          className: "text-center",
          data: row => {
            if (!Array.isArray(row.deptId) || row.deptId.length === 0) {
              return "-";
            }

            return row.deptId
              .map(id => deptMapRef.current[String(id)])
              .filter(Boolean)
              .join(", ");
          }
        },
        {
          title: "Actions",
          className: "text-center",
          data: function (row, type, val, meta) {
            console.log("row", row);
            return `<div class="dropdown">
                      <button class="btn dropdown-toggle btn-outline-primary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Action
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item view-btn text-center" href="javascript:void(0);"  data-id="${row.id}">View <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye text-info" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                  </svg></a></li>
                        <li><a class="dropdown-item edit-btn text-center" href="javascript:void(0);"  data-id="${row.id}">Edit <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil text-warning" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                  </svg></a></li>
                        <li><a class="dropdown-item delete-btn text-center" href="javascript:void(0);" data-id="${row.id}" >Delete <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3-fill text-danger" viewBox="0 0 16 16">
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                  </svg></a></li>
                      </ul>
                    </div>`;
          }
        }
      ],

    });

    $(tableDomRef.current).on('click', '.view-btn', function () {
      const data = tableApiRef.current.row($(this).parents('tr')).data();

      setIsUpdate(false);

      setNotice({
        ...data,
      });
      modalViewRef.current.show();
    });

    // Handle Edit button click
    $(tableDomRef.current).on('click', '.edit-btn', function () {
      const data = tableApiRef.current.row($(this).parents('tr')).data();
      setIsUpdate(true);
      setNotice({
        ...data,
      });
      modalRef.current.show();
    });

    // Handle Delete button click
    $(tableDomRef.current).on('click', '.delete-btn', function () {
      const id = $(this).data('id');
      const data = tableApiRef.current.row($(this).parents('tr')).data();
      const name = data.noticeTitle;
      // ✅ Save into React state
      setDeleteInfo({ id, name });
      if (!deleteModalInstanceRef.current) {
        deleteModalInstanceRef.current = new bootstrap.Modal(
          deleteNoticeModalRef.current,
          {
            backdrop: 'static',
            keyboard: false,
          }
        );
      }

      deleteModalInstanceRef.current.show();
    });
  }, [depts]);

  const deleteNoticeId = (id) => {
    deleteNotice(id).then(response => {
      toast.info("Notice deleting please wait...", { position: "top-right", autoClose: 1200 });
      setTimeout(() => {
        toast.dismiss();
        setNotice({
          id: '',
          noticeTitle: '',
          noticeDesc: '',
          deptId: [],
          status: ''
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

      setNotice({
        id: '',
        noticeTitle: '',
        noticeDesc: '',
        deptId: [],
        status: ''
      });
      return true;
    }).catch((error) => {
      // console.log("error", JSON.stringify(error));
      toast.error("Notice not deleted.", {
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
  const handleAll = (event) => {
    setSelected("All");
    setNotice({
      id: '',
      noticeTitle: '',
      noticeDesc: '',
      deptId: [],
      status: ''
    });
    statusRef.current = "A";
    reloadTable();
  };

  //handle valid
  const handleValid = (event) => {
    event.preventDefault();
    setSelected("Valid");
    setNotice({
      id: '',
      noticeTitle: '',
      noticeDesc: '',
      deptId: [],
      status: ''
    });
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
    modalRef.current.show();
  };

  const editNotice = (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    updateNotice(notice.id, notice).then((data) => {
      toast.success("Notice updated.", { position: "top-right", autoClose: 1600 });
      modalRef.current.hide();
      setTimeout(() => {
        toast.dismiss();
        handleAll();
      }, 2000);
    }).catch((error) => {
      console.log("error", error);
      toast.error("Something went wrong.", {
        position: "top-right",
      });
    });
    return true;
  }

  const sendNotice = (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    createNotice(notice).then(response => {
      toast.info("Notice sending please wait...", {
        position: "top-right",
        autoClose: 1200,
      });

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
        modalRef.current.hide();
      }, 2000);

      setTimeout(() => {
        toast.dismiss();
        handleAll();
      }, 3500);

      return true;

    }).catch((error) => {
      console.log(error);
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

  return (
    <>

      <div className='mx-auto'>
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
            {/* Left-aligned Notice Button */}
            <button color="primary" className="btn btn-primary" onClick={e => newNotice()}>
              <i className="bi bi-pencil-fill fs-6 me-2 ms-2"></i> <span className='me-2'>Notice</span>
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
              <table className="table nowrap display" ref={tableDomRef}>
                <thead>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="adminNoticeModal" ref={modalAdminNoticeElRef} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{isUpdate ? "Update notice" : "Add new notice"}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input type='text' className={`form-control mb-3 ${validation.noticeTitle ? 'ripple-invalid' : ''}`} placeholder='Notice title'
                value={notice.noticeTitle}
                onChange={handleChange} name='noticeTitle' />

              <input type='text' className={`form-control mb-3 ${validation.noticeDesc ? 'ripple-invalid' : ''}`} placeholder='Notice'
                value={notice.noticeDesc}
                onChange={handleChange} name='noticeDesc' />

              <div className="dropdown mb-3">
                <button
                  className={`btn dropdown-toggle w-100 ${validation.deptId ? 'ripple-invalid' : 'btn-outline-secondary'}`}
                  type="button"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                  aria-expanded="false"
                >
                  {notice.deptId.length === 0
                    ? "Select Departments"
                    : notice.deptId.length === depts.length
                      ? "All Departments"
                      : depts
                        .filter(d => notice.deptId.includes(d.id))
                        .map(d => d.deptDesc)
                        .join(", ")
                  }
                </button>
                <ul className="dropdown-menu p-3 w-100">
                  {/* Select All */}
                  <li>
                    <div className="form-check">
                      <input
                        name='deptId'
                        className="form-check-input"
                        type="checkbox"
                        id="selectAll"
                        value="all"
                        checked={notice.deptId.length === depts.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNotice(prev => ({ ...prev, deptId: depts.map(d => d.id) }));
                          } else {
                            setNotice(prev => ({ ...prev, deptId: [] }));
                          }
                          // Reset validation error when user interacts
                          setValidation(prev => ({
                            ...prev,
                            deptId: false
                          }));
                        }}
                      />
                      <label className="form-check-label fw-bold" htmlFor="selectAll">
                        Select All
                      </label>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>

                  {/* All departments dynamically */}
                  {depts.map((dept) => (
                    <li key={dept.id}>
                      <div className="form-check">
                        <input
                          className="form-check-input item-checkbox"
                          type="checkbox"
                          value={dept.id}
                          id={`dept-${dept.id}`}
                          checked={notice.deptId.includes(dept.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNotice(prev => ({
                                ...prev,
                                deptId: [...prev.deptId, dept.id]
                              }));
                            } else {
                              setNotice(prev => ({
                                ...prev,
                                deptId: prev.deptId.filter(id => id !== dept.id)
                              }));
                            }
                            // Reset validation error when user interacts
                            setValidation(prev => ({
                              ...prev,
                              deptId: false
                            }));
                          }}
                        />
                        <label className="form-check-label" htmlFor={`dept-${dept.id}`}>
                          {dept.deptDesc}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
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
                <button type="button" className="btn btn-warning" onClick={e => { editNotice(e) }}>Update</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={e => { sendNotice(e) }}>Save</button>
              )
              }
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="ViewNotice" ref={modalViewNoticeElRef} tabIndex="-1" aria-labelledby="ViewNoticeLable" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title fs-2 d-flex" id="ViewNoticeLable"><svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="currentColor" className="bi bi-megaphone me-1" viewBox="0 0 16 16">
                <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z" />
              </svg><p className='fw-bold text-primary'>N</p><p className='fw-bold text-warning'>o</p><p className='fw-bold text-danger'>t</p><p className='fw-bold text-success'>i</p><p className='fw-bold text-info'>c</p><p className='fw-bold text-secondary'>e</p></h4>

              <span className='ms-auto'> {formatted}</span>
              <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>

            </div>
            <div className="modal-body">
              <section className="pb-4 mt-4">
                <div className="border rounded-5">
                  <section className="w-100 p-4 pb-4 d-flex justify-content-center">
                    <div style={{ "width": "22rem" }}>
                      <div className="text-center mb-4">
                        <h3 className="fw-bold">{notice.noticeTitle}</h3>
                      </div>
                      <p className="mb-4">{notice.noticeDesc}</p>
                      <div className="d-flex justify-content-between">
                        <p className=" mb-0">Status: {notice.status === 'V' ? (<span className="badge bg-success">Valid</span>) : (<span className="badge bg-danger">In-valid</span>)}</p>
                        <p className=" mb-0">Departments: {
                          Array.isArray(notice.deptId)
                            ? notice.deptId.map((id) => {
                              const dept = depts.find(d => d.id === id);
                              return dept ? dept.deptDesc : id;
                            }).join(', ')
                            : (() => {
                              const dept = depts.find(d => d.id === notice.deptId);
                              return dept ? dept.deptDesc : notice.deptId;
                            })()
                        }</p>
                      </div>
                    </div>
                  </section>
                </div>
              </section>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" tabIndex="-1" id="deleteTeacherModal" ref={deleteNoticeModalRef}>
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
              <button type="button" className="btn btn-primary" onClick={() => deleteNoticeId(deleteInfo.id)}>Yes</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminNotice