import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { saveAs } from "file-saver";
import { styled } from "@mui/material/styles";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

const CustomSelect = styled(Select)(() => ({
  width: 300,
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      color: "white",
      border: "2.5px solid #1976d2",
    },
    "&:hover fieldset": {
      borderColor: "aqua",
      color: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
      color: "white",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  },
}));

const Form = () => {
  const url = "https://stablediffusionapi.herokuapp.com/model";
  const [prompt, setPrompt] = useState("Type here");
  const [height, setHeight] = useState(512);
  const [width, setWidth] = useState(512);
  const [steps, setSteps] = useState(37);
  const [output, setOutput] = useState("");
  const [visible, setVisible] = useState("hidden");
  const downloadImage = () => {
    saveAs(output, "image.jpg"); // Put your image url here.
  };

  const submitValue = async (e) => {
    e.preventDefault();
    try {
      console.log("Value: ", prompt, height, width, steps);
      const response = await axios.post(url, {
        prompt,
        height,
        width,
        steps,
      });

      console.log("Response ", response);
      setOutput(response["data"]);
      setPrompt("");
      setHeight(0);
      setWidth(0);
      setSteps(0);
      setVisible("visible");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ background:"#161b22",textAlign: "center" }}>
      <h1 style={{ color: "#fc5d87" }}>
        Text Driven Synthetic Image Generation via Stable Diffusion Model
      </h1>
      <br/>
      <form onSubmit={submitValue}>
        <label style={{ color: "azure", fontSize: "x-large" }}>
          Enter the text
        </label>
        <br />
        <TextField
          required
          sx={{
            input: {
              color: "white",
              background: "#161b22",
              border: "2.5px solid #1976d2",
            },
          }}
          color="primary"
          focused
          style={{ width: "50vw", paddingTop: "1vh" }}
          id="text"
          type="text"
          value={prompt}
          onChange={(e) => {
            if (e.target.value ==="") {
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="warning">
                  <AlertTitle>Warning</AlertTitle>
                  Prompt cannot be empty —{' '}
                  <strong>check it out!</strong>
                </Alert>
              </Stack>;
            }
            setPrompt(e.target.value);
          }}
        />
        <br />
        <br />

        <FormControl required sx={{ m: 1, minWidth: 250 }}>
          <InputLabel
            style={{ color: "white", fontSize: "larger" }}
            id="demo-simple-select-helper-label"
          >
            Image Height
          </InputLabel>
          <CustomSelect
            style={{ color: "white" }}
            labelId="demo-simple-select-helper-label"
            id="height"
            value={height}
            label="Height in pixels"
            defaultValue={512}
            autoWidth
            onChange={(e) => setHeight(e.target.value)}
          >
            <MenuItem value={512}>512px </MenuItem>
            <MenuItem value={576}>576px</MenuItem>
            <MenuItem value={640}>640px</MenuItem>
            <MenuItem value={704}>704px</MenuItem>
            <MenuItem value={768}>768px</MenuItem>
            <MenuItem value={832}>832px</MenuItem>
            <MenuItem value={896}>896px</MenuItem>
            <MenuItem value={960}>960px</MenuItem>
            <MenuItem value={1024}>1024px</MenuItem>
          </CustomSelect>
        </FormControl>

        <FormControl required sx={{ m: 1, minWidth: 250 }}>
          <InputLabel
            style={{ color: "white", fontSize: "larger" }}
            id="demo-simple-select-helper-label"
          >
            Image Width
          </InputLabel>
          <CustomSelect
            style={{ color: "white" }}
            sx={{
              input: {
                color: "white",
                background: "#161b22",
              },
            }}
            labelId="demo-simple-select-helper-label"
            id="width"
            defaultValue={512}
            value={width}
            label="Width in pixels"
            autoWidth
            onChange={(e) => setWidth(e.target.value)}
          >
            <MenuItem value={512}>512px </MenuItem>
            <MenuItem value={576}>576px</MenuItem>
            <MenuItem value={640}>640px</MenuItem>
            <MenuItem value={704}>704px</MenuItem>
            <MenuItem value={768}>768px</MenuItem>
            <MenuItem value={832}>832px</MenuItem>
            <MenuItem value={896}>896px</MenuItem>
            <MenuItem value={960}>960px</MenuItem>
            <MenuItem value={1024}>1024px</MenuItem>
          </CustomSelect>
        </FormControl>
        <br />
        <br />
        <label style={{ color: "azure", fontSize: "x-large" }}>
          Enter the number of steps
        </label>
        <br />
        <br />
        <Slider
          valueLabelDisplay="on"
          style={{ width: "30vw" }}
          value={steps}
          defaultValue={40}
          aria-label="Default"
          min={35}
          max={50}
          onChange={(e) => {
            setSteps(e.target.value);
          }}
        />
        <br />
        <br />
        <div style={{ textAlign: "center" }}>
          <Button size="large" variant="contained" type="submit">
            Generate Image
          </Button>
        </div>
      </form>
      <div
        style={{
          background: "#161b22",
          textAlign: "center",
          visibility: visible,
        }}
      >
        <h2 style={{color:"#fc5d87"}}>Result</h2>
        <img id="lol" alt="Result" src={`data:image/jpeg;base64,${output}`} />
        <br />
        <br />
        <Button
          color="warning"
          size="large"
          variant="contained"
          onClick={downloadImage}
        >
          Download Image
        </Button>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default Form;
