// Core
import React, { useState, useRef, useEffect } from 'react';

// Instruments
import './styles.css';

import video from './video.mp4';

export const Player = () => {
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ progress, setProgress ] = useState(0);
    const [ isProgressCapturing, setIsProgressCapturing ] = useState(false);

    /**
     * Создаём реф для элемента video.
     * Реф в React — это прямой доступ к html-элементу.
     * С его помощью мы сможем управлять видеоплеером в явном виде.
     */
    const videoRef = useRef(null);

    /* Включаем или выключаем проигрывание видео. */
    const togglePlay = () => {
        const method = videoRef.current.paused ? 'play' : 'pause';

        videoRef.current[ method ]();
        setIsPlaying(method === 'play');
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

    console.log(progress);

    return (
        <div className = 'player'>
            <video
                ref = { videoRef }
                src = { video }
                onClick = { togglePlay }
                onTimeUpdate = { handleProgress }
            />
            <div className = 'controls'>
                <div
                    className = 'progress'
                    onClick = { scrub }
                    onMouseDown = { () => setIsProgressCapturing(true) }
                    onMouseMove = { (event) => isProgressCapturing && scrub(event) }
                    onMouseUp = { () => setIsProgressCapturing(false) }>
                    <div
                        className = 'filled'
                        style = {{
                            '--filledProgressBar': `${progress}%`,
                        }}
                    />
                </div>
                <button
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
                />
                <input
                    className = 'slider'
                    max = '2'
                    min = '0.5'
                    name = 'playbackRate'
                    step = '0.1'
                    type = 'range'
                />
                <button
                    data-skip = '-10'
                    onClick = { skip }>
                    « 10s
                </button>
                <button
                    data-skip = '25'
                    onClick = { skip }>
                    25s »
                </button>
                <button>&#10021;</button>
            </div>
        </div>
    );
};
