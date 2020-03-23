import React from 'react';

export default () => {
    localStorage.removeItem("token");
    window.location = "/";
    return (<div></div>);
}