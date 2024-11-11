import { List, ListItem, ListItemText, Box, Typography } from '@mui/material';

// Mapping delay codes to descriptive text and colors
const delayMessages = {
    0: { text: "On time", color: "green" },
    1: { text: "Moderate delay", color: "orange" }, // Amber can be approximated with "orange"
    2: { text: "Major delay", color: "red" }
};

export function PredictiveResultDisplay({ predictionResult }) {
    // Select the message and color based on the prediction result
    const { text, color } = delayMessages[predictionResult] || { text: "No prediction available", color: "gray" };

    return (
        <Box mt={4}>
            <Typography variant="h6" gutterBottom>Prediction Result</Typography>
            <List>
                <ListItem>
                    <ListItemText
                        primary={text}
                        primaryTypographyProps={{ style: { color } }} // Apply color to the text
                    />
                </ListItem>
            </List>
        </Box>
    );
}

export default PredictiveResultDisplay;
