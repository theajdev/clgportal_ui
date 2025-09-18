import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import { addNewRole, deleteRole, getAllRoles, getRolesByStatus, UpdateRole } from '../../services/AdminServices/RoleService';
import { toast } from 'react-toastify';

const UserType = () => {
  const [role, setRole] = useState({
    roleDisp: "",
    roleDesc: "",
    status: "",
    id: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  // State htmlFor loading
  const [selected, setSelected] = useState("All");

  //On page load
  useEffect(() => {
    setIsLoading(true);
    getAllRoles().then(data => {
      setRoles(data);
      console.log(data);
    }).catch(error => {
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

  }, []);


  //field changed function
  const fieldChanged = (event) => {
    setRole({ ...role, [event.target.name]: event.target.value });
  };


  const handleAll = (event) => {
    setSelected("All");
    setRole({
      roleDisp: "",
      roleDesc: "",
      status: "",
      id: "",
    });
    getAllRoles().then(data => {
      setRoles(data);
    }).catch(error => {
      console.log("error", error);
      toast.error("Something went wrong.", {
        position: "top-right",
      });
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const handleValid = (event) => {
    setSelected("Valid");
    setRole({
      roleDisp: "",
      roleDesc: "",
      status: "",
      id: "",
    });
    getRolesByStatus('V').then(data => {
      setRoles(data);
    }).catch(error => {
      console.log("error", error);
      toast.error("Something went wrong.", {
        position: "top-right",
      });
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const handleInvalid = (event) => {
    setSelected("Invalid");
    setRole({
      roleDisp: "",
      roleDesc: "",
      status: "",
      id: "",
    });
    getRolesByStatus('I').then(data => {
      setRoles(data);
    }).catch(error => {
      console.log("error", error);
      toast.error("Something went wrong.", {
        position: "top-right",
      });
    }).finally(() => {
      setIsLoading(false);
    });
  }

  // handle edit button click
  const editUserType = (userType) => {
    setRole({
      roleDisp: userType.roleDisp,
      roleDesc: userType.roleDisp,
      status: userType.status,
      id: userType.id,
    });
    setIsUpdate(true);

    // Open the Bootstrap modal programmatically
    const modalElement = document.getElementById('userTypeModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  // handle new user type button click
  const newUserType = () => {
    setRole({
      roleDisp: "",
      roleDesc: "",
      status: "",
      id: "",
    });
    setIsUpdate(false);

    // Open the Bootstrap modal programmatically
    const modalElement = document.getElementById('userTypeModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  //add new user type
  const saveUserType = (e) => {
    e.preventDefault();

    if (role.roleDesc.trim() === "") {
      toast.info(<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <span>User type is required.</span>
      </div>,
        {
          position: 'top-right',
          ariaLabel: "User type is required.",
          icon: false,
        });
      return;
    }

    if (role.status.trim() === "") {
      toast.info(<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <span>Please select status</span>
      </div>, {
        position: "top-right",
        icon: false,
      })
      return;
    }

    addNewRole(role).then(response => {

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
        toast.success("User type added..", { position: "top-right", autoClose: 1600 });

      }, 2000);

      setTimeout(() => {
        toast.dismiss();
        window.location.reload(false);
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

  //update user type
  const updateUserType = (e) => {
    e.preventDefault();
    if (role.roleDesc.trim() === "") {
      toast.info(<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <span>User type is required.</span>
      </div>, {
        position: "top-right",
        icon: false,
      });
      return;
    }

    if (role.status.trim() === "") {
      toast.info(<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <span>Please select status</span>
      </div>, {
        position: "top-right",
        icon: false,
      })
      return;
    }

    UpdateRole(role, role.id).then(response => {

      toast.info("User type updating please wait...", {
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
        toast.success("User type Updated..", { position: "top-right", autoClose: 1600 });

      }, 2000);

      setTimeout(() => {
        toast.dismiss();
        window.location.reload(false);
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

  //handle delete user type
  const removeRole = (e, id, roleName) => {
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
        </svg><p><b>Are you sure you want to delete the user type '{roleName}'?</b></p><div className='d-flex p-2 justify-content-center'><button className='btn btn-outline-warning flex-row' onClick={() => {
          deleteRoleId(id);
          closeToast();
        }}>Yes</button>
          <button className='btn btn-outline-secondary ms-2 flex-row' onClick={() => {
            closeToast();
          }}>No</button></div></div>
    ), { position: "top-center", icon: false });

    const deleteRoleId = (id) => {
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
          toast.dismiss();
          window.location.reload(false);
        }, 3500);

        setRole({
          roleDisp: "",
          roleDesc: "",
          status: "",
          id: "",
        });
        return true;
      }).catch((error) => {
        // console.log("error", JSON.stringify(error));
        toast.error("User type not deleted.", {
          position: "top-right",
        });
        return false;
      });
    }

  }

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
    <div className='App-content' >
      <div className='container'>
        <div className='row'>
          <div className='mx-auto'>
            <div className="card mt-4 border-1">
              <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <button color="primary" className='btn btn-bd-primary me-2' onClick={e => { handleRipple(e); newUserType() }}>
                  User Type
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
                    <strong role="status">Pleae Wait...</strong>
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
                          <th>User Type</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!roles || roles.length === 0) ? (
                          <tr>
                            <td colSpan="3" className="text-center"><div className="text-muted fw-semibold" style={{ fontSize: "1.2rem", padding: "20px" }}>
                              <span role="img" aria-label="sad" style={{ fontSize: "2.5rem" }}>🤷🏻</span> No user types found
                            </div></td>
                          </tr>
                        ) : (

                          roles.map((row) => (
                            <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>{row.roleDisp}</td>
                              <td><button className='btn btn-info me-2' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Edit" onClick={e => { handleRipple(e); editUserType(row) }}><i className="bi bi-pencil-square"></i></button><button className='btn btn-danger' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete" onClick={e => { handleRipple(e); removeRole(e, row.id, row.roleDisp) }}><i className="bi bi-trash"></i></button></td>
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
      <div className="modal fade" id="userTypeModal" aria-labelledby="exampleModalLabel" aria-hidden="true" >
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
                className='form-control mb-3'
                placeholder='Enter User Type'
                value={role.roleDesc}
                onChange={fieldChanged}
              />
              <select
                name="status"
                className="form-select"
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

                <button type="button" className="btn btn-warning" onClick={e => { handleRipple(e); updateUserType(e) }}>Update</button>

              ) : (

                <button type="button" className="btn btn-bd-primary" onClick={e => { handleRipple(e); saveUserType(e) }}>Save</button>

              )

              }
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>

            </div>
          </div>
        </div>
      </div>

    </div >
  )
}

export default UserType;