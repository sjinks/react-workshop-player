'use strict';

import React from 'react';

const Video = React.forwardRef((props, ref) => {
  return (
    <video
      ref={ ref }
      src={ props.src }
      onClick={ props.handlePlay }
      onTimeUpdate={ props.handleProgressChange }
    >
      { props.children }
    </video>
  );
});

export default Video;
