import React from 'react';
import '../styles/messager.css';
export default props => (
    <div className="msgs-user" style={{ display: (props.message.length > 0) ? 'block' : 'none' }}>
        {props.message}
    </div>
);