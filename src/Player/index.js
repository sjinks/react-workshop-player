// Core
import React, { useState, useRef, useEffect } from 'react';

import fullscreen from './fullscreen.js';

// Instruments
import './styles.css';

import video from './video.mp4';

export const Player = () => {
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ progress, setProgress ] = useState(0);
    const [ volume, setVolume ] = useState(0.75);
    const [ playbackSpeed, setPlaybackSpeed ] = useState(1);

    /**
     * Создаём реф для элемента video.
     * Реф в React — это прямой доступ к html-элементу.
     * С его помощью мы сможем управлять видеоплеером в явном виде.
     */
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    /* Включаем или выключаем проигрывание видео. */
    const togglePlay = () => {
        const method = isPlaying ? 'pause' : 'play';

        videoRef.current[ method ]();
        setIsPlaying(!isPlaying);
    };

    /* Прокручиваем прогресс проигрывания. */
    const skip = (event) => {
        const seconds = event.target.dataset.skip;

        videoRef.current.currentTime += Number.parseFloat(seconds);
    };

    /* Устанавливаем прогресс проигранного видео в процентах. */
    const handleProgress = () => {
        const percent
            = videoRef.current.currentTime / videoRef.current.duration * 100;

        setProgress(percent);
    };

    /* Устанавливаем прогресс видео указателем мыши. */
    const scrub = (event) => {
        /**
         * offsetX — свойство события мыши. Возвращает расстояние от «начала» элемента до позиции указателя мыши по координате X.
         * nativeEvent — ссылка на нативное, НЕ кросс-браузерное событие.
         *
         * offsetWidth — возвращает ширину элемента.
         * О разнице между event.target и event.currentTarget: https://github.com/facebook/react/issues/5733#issuecomment-167188516.
         */

        const scrubTime
            = event.nativeEvent.offsetX / event.currentTarget.offsetWidth
            * videoRef.current.duration;

        videoRef.current.currentTime = scrubTime;
    };

    const handleSliderChange = (event) => {
        const { name, value } = event.target;
        videoRef.current[name] = value;
        switch (name) {
            case 'volume':
                setVolume(value);
                break;

            case 'playbackRate':
                setPlaybackSpeed(value);
                break;

            default:
                console.error(`handleSliderChange() needs to be updated to handle ${name}`);
                break;
        }
    };

    /**
     * TODO: we can use a state instead of checking fullscreenElement() by listening to
     * `fullscreenchange` / `fullscreenerror` events. But because of various browser quirks
     * (such as inconsistent event recipient), the solution below is easier and simpler
     */
    const toggleFullscreen = (/* event */) => {
        let retval;
        if (!fullscreen.fullscreenElement()) {
            // If we make the video itself fullscreen, our controls will be lost. Making the entire player fullscreen instead.
            retval = fullscreen.requestFullscreen(playerRef.current);
        } else {
            retval = fullscreen.exitFullscreen();
        }

        // Some browsers return a Promise, some don't. If we have a Promise, catch and swallow any errors
        if ('catch' in retval) {
            /* FIXME: ignore an error in the production mode */
            retval.catch((e) => { console.error(e); });
        }
    };

    /* Добавляем слушатель вкл/выкл видео по нажатию на пробел. */
    useEffect(() => {
        const handler = (event) => {
            if (event.code === 'Space') {
                togglePlay();
            }
        };

        /* Подписка, выполняется при первом рендере один раз. */
        document.addEventListener('keydown', handler);

        /* Отписка, выполняется при удалении компонента один раз. */
        return () => document.removeEventListener('keydown', handler);
        /* Эффект выполняется один раз, потому что вторым аргументом мы передали []. */
    }, []);

    const playControl = isPlaying ? <>&#10074;&#10074;</> : <>&#9654;</>;
    const playLabel   = isPlaying ? 'Pause' : 'Play';

    return (
        <div className = 'player' ref={ playerRef }>
            <video
                ref = { videoRef }
                src = { video }
                onClick = { togglePlay }
                onTimeUpdate = { handleProgress }
            />
            <div className = 'controls'>
                <div
                    className = 'progress'
                    role = "progressbar"
                    aria-valuenow = { `${progress}%` }
                    aria-valuemin = "0%"
                    aria-valuemax = "100%"
                    onClick = { scrub }
                    onMouseMoveCapture = { (event) => event.nativeEvent.buttons && scrub(event) /* we can move `event.nativeEvent.buttons` check to `scrub()` and get rid of a closure */ }>
                    <div
                        className = 'filled'
                        style = {{
                            '--filledProgressBar': `${progress}%`,
                        }}
                    />
                </div>
                <button
                    aria-label = { playLabel }
                    title = 'Toggle Play'
                    onClick = { togglePlay }>
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
                    aria-valuenow = { volume }
                    aria-valuemin = '0'
                    aria-valuemax = '1'
                    aria-label = 'Current volume'
                    value = { volume }
                    onChange = { handleSliderChange }
                />
                <input
                    className = 'slider'
                    max = '2'
                    min = '0.5'
                    name = 'playbackRate'
                    step = '0.1'
                    type = 'range'
                    role = 'slider'
                    aria-valuenow = { playbackSpeed }
                    aria-valuemin = '0.5'
                    aria-valuemax = '2'
                    aria-label = 'Current playback rate'
                    value = { playbackSpeed }
                    onChange = { handleSliderChange }
                />
                <button
                    aria-label = 'Go 10 seconds backwards'
                    data-skip = '-10'
                    onClick = { skip }>
                    « 10s
                </button>
                <button
                    aria-label = 'Go 25 seconds forward'
                    data-skip = '25'
                    onClick = { skip }>
                    25s »
                </button>
                <button hidden={ !fullscreen.isSupported } onClick={ toggleFullscreen } aria-label='Toggle fullscreen mode'>&#10021;</button>
            </div>
        </div>
    );
};
