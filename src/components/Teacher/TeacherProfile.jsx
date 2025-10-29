import React, { useEffect, useState } from 'react'
import { teacherProfile } from '../../services/TeacherService/ProfileService';
import { toast } from 'react-toastify';

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState({
    id: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    profilePic: '',
    username: '',
    password: '',
    status: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);  // State htmlFor loading
  const [validation, setValidation] = useState({
    firstName: false,
    lastName: false,
    email: false,
    username: false,
    password: false,
    status: false
  });


  const validateFields = () => {
    const errors = {};

    if (!teacher.firstName.trim()) { errors.firstName = true; }
    if (!teacher.lastName.trim()) { errors.lastName = true; }
    if (!teacher.username.trim()) { errors.usernamer = true; }
    if (!teacher.email.trim()) { errors.email = true; }
    if (!teacher.password.trim()) { errors.password = true; }
    if (!teacher.status.trim()) { errors.status = true; }


    setValidation(prev => ({ ...prev, ...errors }));

    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    setIsLoading(true);
    const id = sessionStorage.getItem("userId");
    teacherProfile(id).then((res) => {
      console.log(res);
      setTeacher(res);
    }).catch((err) => {
      console.log(err);
      setIsLoading(false);
      toast.error("Something went wrong.", {
        position: "top-right",
        autoClose: 1000
      });
      return false;

    });
  }, []);

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
  }

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateFields()) return;
  };

  return (
    <div>
      <section>
        <div className="main-body">
          <div className="row">
            {/* Left Section */}
            <div className="col-lg-4">
              <div className="card" style={{ display: imgLoading ? 'none' : 'block' }} onLoad={() => setImgLoading(false)}>
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    {imgLoading && (
                      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}

                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar6.png"
                      alt="Admin"
                      className="rounded-circle p-1 bg-primary"
                      width="110"
                      style={{ display: imgLoading ? 'none' : 'block' }}
                      onLoad={() => setImgLoading(false)}
                      onError={() => setImgLoading(false)} // hide loader if error occurs
                    />
                    <div className="mt-3">
                      <h4>{teacher.firstName}&nbsp;{teacher.lastName}</h4>
                      <p className="text-secondary mb-1">Full Stack Developer</p>
                      <p className="text-muted font-size-sm">Bay Area, San Francisco, CA</p>
                      <button className="btn btn-primary" onClick={handleToggleEdit}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </button>
                    </div>
                  </div>
                  <hr className="my-4" />
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-lg-8 main-body">
              <div className="card" style={{ display: imgLoading ? 'none' : 'block' }} onLoad={() => setImgLoading(false)}>
                <div className="card-body">
                  {/* Full Name */}
                  <div className="row mb-3">
                    <div className="col-sm-3">{
                      <h6 className="mb-0">First name</h6>
                    }
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {isEditing ? (
                        <input type="text" className={`form-control ${validation.firstName ? 'ripple-invalid' : ''}`} value={teacher.firstName} onChange={fieldChanged} name="firstName" />

                      ) : (
                        <p className="mb-0">
                          {teacher.firstName === ""
                            ? `-`
                            : teacher.firstName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">{
                      <h6 className="mb-0">Middle Name</h6>
                    }
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {isEditing ? (
                        <input type="text" className={`form-control ${validation.middleName ? 'ripple-invalid' : ''}`} value={teacher.middleName} onChange={fieldChanged} name="middleName" />
                      ) : (
                        <p className="mb-0">
                          {teacher.middleName === ""
                            ? `-`
                            : teacher.middleName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">{
                      <h6 className="mb-0">Last name</h6>
                    }
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {isEditing ? (
                        <input type="text" className={`form-control ${validation.lastName ? 'ripple-invalid' : ''}`} value={teacher.lastName} onChange={fieldChanged} name="lastName" />

                      ) : (
                        <p className="mb-0">
                          {teacher.lastName === ""
                            ? `-`
                            : teacher.lastName}
                        </p>
                      )}
                    </div>
                  </div>


                  {/* Email */}
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Email</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {isEditing ? (
                        <input type="email" className={`form-control ${validation.email ? 'ripple-invalid' : ''}`} value={teacher.email} onChange={fieldChanged} name="email" />
                      ) : (
                        <p className="mb-0">
                          {teacher.email === ""
                            ? `-`
                            : teacher.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Mobile</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {isEditing ? (
                        <input type="text" className="form-control" defaultValue="(320) 380-4539" />
                      ) : (
                        <p className="mb-0">(320) 380-4539</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Address</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Bay Area, San Francisco, CA"
                        />
                      ) : (
                        <p className="mb-0">Bay Area, San Francisco, CA</p>
                      )}
                    </div>
                  </div>

                  <div className='row mb-3'>
                    <div className='col-sm-3'><h6 className='mb-0'>Status</h6></div>
                    <div className='col-sm-9 text-secondary'>
                      {isEditing ? (
                        <select
                          name="status"
                          className={`form-select ${validation.status ? 'ripple-invalid' : ''}`}
                          aria-label="Default select example"
                          value={teacher.status}
                          onChange={fieldChanged}
                        >
                          <option value="" disabled>Select</option>
                          <option value="V">Valid</option>
                          <option value="I">Invalid</option>
                        </select>
                      ) : (
                        <p className="mb-0">
                          {teacher.status === ""
                            ? `-`
                            : teacher.status}
                        </p>
                      )}</div>
                  </div>

                  {/* Save Button (only show in edit mode) */}
                  {isEditing && (
                    <div className="row">
                      <div className="col-sm-3"></div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          type="button"
                          className="btn btn-primary px-4"
                          value="Save Changes"
                          onClick={e => { handleSubmit(e) }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div >
      </section >
    </div >
  )
}

export default TeacherProfile