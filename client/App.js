import * as React from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import AddNetworkForm from './components/AddNetworkForm';

const baseURL = "http://localhost:3000/api";

async function getNetworkNames() {
  const res = await fetch(`${baseURL}/scan`);
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(res.statusText);
  }
}

async function setNetwork(ssid, password) {
  const body = { ssid, password };
  const res = await fetch({ url: `${baseURL}/setup`, body });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error("")
  }
}

export default function MyApp() {
  const [processing, setProcessing] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [networkNames, setNetworkNames] = React.useState([]);

  const [ssid, setSsid] = React.useState();

  // on component mount, attempt to get the network names
  React.useEffect(() => {
    const getNetworks = async () => {
      // set processing to true so the user gets feedback that
      // something is happening in the background
      setProcessing(true);
      try {
        const networks = await getNetworkNames();
        console.log(networks);
      } catch (error) {
        // when we catch the error, save it to the component state
        setError("failed to get networks");
      } finally {
        // at the end, we set processing to false
        setProcessing(false);
      }
    }
    // this second param to useEffect is called a dependency array
    // it means that if anything in the array changes at all, the function will be run again
    // if there's nothing in there, it'll only run once when the component mounts.
    // this is analogous to componentDidMount
  }, [])

  const containerStyles = {
    width: "100vh",
    height: "100vh",
    // border: "5px solid red",
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md" sx={containerStyles}>
        <AddNetworkForm />
      </Container>
    </React.Fragment>
  );
}
