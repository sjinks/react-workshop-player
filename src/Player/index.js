// Core
import React, { useState, useRef, useEffect, createRef } from 'react';

import Video from './Video.js';
import VideoControls from './VideoControls.js';
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
    const videoRef = createRef();
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
        if (event.buttons || event.type === 'click') {
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
        }
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

    return (
        <div className = 'player' ref={ playerRef }>
            <Video
                ref = { videoRef }
                src = { video }
                handlePlay = { togglePlay }
                handleProgressChange = { handleProgress }
            />
            <VideoControls
                progress = { progress }
                volume = { volume }
                playbackSpeed = { playbackSpeed }
                handleScrub = { scrub }
                handlePlay = { togglePlay }
                handleVolumeChange = { handleSliderChange }
                handlePlaybackSpeedChange = { handleSliderChange }
                handleSkip = { skip }
                handleFullscreen = { toggleFullscreen }
            />
        </div>
    );
};
