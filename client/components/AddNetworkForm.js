import * as React from 'react';
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const styles = {
    container: {
        bgcolor: '#ffffff', 
        // border: "5px solid black", 
        // borderRadius: 10,
        flex: 1,
    },
    form: {

    }
}

const AddNetworkForm = (props) => {
    return (
        <Box sx={styles.container}>
          <FormControl fullWidth sx={styles.form}>
            <InputLabel id="network-name">SSID</InputLabel>
            <Select >
              <MenuItem value={"dummy"}>Test</MenuItem>
              <MenuItem value={"dummy1"}>Test1</MenuItem>
              <MenuItem value={"dummy2"}>Test2</MenuItem>
            </Select>
          </FormControl>
        </Box>
    );
};

export default AddNetworkForm;