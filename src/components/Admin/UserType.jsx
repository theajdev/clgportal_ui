import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import { addNewRole, deleteRole, getAllRoles } from '../../services/RoleService';
import { toast } from 'react-toastify';
const UserType = () => {

  const [roles, setRoles] = useState([]);

  const [role, setRole] = useState({
    roleDesc: "",
    status: "",
  });

  useEffect(() => {

    getAllRoles().then(data => {
      setRoles(data);
      console.log(data);
    }).catch(error => {
      console.log("error", error);
      toast.error("Something went wrong.", {
        position: "top-right",
      });
    });

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  //field changed function
  const fieldChanged = (event) => {
    setRole({ ...role, [event.target.name]: event.target.value });
  };

  const editUserType = (e, row) => {
    e.preventDefault();

    // Open modal programmatically
    const modal = new bootstrap.Modal(document.getElementById('userTypeModal'));
    modal.show();
  }

  const saveUserType = (e) => {
    e.preventDefault();

    if (role.roleDesc.trim() === "") {
      toast.info("Role is required.", {
        position: 'top-right',
      });
      return;
    }

    if (role.status.trim() === "") {
      toast.info("Please select status of role.", {
        position: 'top-right',
      })
      return;
    }

    addNewRole(role).then(response => {

      toast.info("Role adding please wait...", {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => {
        toast.dismiss();
        setRole({
          roleDesc: "",
          status: "",
        });
        toast.success("Role added..", { position: "top-right", autoClose: 1200 });

      }, 1100);

      setTimeout(() => {
        toast.dismiss();
        window.location.reload(false);
      }, 2300);

      return true;
    }).catch((error) => {
      console.log("error", error);
      toast.error("Role not inserted.", {
        position: "top-right",
      });
      return false;
    });

  }

  const removeRole = (e, id) => {
    e.preventDefault();

    deleteRole(id).then(response => {

      toast.success("Role Deleting...", { position: "top-right", autoClose: 1000 });
      setTimeout(() => {
        toast.dismiss();
        window.location.reload(false);
      }, 1100);

      setRole({
        roleDesc: "",
        status: "",
      });
      return true;
    }).catch((error) => {
      console.log("error", error);
      toast.error("Role not deleted.", {
        position: "top-right",
      });
      return false;
    });
  }




  return (
    <div className='App-content'>
      <div className='container'>
        <div className='row'>
          <div className='mx-auto'>
            <div className="card mt-4 border-1">
              <div className="card-header">
                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#userTypeModal">User Type</button>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>User Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((row) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.roleDesc}</td>
                        <td><button className='btn btn-info me-2' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Edit" onClick={e => editUserType(e, row)}><i className="bi bi-pencil-square"></i></button> <button className='btn btn-danger' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete" onClick={e => removeRole(e, row.id)}><i className="bi bi-trash"></i></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="userTypeModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">New User Type</h1>
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
              <button type="button" className="btn btn-primary" onClick={e => saveUserType(e)}>Save User Type</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default UserType;