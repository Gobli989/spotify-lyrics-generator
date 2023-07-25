import { useState } from 'react';
import './App.css';
import { SResponse, getLyricsFromURL, screenshotNode } from '../Utils/Utils';
import { contrastingWhite } from '../Utils/ColorUtils';

export default function App() {
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [page, setPage] = useState(1);

    const [response, setReponse] = useState(null as SResponse | null);

    const [selected, setSelected] = useState([] as number[]);

    const [settings, setSettings] = useState({
        gap: 0,
        bgColor: '#ffffff',
        justifyText: false,
        showSpotifyLogo: true,
        spotifyLogoPlacement: 'left',
        outputScale: 2,
        dotsBetweenFarLines: false,
    } as Settings);

    switch (page) {
        case 1: return <>
            <div className="container">
                <h1>Spotify Lyrics Generator</h1>

                <input className={`search ${!testURLRegex(search) ? 'invalid' : 'valid'}`} type="url" placeholder='URL' onInput={(e) => {
                    setSearch(e.currentTarget.value);
                }} />

                {/* {testURLRegex(search) ? null : <p>Invalid URL</p>} */}

                <button className="btn bg-spoty" onClick={() => {
                    if (!testURLRegex(search) || searching) return;

                    setSearching(true);

                    getLyricsFromURL(search)
                        .then(lyrics => {

                            setSearching(false);
                            setPage(2);

                            setReponse(lyrics);

                        })
                        .catch(err => {
                            console.log(err);
                        });

                }}>{searching ? 'Searching...' : 'Search'}</button>
            </div>
        </>;
    }

    const [width, height] = getScale(settings.outputScale);

    return <>
        <div className="container">
            <div className="lyrics lyrics-selector">
                {response?.lines?.map((line, i) => {
                    return <>
                        <p onClick={() => {

                            if (selected.includes(i)) {
                                setSelected(selected.filter(x => x !== i));
                            } else {
                                setSelected([...selected, i]);
                            }

                        }} key={i} className={selected.includes(i) ? 'selected' : ''}>{line.words}</p>
                    </>;
                })}
            </div>

            <div className='settings'>
                <div className="row">
                    <input type="number" min={0} defaultValue={0} onInput={(e) => setSettings({ ...settings, gap: parseInt(e.currentTarget.value) })} />
                    <span>Gap between lines</span>
                </div>

                <div className="row">
                    <input type="text" data-coloris className='form-control' defaultValue={settings.bgColor} onInput={(e) => setSettings({ ...settings, bgColor: e.currentTarget.value })} />
                    <span>Background color</span>
                </div>

                <div className="row">
                    <input type="checkbox" defaultChecked={settings.justifyText} onInput={(e) => setSettings({ ...settings, justifyText: e.currentTarget.checked })} />
                    <span>Justify text</span>
                </div>

                <div className="row">
                    <input type="checkbox" defaultChecked={settings.showSpotifyLogo} onInput={(e) => setSettings({ ...settings, showSpotifyLogo: e.currentTarget.checked })} />
                    <span>Show Spotify logo</span>
                </div>

                <div className="row">
                    <input type="checkbox" defaultChecked={settings.dotsBetweenFarLines} onInput={(e) => setSettings({ ...settings, dotsBetweenFarLines: e.currentTarget.checked })} />
                    <span>Dots between far away lines</span>
                </div>

                <div className="row">
                    <select defaultValue={settings.spotifyLogoPlacement} onInput={(e) => setSettings({ ...settings, spotifyLogoPlacement: e.currentTarget.value })}>
                        <option value='left'>Left</option>
                        <option value='center'>Center</option>
                        <option value='right'>Right</option>
                    </select>
                    <span>Spotify Logo Placement</span>
                </div>

                <div className="row">
                    <span>{settings.outputScale}</span>
                    <input type="range" min={1} max={9} defaultValue={settings.outputScale} onInput={(e) => setSettings({ ...settings, outputScale: parseInt(e.currentTarget.value) })} />
                    <span>Output Scale {width} x {height}</span>
                </div>

            </div>

            {selected.length > 0 ? <>
                <div className="lyrics lyrics-finished" id="finished-dom" style={{
                    backgroundColor: settings.bgColor,
                    color: contrastingWhite(settings.bgColor) ? 'black' : 'white',
                }}>
                    <div className="text-container" style={{
                        gap: `${settings.gap}px`,
                        textAlign: settings.justifyText ? 'justify' : 'left'
                    }}>
                        {selected.sort().map((num, i, arr) => {
                            if (!response?.lines) return null;

                            if(settings.dotsBetweenFarLines) {
                                if(i !== 0 && arr[i - 1] + 1 !== num) {
                                    return <>
                                        <p className='lyrics-dots'>[...]</p>
                                        <p>{response?.lines[num].words}</p>
                                    </>;
                                }
                            }

                            return <>
                                <p>{response?.lines[num].words}</p>
                            </>;
                        })}
                    </div>

                    {settings.showSpotifyLogo ? <>
                        <div className="spotify-logo-container" style={{
                            justifyContent: settings.spotifyLogoPlacement === 'left' ? 'flex-start' : settings.spotifyLogoPlacement === 'center' ? 'center' : 'flex-end'
                        }}>
                            {contrastingWhite(settings.bgColor) ? <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1134 340" className='spotify-logo'>
                                    <path fill='black' d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-54-32-144-35-195-19zm379 91c-17 0-33-6-47-20-1 0-1 1-1 1l-16 19c-1 1-1 2 0 3 18 16 40 24 64 24 34 0 55-19 55-47 0-24-15-37-50-46-29-7-34-12-34-22s10-16 23-16 25 5 39 15c0 0 1 1 2 1s1-1 1-1l14-20c1-1 1-1 0-2-16-13-35-20-56-20-31 0-53 19-53 46 0 29 20 38 52 46 28 6 32 12 32 22 0 11-10 17-25 17zm95-77v-13c0-1-1-2-2-2h-26c-1 0-2 1-2 2v147c0 1 1 2 2 2h26c1 0 2-1 2-2v-46c10 11 21 16 36 16 27 0 54-21 54-61s-27-60-54-60c-15 0-26 5-36 17zm30 78c-18 0-31-15-31-35s13-34 31-34 30 14 30 34-12 35-30 35zm68-34c0 34 27 60 62 60s62-27 62-61-26-60-61-60-63 27-63 61zm30-1c0-20 13-34 32-34s33 15 33 35-13 34-32 34-33-15-33-35zm140-58v-29c0-1 0-2-1-2h-26c-1 0-2 1-2 2v29h-13c-1 0-2 1-2 2v22c0 1 1 2 2 2h13v58c0 23 11 35 34 35 9 0 18-2 25-6 1 0 1-1 1-2v-21c0-1 0-2-1-2h-2c-5 3-11 4-16 4-8 0-12-4-12-12v-54h30c1 0 2-1 2-2v-22c0-1-1-2-2-2h-30zm129-3c0-11 4-15 13-15 5 0 10 0 15 2h1s1-1 1-2V93c0-1 0-2-1-2-5-2-12-3-22-3-24 0-36 14-36 39v5h-13c-1 0-2 1-2 2v22c0 1 1 2 2 2h13v89c0 1 1 2 2 2h26c1 0 1-1 1-2v-89h25l37 89c-4 9-8 11-14 11-5 0-10-1-15-4h-1l-1 1-9 19c0 1 0 3 1 3 9 5 17 7 27 7 19 0 30-9 39-33l45-116v-2c0-1-1-1-2-1h-27c-1 0-1 1-1 2l-28 78-30-78c0-1-1-2-2-2h-44v-3zm-83 3c-1 0-2 1-2 2v113c0 1 1 2 2 2h26c1 0 1-1 1-2V134c0-1 0-2-1-2h-26zm-6-33c0 10 9 19 19 19s18-9 18-19-8-18-18-18-19 8-19 18zm245 69c10 0 19-8 19-18s-9-18-19-18-18 8-18 18 8 18 18 18zm0-34c9 0 17 7 17 16s-8 16-17 16-16-7-16-16 7-16 16-16zm4 18c3-1 5-3 5-6 0-4-4-6-8-6h-8v19h4v-6h4l4 6h5zm-3-9c2 0 4 1 4 3s-2 3-4 3h-4v-6h4z"></path>
                                </svg>
                            </> : <>
                                <img src="logo/logo-white.svg" alt="Spotify Logo White" className='spotify-logo' />
                            </>}

                        </div>
                    </> : null}

                </div>
            </> : <span>Here will the lyrics be generated...</span>}

            <button className="btn bg-spoty btn-finish" onClick={() => {

                screenshotNode(document.getElementById('finished-dom')!, settings.outputScale)
                    .then(imgData => {

                        const a = document.createElement('a');
                        a.href = imgData;
                        a.download = 'lyrics.png';
                        a.click();

                    })
                    .catch(err => {
                        console.error(err);

                        alert('Error while generating image');
                    });

            }}>Download Image</button>
        </div>
    </>;
}

function testURLRegex(str: string) {
    const urlRegex = /https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]*/g;

    return urlRegex.test(str);
}

function getScale(scale: number) {
    const dom = document.getElementById('finished-dom');
    if (!dom) return [0, 0];

    return [dom.clientWidth * scale, dom.clientHeight * scale];
}

type Settings = {
    gap: number;
    bgColor: string;
    justifyText: boolean;
    showSpotifyLogo: boolean;
    spotifyLogoPlacement: string;
    outputScale: number;
    dotsBetweenFarLines: boolean;
}