import React from 'react';
import Header from './Header';

const UserType = () => {
  return (
    <div className='container'>
      <Header />
      <div className='row'>
        <div className='col-md-3 mt-4'>
          <div className="card border-primary mb-3">
            <div className="card-header">Header</div>
            <div className="card-body text-primary">
              <h5 className="card-title">Primary card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>
        <div className='col-md-3 mt-4'>
          <div className="card border-secondary mb-3">
            <div className="card-header">Header</div>
            <div className="card-body text-secondary">
              <h5 className="card-title">Secondary card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>
        <div className='col-md-3 mt-4'>
          <div className="card border-success mb-3">
            <div className="card-header">Header</div>
            <div className="card-body text-success">
              <h5 className="card-title">Success card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>
        <div className='col-md-3 mt-4'>
          <div className="card border-danger mb-3">
            <div className="card-header">Header</div>
            <div className="card-body text-danger">
              <h5 className="card-title">Danger card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>
      </div >
    </div>
  )
}

export default UserType;