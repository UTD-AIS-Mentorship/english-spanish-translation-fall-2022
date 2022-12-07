import { render } from "react-dom";
import React, {useRef, useState} from "react";

import Button from "@mui/material/Button";

import TextField from '@mui/material/TextField';
import httpGet from "./serverAPI.js";

function Hello() {

    httpGET("http://localhost:3000/api/first", (data) => {
        console.log(data);
    });

    const header1 = useRef(null)
    const text1 = useRef(null)

    const [text, setText] = useState("")

    
    
    function onTextButtonPressed() {
        // header1.current.innerHTML = "This text changed";
        // header1.current.innerHTML = text1.current.value;
        // alert("You pressed the button!");

        header1.current.innerHTML = text;
    }
    

    function onTextBoxTyped(e) {
        setText(e.target.value)
        // header1.current.innerHTML = e.target.value;

        // TextField.current.innerHTML = ""
    }
    return(
        <div className="body">


            <Button className="blue" variant="text" onClick={onTextButtonPressed}>Text</Button>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" ref={text1} onChange={onTextBoxTyped}/>

            <h1 ref={header1} >Hello Worlds</h1>
        </div>
    )
}

export default function First() {
    return (
        <div>
            <h1>First</h1>
        </div>
    );
}

export function Second() {
    return (
        <div>
            <h1>Second</h1>
        </div>
    );
}