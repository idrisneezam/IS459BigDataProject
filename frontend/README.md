# BDA Consumers Web UI Design

## Overview

The **BDA Consumers Web UI** is a React-based frontend application that enables users to interact with and display predictive analytics data. Built using Vite and Material-UI, this UI provides a streamlined and responsive interface for users to query and view airline data, including potential delays. The project is designed for quick integration with an API service and customizable components.

## Table of Contents

- [Getting Started](#getting-started)
- [Main Pages](#main-pages)
- [Components](#components)
- [API Integration](#api-integration)
- [Use of Material-UI](#use-of-material-ui)

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Initialize the Project

1. **Navigate to the Project Directory**:
    ```sh
    cd frontend
    ```

2. **Install the Dependencies**:
    ```sh
    npm install
    ```
    Alternatively, you can use:
    ```sh
    npm ci
    ```
    > `npm ci` is faster and ensures that dependencies match the `package-lock.json` file exactly.

3. **Run the Project**:
    ```sh
    npm run dev
    ```
    This command starts the development server using Vite.

4. **Open the Browser**:
    Navigate to `http://localhost:5173` to view the app.

## Main Pages

### PredictionQueryPage

The main prediction page includes the **Departure Flight Delay Prediction Dashboard**, where users can select a carrier and destination, enter flight details, and view predictions on potential delays. The page is structured with a header, form components, and a results display section.

- **Predictive Query Form**: Allows users to enter flight information and submit data to generate predictions.
- **Result Display**: Shows predictions based on the input data, including delay information.

## Components

This project includes several core components, each handling a specific aspect of the UI and functionality:

### `PredictiveForm`

- **Purpose**: Renders a form where users can input flight information (e.g., carrier, destination, flight time) to query prediction results.
- **Key Fields**: Carrier, Destination, Flight Number, Date, and Time.
- **Event Handling**: Submits form data to trigger predictions based on API responses.

### `PredictiveResultDisplay`

- **Purpose**: Displays the results of the prediction query, showing delay information if available.
- **Functionality**: Maps the response data from the API to a user-friendly format. Color-codes delay levels (e.g., green for "On time", orange for "Moderate delay", red for "Major delay").

## API Integration

The project integrates with a backend API using Axios for making HTTP requests. This API provides predictive results based on flight data, allowing users to view potential delays and other relevant information.

### Axios Service

The Axios service is configured to manage API calls in a centralized and reusable way, facilitating data fetching and error handling.

- **Purpose**: Manages communication with the backend API for querying predictive results on flight delays.
- **Endpoint**: The API endpoint URL is `https://fyj8mwh28k.execute-api.us-east-1.amazonaws.com/generateoutputahmad`.

### `fetchOutputResults` Function

The `fetchOutputResults` function is responsible for sending form data to the backend API and retrieving predictive results.

- **Purpose**: Retrieves predictive results based on user input from the form. This function formats and sends a `POST` request to the API endpoint and processes the JSON response.
- **Parameters**: Accepts `formData` as input, which includes fields such as carrier, destination, flight date, and time.
- **Returns**: Returns the prediction result from the API, which may include delay information categorized by levels (e.g., "On time", "Moderate delay", "Major delay").

### Code Snippet

The following code demonstrates the setup of the Axios service and the `fetchOutputResults` function.

```javascript
// src/services/apiService.js

import axios from 'axios';

const API_URL = '<Specify API Endpoint URL> (e.g., a Lambda function or external API)';

// Send prediction data to the API and retrieve the result
export async function fetchOutputResults(formData) {
    try {
        const response = await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching prediction results:', error);
        throw error;
    }
}
```

## Use of Material-UI

Material-UI was chosen for its rich library of customizable components that simplify and accelerate UI development. Key advantages include:

- **Predefined Components**: Leverages Material-UI's extensive library of components (e.g., `TextField`, `Button`, `Container`) for building forms and lists.
- **Responsive Design**: Supports responsive design out-of-the-box, ensuring a consistent user experience across devices.
- **Theming and Styling**: Provides robust theming options for consistent styling, including color-coding for prediction results (e.g., green for "On time" and red for "Major delay").
