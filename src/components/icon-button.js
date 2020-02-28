import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default (props)=>(
    <button className={props.cls} onClick={props.onClick}>
        <FontAwesomeIcon icon={props.icon} />
    </button>
)