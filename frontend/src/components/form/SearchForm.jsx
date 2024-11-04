import { useState } from "react";
import { TextField, Box, Button } from "@mui/material";

export function SearchForm({ onSearchSubmit }) {

    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = (event) => {
        const newSearchQuery = event.target.value;
        setSearchQuery(newSearchQuery);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim()) {  
            onSearchSubmit(searchQuery);  
            setSearchQuery("");
        }
    };
    
    return (
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                label="author name"
                variant="outlined"
                value={searchQuery}
                onChange={handleInputChange}
                sx={{ mr: 2, flex: 1 }}
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    );

};

export default SearchForm;