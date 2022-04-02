import { useState, useEffect } from "react";
import {
  Tooltip,
  Typography,
  IconButton,
  Button,
  Box,
  Modal,
} from "@mui/material";
import {
  LockOpen as LockOpenIcon,
  Lock as LockIcon,
  PhotoCamera,
  FolderShared as FolderSharedIcon,
} from "@material-ui/icons";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";

import ModalComp from "./components/Modal.js";
import { useSpeechSynthesis } from "react-speech-kit";

const socket = new WebSocket("wss://iot-test-temp.herokuapp.com");
//const socket = new WebSocket("ws://localhost:8000");

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [weight, setWeight] = useState(9999);
  const [lock, setLock] = useState(false);
  const { speak } = useSpeechSynthesis();

  const clickLock = () => {
    if (lock) {
      socket.send("-1");
      speak({ text: "Closing" });
    } else {
      socket.send("-2");
      speak({ text: "Opening" });
    }
    //socket.send("-3");
  };
  const clickLockwithpicture = () => {
    if (lock) {
      socket.send("-1");
      speak({ text: "Closing" });
    } else {
      socket.send("-2");
      speak({ text: "Opening" });
    }
    socket.send("-3");
    speak({ text: " and Capturing Image" });
  };

  const clickGetphoto = () => {
    socket.send("-3");
    speak({ text: "Capturing Image" });
  };

  const clickGetweight = () => {
    socket.send("-4");
  };

  useEffect(() => {
    socket.onmessage = (event) => {
      console.log(event.data);
      if (event.data === "-5") {
        setLock(true);
        speak({ text: "Closed" });
      } else if (event.data === "-6") {
        setLock(false);
        speak({ text: "Opened" });
      } else if (event.data === "-7") {
        console.log("do nothing");
      } else if (event.data === "-1") {
      } else if (event.data === "-2") {
      } else if (event.data === "-9") {
        speak({ text: "Image Captured" });
      } else if (event.data === "-3") {
        // let text = "Capturing image";
        // setValue("Capturing Image");
      } else if (event.data === "-8") {
        speak({ text: "Alert! Possibility of Theft" });
      } else if (event.data === "-4") {
      } else {
        // let text = "Weight updated";
        // speak({ text: text });
        setWeight(event.data);
      }
    };
  }, []);

  let statusComp;

  if (!lock) {
    statusComp = (
      <div>
        <Typography variant="h1" component="div" gutterbottom>
          Box Closed
        </Typography>
        <p style={{ color: "green" }}>Stay calm your contents are safe!</p>
      </div>
    );
  } else {
    statusComp = (
      <div className="status-div">
        <div>
          <Typography variant="h1" component="div" gutterbottom>
            Box Open
          </Typography>
          <p style={{ color: "red" }}>Your contents are not safe!</p>
        </div>
      </div>
    );
  }
  return (
    <div className="Container">
      {/* <div className="heading">Drop Box User Interface</div> */}
      {statusComp}
      <div className="photo-div">
        <div className="buttons">
          <Tooltip title="All photos">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={(e) => {
                e.preventDefault();
                let text = "Redirecting";
                speak({ text: text });
                window.location.href =
                  "https://drive.google.com/drive/folders/1QVSv2LLuNxyR061Ny6I8W1L_LEsxVVHu?usp=sharing";
              }}
            >
              <FolderSharedIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="buttons">
          <Tooltip title="Click Picture">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={() => clickGetphoto()}
            >
              <PhotoCamera fontSize="large" title="Hover on me!" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <div className="photo-div">
        <div className="buttons">
          <Tooltip title="Open Lock">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={() => clickLock()}
              disabled={lock}
            >
              <LockOpenIcon fontSize="large" title="Hover on me!" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="buttons">
          <Tooltip title="Close Lock">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={() => clickLock()}
              disabled={!lock}
            >
              <LockIcon fontSize="large" title="Hover on me!" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="photo-div">
        <div className="buttons">
          <Tooltip text="Open Lock with picture">
            <Button
              //variant="outlined"
              startIcon={<LockOpenIcon />}
              endIcon={<PhotoCamera />}
              disabled={lock}
              onClick={() => clickLockwithpicture()}
            >
              +
            </Button>
          </Tooltip>
        </div>
        <div className="buttons">
          <Tooltip text="Close Lock with picture">
            <Button
              //variant="outlined"
              startIcon={<LockIcon />}
              endIcon={<PhotoCamera />}
              disabled={!lock}
              onClick={() => clickLockwithpicture()}
            >
              +
            </Button>
          </Tooltip>
        </div>
      </div>
      <div>
        <Button onClick={() => clickGetweight()}>Get Weight</Button>
      </div>
      {/* <div>
        <ModalComp />
      </div> */}
    </div>
  );
}

export default App;
