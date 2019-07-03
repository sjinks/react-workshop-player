'use strict';

import React from 'react';

const ProgressBar = (props) => {
    return (
        <div
            className = 'progress'
            role = "progressbar"
            aria-valuenow = { `${props.progress}%` }
            aria-valuemin = "0%"
            aria-valuemax = "100%"
            onClick = { props.handleScrub }
            onMouseMoveCapture = { props.handleScrub }>
            <div
                className = 'filled'
                style = {{
                    '--filledProgressBar': `${props.progress}%`,
                }}
            />
        </div>
    );
};

export default ProgressBar;
