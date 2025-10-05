import React from 'react'

const AdminDashboard = () => {
    return (
        <div>
            <div className='container' >
                <div className='row'>
                    <div className='col-md-3 mt-4'>
                        <div className="card border border-info mb-3">
                            <div className="card-header fw-bold fs-6">User Types <span class="badge text-bg-primary rounded-pill">14</span></div>
                            <div className="card-body text-primary">
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 mt-4'>
                        <div className="card border border-warning mb-3">
                            <div className="card-header fw-bold fs-6">Departments <span class="badge text-bg-warning rounded-pill">14</span></div>
                            <div className="card-body text-warning">
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 mt-4'>
                        <div className="card border border-success mb-3">
                            <div className="card-header fw-bold fs-6">Teachers <span class="badge text-bg-success rounded-pill">14</span></div>
                            <div className="card-body text-success">
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 mt-4'>
                        <div className="card border border-danger mb-3">
                            <div className="card-header fw-bold fs-6">Notices <span class="badge text-bg-danger rounded-pill">14</span></div>
                            <div className="card-body text-danger">
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </div>
    )
}

export default AdminDashboard