import { render } from "react-dom";
import React, { useEffect, useRef, useState } from "react";

import First, { Second } from "./first.jsx";

import Button from "@mui/material/Button";
import Switch from '@mui/material/Switch';

import TextField from '@mui/material/TextField';
import { httpGet, httpPost, defineSpanishWord } from "./serverAPI.js";

import './styles.scss';
import CustomOutput from "./customOutput.jsx";
import CustomInput from "./customInput.jsx";
import icon from "./image/Screen_Shot_2022-12-01_at_12.53.55_PM-removebg-preview.png"
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

var timeout = ''
var timeout2 = ''
function Page(props) {

    // useEffect(() => {
    //     sendData();
    // }, []);

    const [data, setData] = useState("")
    const [word, setWord] = useState("")
    const [def, setDef] = useState([])

    const [oldWord, setOldWord] = useState("")
    const [oldDef, setOldDef] = useState([])

    function sendData(text) {

        httpPost("https://dz17gr07l1.execute-api.us-east-2.amazonaws.com/dev/translate", text,
            (data) => {
                // console.log(data);
                var thing = JSON.parse(data)
                // console.log(thing["data"][0]["translation_text"])
                try {
                    thing = JSON.parse(thing["data"][0]["translation_text"])
                } catch (error) {
                    console.log("Not JSON")
                    thing = thing["data"][0]["translation_text"]
                    thing = thing.replaceAll("« ", "")
                    thing = thing.replaceAll(" »", "")
                }

                setData(thing)
            })
    }

    const [text, setText] = useState(null)
    const [counts, setCounts] = useState(0)

    function onTextBoxTyped(e) {
        clearTimeout(timeout)
        setText(e.target.value)
        var count = 0;
        var words = e.target.value.split(" ")
        for (var i = 0; i < words.length; i++) {
            if (words[i].length > 0) {
                count++;
            }
        }

        if (counts != count) {
            setCounts(count)
        }

        timeout = setTimeout(() => {
            sendData(e.target.value)
        }, 700)

    }

    useEffect(() => {

        if (text) {
            clearTimeout(timeout)
            sendData(text.substring(0, text.length - 1))
        }
    }, [counts])

    useEffect(() => {
        setOldDef(def)
        setDef([])
        if (word) {
            if (def.length == 0) {
                defineSpanishWord(word, setDef)
            } else {
                clearTimeout(timeout2)
                timeout2 = setTimeout(() => {
                    defineSpanishWord(word, setDef)
                }, 700)
            }
        }
    }, [word])

    function checkForReturn(e) {
        // console.log(e.code)
        if (e.code == "Enter") {
            e.preventDefault();
            e.stopPropagation();
            clearTimeout(timeout)
            sendData(text)
        }
    }

    function ButtonClicked() {
        clearTimeout(timeout)
        sendData(text)
    }

    const [value, setValue] = useState("")
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        var newArr = [...new Set(def)];
        if (def.length != newArr.length) {
            setDef(newArr)
        }
    }, [def])

    return (

        <>
            <ThemeProvider theme={darkTheme}>
                <div className="title">
                    <img src={icon} className="logo" />
                    <h1>LangPortal</h1>
                </div>
                <div className="body" >
                    <>

                        <div className="page">
                            <CustomInput keyDown={checkForReturn} charTyped={onTextBoxTyped} setWord={setWord} text={text} />
                            <CustomOutput translated={data} setWord={setWord} setOldWord={setOldWord} />
                        </div>

                        <Button variant="contained" onClick={ButtonClicked} size="large" style={{ marginBottom: "2rem" }}>TRANSLATE</Button>

                        <div className={(def != "") ? "upIn" : "downOut"}>
                            <h1 className="defH1">Definitions</h1>
                            <div className="def">
                                <h3><b>{(def.length > 0) ? word + ": " : oldWord + ": "} </b></h3>

                                <div className="definitions">
                                    {(def.length > 0) ?
                                        def.map((element, i) => {
                                            console.log(element);
                                            return <h3 className="definition">{(i + 1) + ": " + element}</h3>
                                        }) :
                                        oldDef.forEach((element, i) => {
                                            return <h3 className="definition">{(i + 1) + ": " + element}</h3>
                                        })
                                    }
                                </div>


                            </div>
                        </div>



                        {/* <Button variant="contained">Translate</Button> */}
                    </>
                    <div className="cube"></div>
                    <div className="cube"></div>
                    <div className="cube"></div>
                    <div className="cube"></div>
                    <div className="cube"></div>
                </div>
            </ThemeProvider>
        </>
    )
}




render(
    <Page />,
    document.getElementById("root")
);