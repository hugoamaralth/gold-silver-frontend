import React from 'react';
import '../styles/loader.css';

export default props => (
    <div className={'loader' + ((props.isLoading) ? ' active' : '')}>
        <div>
            <img alt="" src="https://www.cruiselounge.co.uk/wp-content/themes/Enfold-child/images/loader.gif" />
        </div>
    </div>
)