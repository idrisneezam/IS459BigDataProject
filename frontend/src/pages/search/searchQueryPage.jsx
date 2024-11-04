import { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { SearchForm, SearchDisplayResult } from "@/components/form";
import { UserList } from "@/components/users";

export function SearchQueryPage() {

    const [searchResults, setSearchResults] = useState([]);

    const addSearchResult = (newResult) => {
        setSearchResults((prevSearchResults) => [...prevSearchResults, newResult]);
    };

    return (
        <Container maxWidth="sm">
            <Box my={4} textAlign="center">
                <Typography variant="h4" component="h1" gutterBottom>
                    Author Names Submission
                </Typography>
                <SearchForm onSearchSubmit={addSearchResult} />
                <SearchDisplayResult searchResult={searchResults} />
            </Box>
            <UserList />
        </Container>
    );
}

export default SearchQueryPage;