import React, { useState, useEffect } from "react"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import InputLabel from "@material-ui/core/InputLabel"
import Grid from "@material-ui/core/Grid"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"
import Button from "@material-ui/core/Button"
import { Line } from "react-chartjs-2"

function App() {
    const [gainers, setGainers] = useState([])
    const [symbol, setSymbol] = useState("")
    const [stockData, setStockData] = useState({})

    useEffect(() => {
        fetch("https://40.80.83.219/api/gainers")
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setGainers(data)
            })
    }, [])

    const handleChange = (event) => {
        setSymbol(event.target.value)
        setStockData({})
    }

    const getPredctions = () => {
        let stock = symbol

        fetch("https://40.80.83.219/api/predict/" + stock)
            .then((res) => res.json())
            .then((data) => {
                setStockData({
                    ...stockData,
                    labels: data.dates,
                    datasets: [
                        {
                            label: `Actual Close ${symbol}`,
                            fill: false,
                            lineTension: 0.5,
                            backgroundColor: "#03DAC6",
                            borderColor: "#018786",
                            borderWidth: 2,
                            data: data.truth,
                        },
                        {
                            label: `Predicted CLose ${symbol}`,
                            fill: false,
                            lineTension: 0.5,
                            backgroundColor: "#C20000",
                            borderColor: "#F06461",
                            borderWidth: 2,
                            data: data.predictions,
                        },
                    ],
                })
            })
    }

    return (
        <div style={{ padding: 16, margin: "auto", maxWidth: 600 }}>
            <Typography variant="h4" align="center" component="h1" gutterBottom>
                📈 Stock Predictor
            </Typography>
            <Typography
                variant="caption"
                align="center"
                component="p"
                gutterBottom
            >
                DISCLAIMER: This is an experimental project not to be used for
                making investment decisions.
            </Typography>
            {gainers && gainers.length > 0 && (
                <Paper style={{ padding: 16 }}>
                    <Grid container alignItems="flex-start" spacing={2}>
                        <Grid item xs={6}>
                            <InputLabel id="demo-simple-select-label">
                                Select Symbol
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={symbol}
                                onChange={handleChange}
                            >
                                {gainers.map((item, i) => {
                                    return (
                                        <MenuItem value={item} key={i}>
                                            {item}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <Button onClick={getPredctions}>GET</Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {stockData.labels && (
                <Paper style={{ padding: 16 }}>
                    <Grid container alignItems="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <Line
                                data={stockData}
                                options={{
                                    title: {
                                        display: true,
                                        text: `Actual Vs Predictions ${symbol}`,
                                        fontSize: 20,
                                    },
                                    legend: {
                                        display: true,
                                        position: "right",
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            )}
            {/* <Typography
                variant="caption"
                align="center"
                component="p"
                gutterBottom
            >
                LOGS: {`gainers: ${gainers} \n Stock Data: ${stockData}`}
            </Typography> */}
        </div>
    )
}

export default App
