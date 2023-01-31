import "./App.css";
import { useState, useEffect } from "react";
import { Container, CssBaseline } from "@mui/material";
import AddNetworkForm from "./components/AddNetworkForm";

const baseURL = "http://localhost:3000/api";

async function getNetworkNames() {
    const res = await fetch(`${baseURL}/scan`);
    if (res.ok) {
        return await res.json();
    } else {
        throw new Error(res.statusText);
    }
}

async function setNetwork(ssid: string, password: string) {
    const body = { ssid, password };
    const res = await fetch({
        url: `${baseURL}/setup`,
        body,
    });
    if (res.ok) {
        return await res.json();
    } else {
        throw new Error("");
    }
}

function App() {
    const [processing, setProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [networkNames, setNetworkNames] = useState([]);

    const [ssid, setSsid] = useState();

    // on component mount, attempt to get the network names
    useEffect(() => {
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
        };
        // this second param to useEffect is called a dependency array
        // it means that if anything in the array changes at all, the function will be run again
        // if there's nothing in there, it'll only run once when the component mounts.
        // this is analogous to componentDidMount
    }, []);
    return (
        <>
            <CssBaseline />
            <Container maxWidth="md" sx={styles.container}>
                <AddNetworkForm />
            </Container>
        </>
    );
}

const styles: Styles = {
    container: {
        width: "100vh",
        height: "100vh",
        // border: "5px solid red",
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
};

export default App;
