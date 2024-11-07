import { useState } from "react";
import { Container, Typography, Box, TextField, Button, MenuItem } from "@mui/material";
import { fetchOutputResults } from "@/services/GeneratePredictiveOutputService";

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

export function PredictionQueryPage() {
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
            setPredictionResult(getDelayDescription(result.predictions[0]))
        } catch (error) {
            console.error("Failed to fetch prediction results:", error);
            setPredictionResult("Error: Unable to get prediction");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ p: 3 }} textAlign="center">
                <Typography variant="h4" component="h1" gutterBottom>
                    Departure Flight Delay Prediction Dashboard
                </Typography>
                
                <TextField
                    fullWidth
                    margin="normal"
                    label="Year"
                    name="Year"
                    type="number"
                    value={formData.Year}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="Month"
                    name="Month"
                    value={formData.Month}
                    onChange={handleChange}
                >
                    {monthOptions.map((month) => (
                        <MenuItem key={month} value={month}>{month}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="Day"
                    name="Day"
                    value={formData.Day}
                    onChange={handleChange}
                >
                    {dayOptions.map((day) => (
                        <MenuItem key={day} value={day}>{day}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="Day of Week"
                    name="DayOfWeek"
                    value={formData.DayOfWeek}
                    onChange={handleChange}
                >
                    {dayOfWeekOptions.map((day) => (
                        <MenuItem key={day} value={day}>{day}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Departure Time (DepTime)"
                    name="DepTime"
                    type="number"
                    value={formData.DepTime}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Scheduled Departure Time (CRSDepTime)"
                    name="CRSDepTime"
                    type="number"
                    value={formData.CRSDepTime}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Elapsed Time (CRSElapsedTime)"
                    name="CRSElapsedTime"
                    type="number"
                    value={formData.CRSElapsedTime}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="Origin Airport"
                    name="Origin"
                    value={formData.Origin}
                    onChange={handleChange}
                >
                    {airportOptions.map((airport) => (
                        <MenuItem key={airport.value} value={airport.value}>{airport.label}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="Destination Airport"
                    name="Dest"
                    value={formData.Dest}
                    onChange={handleChange}
                >
                    {airportOptions.map((airport) => (
                        <MenuItem key={airport.value} value={airport.value}>{airport.label}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="Carrier"
                    name="Carrier"
                    value={formData.Carrier}
                    onChange={handleChange}
                >
                    {carrierOptions.map((carrier) => (
                        <MenuItem key={carrier.value} value={carrier.value}>{carrier.label}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Flight Number (FlightNum)"
                    name="FlightNum"
                    type="number"
                    value={formData.FlightNum}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Departure Hour (DepHour)"
                    name="DepHour"
                    type="number"
                    value={formData.DepHour}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Departure Minute (DepMinute)"
                    name="DepMinute"
                    type="number"
                    value={formData.DepMinute}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Arrival Hour (ArrHour)"
                    name="ArrHour"
                    type="number"
                    value={formData.ArrHour}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Arrival Minute (ArrMinute)"
                    name="ArrMinute"
                    type="number"
                    value={formData.ArrMinute}
                    onChange={handleChange}
                />

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
        </Container>
    );
}

export default PredictionQueryPage;
