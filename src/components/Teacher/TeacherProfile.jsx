import React, { useState } from 'react'

const TeacherProfile = () => {

  const [isEditing, setIsEditing] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <section>
        <div className="main-body">
          <div className="row">
            {/* Left Section */}
            <div className="col-lg-4">
              <div className="card">
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
                      <h4>John Doe</h4>
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
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  {/* Full Name */}
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Full Name</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {isEditing ? (
                        <input type="text" className="form-control" defaultValue="John Doe" />
                      ) : (
                        <p className="mb-0">John Doe</p>
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
                        <input type="text" className="form-control" defaultValue="john@example.com" />
                      ) : (
                        <p className="mb-0">john@example.com</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Phone</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {isEditing ? (
                        <input type="text" className="form-control" defaultValue="(239) 816-9029" />
                      ) : (
                        <p className="mb-0">(239) 816-9029</p>
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

                  {/* Save Button (only show in edit mode) */}
                  {isEditing && (
                    <div className="row">
                      <div className="col-sm-3"></div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          type="button"
                          className="btn btn-primary px-4"
                          value="Save Changes"
                          onClick={handleToggleEdit}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TeacherProfile