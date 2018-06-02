import React from 'react';
import { CircularProgress } from 'material-ui';

export const showCircullarProgress = () => {
    return (
        <div className="CircularLoaderContainer">
            <CircularProgress size={60} thickness={7} className="CircularLoader"/>
        </div>
    )
}