'use strict';

import React from 'react';

import ProgressBar from './ProgressBar.js';
import fullscreen from './fullscreen.js';

const VideoControls = (props) => {
    const playControl = props.isPlaying ? <>&#10074;&#10074;</> : <>&#9654;</>;
    const playLabel   = props.isPlaying ? 'Pause' : 'Play';

    return (
        <div className = 'controls'>
            <ProgressBar
                progress = { props.progress }
                handleScrub = { props.handleScrub }
            />
            <button
                aria-label = { playLabel }
                title = 'Toggle Play'
                onClick = { props.handlePlay }>
                {playControl}
            </button>
            <input
                className = 'slider'
                max = '1'
                min = '0'
                name = 'volume'
                step = '0.05'
                type = 'range'
                role = 'slider'
                aria-valuenow = { props.volume }
                aria-valuemin = '0'
                aria-valuemax = '1'
                aria-label = 'Current volume'
                value = { props.volume }
                onChange = { props.handleVolumeChange }
            />
            <input
                className = 'slider'
                max = '2'
                min = '0.5'
                name = 'playbackRate'
                step = '0.1'
                type = 'range'
                role = 'slider'
                aria-valuenow = { props.playbackSpeed }
                aria-valuemin = '0.5'
                aria-valuemax = '2'
                aria-label = 'Current playback rate'
                value = { props.playbackSpeed }
                onChange = { props.handlePlaybackSpeedChange }
            />
            <button
                aria-label = 'Go 10 seconds backwards'
                data-skip = '-10'
                onClick = { props.handleSkip }>
                « 10s
            </button>
            <button
                aria-label = 'Go 25 seconds forward'
                data-skip = '25'
                onClick = { props.handleSkip }>
                25s »
            </button>
            <button hidden={ !fullscreen.isSupported } onClick={ props.handleFullscreen } aria-label='Toggle fullscreen mode'>&#10021;</button>
        </div>
    );
};

export default VideoControls;
