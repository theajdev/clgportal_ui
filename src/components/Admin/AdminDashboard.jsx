import React from 'react'

const AdminDashboard = () => {
    return (
        <div>
            <div className='container' >
                <div className='row'>
                    <div className='col-md-3 mt-4'>
                        <div className="card text-bg-primary mb-3">
                            <div className="card-header">Header</div>
                            <div className="card-body">
                                <h5 className="card-title">Primary card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 mt-4'>
                        <div className="card text-bg-secondary mb-3">
                            <div className="card-header">Header</div>
                            <div className="card-body">
                                <h5 className="card-title">Secondary card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 mt-4'>
                        <div className="card text-bg-success mb-3">
                            <div className="card-header">Header</div>
                            <div className="card-body">
                                <h5 className="card-title">Success card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 mt-4'>
                        <div className="card text-bg-danger mb-3">
                            <div className="card-header">Header</div>
                            <div className="card-body">
                                <h5 className="card-title">Danger card title</h5>
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