import React from 'react'

const Spinner = () => (
  <div style={{ margin: 'auto', paddingTop: '236px', width: '100%' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
)

export default Spinner
