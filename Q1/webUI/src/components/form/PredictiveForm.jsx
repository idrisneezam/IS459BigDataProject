import { useState } from "react";
import { TextField, Box, Button, MenuItem, Typography } from "@mui/material";

import { airlineCodes, selectedDestinations } from "@/data/constants";

export function PredictiveForm({ onSubmitPrediction }) {

    // data format to be confirmed here for each form fields
    const [formData, setFormData] = useState({
        Year: '',
        Month: '',
        Day: '',
        DayOfWeek: '',
        DepTime: '',
        CRSDepTime: '',
        CRSElapsedTime: '',
        Origin: '',
        Dest: '',
        Carrier: '',
        FlightNum: '',
        DepHour: '',
        DepMinute: '',
        ArrHour: '',
        ArrMinute: '',
        Cancelled: 0,
        TimeOfDay: 'Morning',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmitPrediction(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" gutterBottom>Flight Prediction System Checker</Typography>
            <TextField label="Year" name="Year" type="number" value={formData.Year} onChange={handleChange} required />
            <TextField label="Month" name="Month" type="number" value={formData.Month} onChange={handleChange} required />
            <TextField label="Day" name="Day" type="number" value={formData.Day} onChange={handleChange} required />
            <TextField label="Day of Week" name="DayOfWeek" type="number" value={formData.DayOfWeek} onChange={handleChange} required />
            <TextField label="Departure Time" name="DepTime" type="number" value={formData.DepTime} onChange={handleChange} required />
            <TextField label="Scheduled Departure Time (CRS)" name="CRSDepTime" type="number" value={formData.CRSDepTime} onChange={handleChange} required />
            <TextField label="Elapsed Time (CRS)" name="CRSElapsedTime" type="number" value={formData.CRSElapsedTime} onChange={handleChange} required />
            <TextField label="Origin" name="Origin" type="number" value={formData.Origin} onChange={handleChange} required />
            {/* Carrier selection */}
            <TextField
                label="Carrier"
                name="Carrier"
                select
                value={formData.Carrier}
                onChange={handleChange}
                required
            >
                {airlineCodes.map((carrier) => (
                    <MenuItem key={carrier.Index} value={carrier.Index}>
                        {carrier.Code} - {carrier.Description}
                    </MenuItem>
                ))}
            </TextField>

            {/* Destination selection */}
            <TextField
                label="Destination"
                name="Destination"
                select
                value={formData.Destination}
                onChange={handleChange}
                required
            >
                {selectedDestinations.map((destination) => (
                    <MenuItem key={destination.Code} value={destination.Code}>
                        {destination.Code} - {destination.Description}
                    </MenuItem>
                ))}
            </TextField>
            <TextField label="Flight Number" name="FlightNum" type="number" value={formData.FlightNum} onChange={handleChange} required />
            <TextField label="Departure Hour" name="DepHour" type="number" value={formData.DepHour} onChange={handleChange} required />
            <TextField label="Departure Minute" name="DepMinute" type="number" value={formData.DepMinute} onChange={handleChange} required />
            <TextField label="Arrival Hour" name="ArrHour" type="number" value={formData.ArrHour} onChange={handleChange} required />
            <TextField label="Arrival Minute" name="ArrMinute" type="number" value={formData.ArrMinute} onChange={handleChange} required />
            <TextField
                label="Cancelled"
                name="Cancelled"
                select
                value={formData.Cancelled}
                onChange={handleChange}
                required
            >
                <MenuItem value={0}>No</MenuItem>
                <MenuItem value={1}>Yes</MenuItem>
            </TextField>
            <TextField
                label="Time of Day"
                name="TimeOfDay"
                select
                value={formData.TimeOfDay}
                onChange={handleChange}
                required
            >
                <MenuItem value="Morning">Morning</MenuItem>
                <MenuItem value="Afternoon">Afternoon</MenuItem>
                <MenuItem value="Evening">Evening</MenuItem>
                <MenuItem value="Night">Night</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" color="primary">Submit Prediction</Button>
        </Box>
    );
}


export default PredictiveForm;