import React, { useEffect, useState } from 'react'
import { getTeacherProfile, getTeacherProfileImage, updateTeacherProfile, uploadTeacherProfile } from '../../services/TeacherService/ProfileService';
import { toast } from 'react-toastify';

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState({
    id: '',
    firstName: '',
    middleName: '',
    lastName: '',
    mobileNo: '',
    address: '',
    email: '',
    profilePic: '',
    profileFile: '',
    username: '',
    password: '',
    status: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);  // State htmlFor loading
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);// object URL for preview
  const [meta, setMeta] = useState(null);           // { name, size, type, width, height }
  const [profileImage, setProfileImage] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [validation, setValidation] = useState({
    firstName: false,
    lastName: false,
    email: false,
    address: false,
    mobileNo: false,
    username: false,
    password: false,
    status: false
  });


  const validateFields = () => {
    const errors = {};

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

    if (!teacher.status.trim()) { errors.status = true; }


    setValidation(prev => ({ ...prev, ...errors }));

    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    setIsLoading(true);
    const id = sessionStorage.getItem("userId");

    getTeacherProfile(id).then((res) => {
      setTeacher({
        ...res,
        password: '',  // <-- important: don't show hashed password
      });
      // Now try to get the image
      return getTeacherProfileImage(res.profilePic);
    }).then((res) => {
      // If your backend returns a blob (binary image)
      const imageUrl = URL.createObjectURL(res);
      setProfileImage(imageUrl);
    }).catch((err) => {
      console.log(err);
      setIsLoading(false);
      setProfileImage(null);
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

  //Handling file change event
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setImage(file);

    // Generate preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Get image metadata
    const img = new Image();
    img.onload = () => {
      setMeta({
        name: file.name,
        size: file.size,
        type: file.type,
        width: img.width,
        height: img.height
      });
    };
    img.src = objectUrl;

  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (event) => {
    setIsUpdate(true);
    event.preventDefault();
    if (!validateFields()) return;
    const teacherId = sessionStorage.getItem("userId");
    // ✅ Only include password if user entered a new one
    const updatedTeacher = { ...teacher };
    if (teacher.password && teacher.password.trim() !== '') {
      updatedTeacher.password = teacher.password;
    }
    updateTeacherProfile(teacher, teacherId).then((res) => {
      console.log(res);
      uploadTeacherProfile(image, teacherId).then((res) => {
        console.log(res);
        toast.success("Profile Image Uploaded!", {
          position: "top-right",
          autoClose: 1000
        });
        // Refresh the image
        getTeacherProfileImage(res.profilePic)
          .then((res) => {
            const imageUrl = URL.createObjectURL(res);
            setProfileImage(imageUrl);
          });
      }).catch((err) => {
        console.log(err);

        toast.error("Image Upload Failed.", {
          position: "top-right",
          autoClose: 1000
        });
        return false;
      });

      toast.success("Teacher Updated !", {
        position: "top-right",
        autoClose: 1000
      });
      setIsEditing(false);
    }).catch((err) => {
      console.log(err);
      toast.error("Teacher not updated.", {
        position: "top-right",
        autoClose: 1000
      });
      return false;
    });
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
                      src={profileImage || "https://bootdey.com/img/Content/avatar/avatar6.png"}
                      alt="Admin"
                      title={teacher.firstName + ' ' + teacher.lastName}
                      className="rounded-circle p-1 bg-primary"
                      width="110"
                      height="110"
                      onLoad={() => setImgLoading(false)}
                      onError={() => {
                        setImgLoading(false);
                        setProfileImage(null); // fallback to default if error occurs
                      }}
                    />
                    {/* <!-- Label acts as the clickable pencil icon --> */}
                    <label htmlFor="image" className="upload-label" title="Upload File">
                      <i className="bi bi-pencil"></i>
                    </label>

                    {/* <!-- Hidden file input --> */}
                    <input type="file" id="image" onChange={handleFileChange} name="image"></input>
                    <div className="mt-3">
                      <h4>{teacher.firstName}&nbsp;{teacher.lastName}</h4>
                      <p className="text-secondary mb-1">Full Stack Developer</p>
                      <p className="text-muted font-size-sm">{teacher.address}</p>
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
                        <input type="text" className="form-control" value={teacher.mobileNo} name="mobileNo" onChange={fieldChanged} />
                      ) : (
                        <p className="mb-0">{teacher.mobileNo === ""
                          ? `-`
                          : teacher.mobileNo}</p>
                      )}
                    </div>
                  </div>

                  {/* Username */}
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Username</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {isEditing ? (
                        <input type="text" className="form-control" name="username" value={teacher.username} onChange={fieldChanged} />
                      ) : (
                        <p className="mb-0">{teacher.username === ""
                          ? `-`
                          : teacher.username}</p>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Password</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {isEditing ? (
                        <input type="password" className="form-control" name="password" value={teacher.password} onChange={fieldChanged} />
                      ) : (
                        <p className="mb-0">{teacher.password === ""
                          ? `-`
                          : teacher.password}</p>
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
                          value={teacher.address}
                          name='address'
                          onChange={fieldChanged}
                        />
                      ) : (
                        <p className="mb-0">{teacher.address === ""
                          ? `-`
                          : teacher.address}</p>
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