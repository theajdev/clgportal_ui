import React, { useEffect, useState } from 'react';
import Header from './Header';
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
const UserType = () => {

  const [data] = useState([
    { id: 1, name: 'John Doe', age: 28, email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', age: 34, email: 'jane.smith@example.com' },
    { id: 3, name: 'Sam Johnson', age: 22, email: 'sam.johnson@example.com' },
    { id: 4, name: 'Sara Brown', age: 29, email: 'sara.brown@example.com' },
  ]);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  return (
    <div className='ms-4'>
      <Header />
      <div className='container-fluid'>
        <div className='row'>
          <div className='mx-auto'>
            <div className="card mt-5">
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
                    {data.map((row) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.name}</td>
                        <td><button className='btn btn-info me-2' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Edit"><i className="bi bi-pencil-square"></i></button> <button className='btn btn-danger' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete"><i className="bi bi-trash"></i></button></td>
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
              <input type='text' className='form-control' placeholder='Enter User Type' />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">Save User Type</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserType;