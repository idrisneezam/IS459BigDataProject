import { useState, useEffect } from "react";
import { Container, Typography, Box, TextField, Button, MenuItem } from "@mui/material";
import { fetchOutputResults } from "@/services/GeneratePredictiveOutputService";
import * as d3 from "d3";
import airplaneIcon from "@/assets/airplane.svg"; // Make sure this file exists in your assets
import { useNavigate, useLocation } from "react-router-dom";

// Dropdown options
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1); // 1 to 31
const dayOfWeekOptions = Array.from({ length: 7 }, (_, i) => i + 1); // 1 to 7 (assuming 1=Monday, 7=Sunday)

const carrierOptions = [
    { label: "Delta Airlines (DL)", value: 1 },
    { label: "Southwest Airlines (WN)", value: 2 },
    { label: "American Airlines (AA)", value: 3 },
];

const airportOptions = [
    { label: "Chicago O'Hare (ORD)", value: 1 },
    { label: "Hartsfield-Jackson Atlanta (ATL)", value: 2 },
    { label: "Dallas/Fort Worth (DFW)", value: 3 },
];

const timeOfDayOptions = ["Morning", "Afternoon", "Evening", "Night"];

// Delay description function
const getDelayDescription = (prediction) => {
    switch (prediction) {
        case 0:
            return "On Time or Small Delay (≤15 minutes)";
        case 1:
            return "Medium Delay (15-45 minutes)";
        case 2:
            return "Large Delay (>45 minutes)";
        default:
            return "Unknown";
    }
};

export function PredictionQueryPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine if the current page is active
    const isQ1Active = location.pathname === "/Q1";
    const isQ2Active = location.pathname === "/Q2";

    const [formData, setFormData] = useState({
        Year: 2024,
        Month: 10,
        Day: 29,
        DayOfWeek: 3,
        DepTime: 900,
        CRSDepTime: 850,
        CRSElapsedTime: 120,
        Origin: 1,
        Dest: 2,
        Carrier: 3,
        FlightNum: 123,
        DepHour: 9,
        DepMinute: 0,
        ArrHour: 11,
        ArrMinute: 0,
        Cancelled: 0,
        TimeOfDay: "Morning"
    });
    
    const [predictionResult, setPredictionResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addSearchResult = async () => {
        try {
            const result = await fetchOutputResults(formData);
            setPredictionResult(getDelayDescription(result.predictions[0]));
        } catch (error) {
            console.error("Failed to fetch prediction results:", error);
            setPredictionResult("Error: Unable to get prediction");
        }
    };

    // Background effect with airplane stippling
    useEffect(() => {
        const svg = d3.select("#background-svg")
            .attr("width", window.innerWidth)
            .attr("height", window.innerHeight);

        const airplaneData = Array.from({ length: 10 }); // Number of planes

        svg.selectAll("image")
            .data(airplaneData)
            .enter()
            .append("image")
            .attr("xlink:href", airplaneIcon)
            .attr("width", 50)
            .attr("height", 50)
            .attr("x", () => Math.random() * window.innerWidth)
            .attr("y", () => Math.random() * window.innerHeight);

        function animatePlanes() {
            svg.selectAll("image")
                .transition()
                .duration(5000)
                .ease(d3.easeLinear)
                .attr("x", () => Math.random() * window.innerWidth)
                .attr("y", () => Math.random() * window.innerHeight)
                .on("end", animatePlanes); // Loop the animation
        }

        animatePlanes(); // Start the animation
    }, []);

    return (
        <Container maxWidth="lg" style={{ position: "relative", zIndex: 1 }}>
            <svg id="background-svg" style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}></svg>

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="relative"
            >
                <Box
                sx={{
                    p: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 2,
                    width: "300px",
                    position: "fixed",
                    top: "20px",
                    left: "calc(50% - 600px - 32px)",
                    zIndex: 2,
                }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            color: "black",
                            backgroundColor: isQ1Active ? "green" : "white",
                            '&:hover': { backgroundColor: isQ1Active ? "green" : "#f0f0f0" },
                        }}
                        onClick={() => navigate("/Q1")}
                    >
                        Q1
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            color: "black",
                            backgroundColor: isQ2Active ? "green" : "white",
                            '&:hover': { backgroundColor: isQ2Active ? "green" : "#f0f0f0" },
                        }}
                        onClick={() => navigate("/Q2")}
                    >
                        Q2
                    </Button>
                </Box>

                {/* <Box sx={{ p: 3, backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: 2 }} textAlign="center"> */}
                <Box
                    sx={{
                        p: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: 2,
                        width: "600px",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Departure Flight Delay Prediction Dashboard
                    </Typography>

                    {/* Input fields for prediction */}
                    <TextField fullWidth margin="normal" label="Year" name="Year" type="number" value={formData.Year} onChange={handleChange} />
                    <TextField fullWidth select margin="normal" label="Month" name="Month" value={formData.Month} onChange={handleChange}>
                        {monthOptions.map((month) => <MenuItem key={month} value={month}>{month}</MenuItem>)}
                    </TextField>
                    <TextField fullWidth select margin="normal" label="Day" name="Day" value={formData.Day} onChange={handleChange}>
                        {dayOptions.map((day) => <MenuItem key={day} value={day}>{day}</MenuItem>)}
                    </TextField>
                    <TextField fullWidth select margin="normal" label="Day of Week" name="DayOfWeek" value={formData.DayOfWeek} onChange={handleChange}>
                        {dayOfWeekOptions.map((day) => <MenuItem key={day} value={day}>{day}</MenuItem>)}
                    </TextField>
                    <TextField fullWidth margin="normal" label="Departure Time (DepTime)" name="DepTime" type="number" value={formData.DepTime} onChange={handleChange} />
                    <TextField fullWidth margin="normal" label="Scheduled Departure Time (CRSDepTime)" name="CRSDepTime" type="number" value={formData.CRSDepTime} onChange={handleChange} />
                    <TextField fullWidth margin="normal" label="Elapsed Time (CRSElapsedTime)" name="CRSElapsedTime" type="number" value={formData.CRSElapsedTime} onChange={handleChange} />
                    <TextField fullWidth select margin="normal" label="Origin Airport" name="Origin" value={formData.Origin} onChange={handleChange}>
                        {airportOptions.map((airport) => <MenuItem key={airport.value} value={airport.value}>{airport.label}</MenuItem>)}
                    </TextField>
                    <TextField fullWidth select margin="normal" label="Destination Airport" name="Dest" value={formData.Dest} onChange={handleChange}>
                        {airportOptions.map((airport) => <MenuItem key={airport.value} value={airport.value}>{airport.label}</MenuItem>)}
                    </TextField>
                    <TextField fullWidth select margin="normal" label="Carrier" name="Carrier" value={formData.Carrier} onChange={handleChange}>
                        {carrierOptions.map((carrier) => <MenuItem key={carrier.value} value={carrier.value}>{carrier.label}</MenuItem>)}
                    </TextField>
                    <TextField fullWidth margin="normal" label="Flight Number (FlightNum)" name="FlightNum" type="number" value={formData.FlightNum} onChange={handleChange} />
                    <TextField fullWidth margin="normal" label="Departure Hour (DepHour)" name="DepHour" type="number" value={formData.DepHour} onChange={handleChange} />
                    <TextField fullWidth margin="normal" label="Departure Minute (DepMinute)" name="DepMinute" type="number" value={formData.DepMinute} onChange={handleChange} />
                    <TextField fullWidth margin="normal" label="Arrival Hour (ArrHour)" name="ArrHour" type="number" value={formData.ArrHour} onChange={handleChange} />
                    <TextField fullWidth margin="normal" label="Arrival Minute (ArrMinute)" name="ArrMinute" type="number" value={formData.ArrMinute} onChange={handleChange} />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Cancelled"
                        name="Cancelled"
                        type="number"
                        value={formData.Cancelled}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        select
                        margin="normal"
                        label="Time of Day"
                        name="TimeOfDay"
                        value={formData.TimeOfDay}
                        onChange={handleChange}
                    >
                        {timeOfDayOptions.map((time) => (
                            <MenuItem key={time} value={time}>{time}</MenuItem>
                        ))}
                    </TextField>

                    <Button variant="contained" color="primary" onClick={addSearchResult}>
                        Get Prediction
                    </Button>

                    {predictionResult !== null && (
                        <Box mt={3}>
                            <Typography variant="h6">Prediction Result:</Typography>
                            <Typography variant="body1">{predictionResult}</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
}

export default PredictionQueryPage;

                   
