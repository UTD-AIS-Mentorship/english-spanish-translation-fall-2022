import React, { useState } from 'react';
import { Amplify, Storage, Predictions } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import mic from 'microphone-stream';
Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAudioDescription, faFileAudio, faMicrophone, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import { IconButton, Tooltip } from '@mui/material';
import Fade from '@mui/material/Fade';



export function SpeechToText(props) {
    // const [response, setResponse] = useState("Press 'start recording' to begin your transcription. Press STOP recording once you finish speaking.")

    function AudioRecorder(props) {
        const [recording, setRecording] = useState(false);
        const [micStream, setMicStream] = useState();
        const [audioBuffer] = useState(
            (function () {
                let buffer = [];
                function add(raw) {
                    buffer = buffer.concat(...raw);
                    return buffer;
                }
                function newBuffer() {
                    console.log("resetting buffer");
                    buffer = [];
                }

                return {
                    reset: function () {
                        newBuffer();
                    },
                    addData: function (raw) {
                        return add(raw);
                    },
                    getData: function () {
                        return buffer;
                    }
                };
            })()
        );

        async function startRecording() {
            console.log('start recording');
            audioBuffer.reset();

            window.navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
                const startMic = new mic();

                startMic.setStream(stream);
                startMic.on('data', (chunk) => {
                    var raw = mic.toRaw(chunk);
                    if (raw == null) {
                        return;
                    }
                    audioBuffer.addData(raw);

                });

                setRecording(true);
                setMicStream(startMic);
            });
        }

        async function stopRecording() {
            console.log('stop recording');
            const { finishRecording } = props;

            micStream.stop();
            setMicStream(null);
            setRecording(false);

            const resultBuffer = audioBuffer.getData();

            if (typeof finishRecording === "function") {
                finishRecording(resultBuffer);
            }

        }

        return (
            <div className="audioRecorder">
                {/* <div>
                    {recording && <Button variant="contained" color="error" onClick={stopRecording}>MIC</Button>}
                    {!recording && <Button color="error" onClick={startRecording}>MIC</Button>}
                </div> */}
                <div>
                    {recording && <Tooltip
                        onClick={stopRecording}
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title="Stop Recording"
                        placement="top-start"
                        arrow
                    >
                        <IconButton variant="outlined" className="copy recording">
                            <FontAwesomeIcon icon={faMicrophone} />
                        </IconButton>
                    </Tooltip>}
                    {!recording && <Tooltip
                        onClick={startRecording}
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title="Record Audio"
                        placement="top-start"
                        arrow
                    >
                        <IconButton variant="contained" className="copy">
                            <FontAwesomeIcon icon={faMicrophone} />
                        </IconButton>
                    </Tooltip>}
                </div>
            </div>
        );
    }

    function convertFromBuffer(bytes) {
        // props.setResponse('Converting text...');
        console.log(bytes)

        Predictions.convert({
            transcription: {
                source: {
                    bytes
                },
                language: "en-US"
                // language: "en-US", // other options are "en-GB", "fr-FR", "fr-CA", "es-US"
            },
        }).then(({ transcription: { fullText } }) => props.setResponse(fullText))
            .catch(err => props.setResponse(JSON.stringify(err, null, 2)))
    }

    return (
        <div className="Text">
            <div>
                <AudioRecorder finishRecording={convertFromBuffer} />
            </div>
        </div>
    );
}


export function TextToSpeech(props) {
    const [response, setResponse] = useState("...")
    const [textToGenerateSpeech, setTextToGenerateSpeech] = useState("write to speech");

    function generateTextToSpeech() {
        console.log(textToGenerateSpeech)
        setResponse('Generating audio...');
        Predictions.convert({
            textToSpeech: {
                source: {
                    text: textToGenerateSpeech,
                },
                voiceId: "Penelope" // default configured on aws-exports.js 
                // list of different options are here https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
            }
        }).then(result => {
            let AudioContext = window.AudioContext || window.webkitAudioContext;
            console.log({ AudioContext });
            const audioCtx = new AudioContext();
            const source = audioCtx.createBufferSource();
            audioCtx.decodeAudioData(result.audioStream, (buffer) => {

                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.start(0);
            }, (err) => console.log({ err }));

            setResponse(`Generation completed, press play`);
        })
            .catch(err => setResponse(err))
    }

    // function setText(event) {
    //     setTextToGenerateSpeech(event.target.value);
    // }

    useEffect(() => {
        setTextToGenerateSpeech(props.text)
    }, [props.text])

    return (
        <div className="Text">
            <div>
                {/* <input value={textToGenerateSpeech} onChange={setText}></input> */}
                <Tooltip
                    onClick={generateTextToSpeech}
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title="Play Audio"
                    placement="top-start"
                    arrow
                >
                    <IconButton variant="contained" className="copy">
                        <FontAwesomeIcon icon={faVolumeHigh} />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}




