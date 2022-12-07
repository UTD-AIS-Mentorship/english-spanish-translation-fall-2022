import React, { useState, forwardRef } from "react";
import TextField from '@mui/material/TextField';
import { CopyToClipboard } from "react-copy-to-clipboard"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import { IconButton } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { TextToSpeech } from "./speech.jsx";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomOutput(props) {
    const [copied, setCopied] = useState(false)
    const [open, setOpen] = useState(false)
    const [cWord, setCWord] = useState("")

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const handleClick = () => {
        setOpen(true);
    };

    function getSelection(e) {
        props.setOldWord(cWord)
        let text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        console.log(text)
        setCWord(text)
        props.setWord(text)
        return text;
    }

    function clickArea(e) {
        let i = e.target.selectionStart
        console.log(e)
        // console.log(getTheWord(i, props.translated))
        props.setWord(getTheWord(i, props.translated))
    }

    const getTheWord = (selectionStart, value) => {
        let arr = value.split(" ");
        let sum = 0
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i].length + 1

            if (sum > selectionStart) {
                // console.log(arr[i])
                return arr[i]
            }
        }
    }

    return (<div className="textF r">
        <h1 className="span">Spanish</h1>

        <TextField multiline minRows={8} className="w-100 h-100 tex" id="outlined-basic" label="Output Text" variant="outlined" value={props.translated} disabled onClick={clickArea} onChange={({ target: { value } }) => setValue(value)}  />
        <div className="copy2">
            <TextToSpeech text={props.translated} />

            <CopyToClipboard text={props.translated}
                onCopy={() => setCopied(true)}

            >
                <Tooltip
                    onClick={handleClick}
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title="Copy"
                    placement="top-start"
                    arrow
                >
                    <IconButton variant="contained" className="copy">
                        <FontAwesomeIcon icon={faCopy} />
                    </IconButton>
                </Tooltip>
            </CopyToClipboard>
            <Snackbar
                message="Copied!"
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Copied!
                </Alert>
            </Snackbar>
        </div>

    </div>

    )
}