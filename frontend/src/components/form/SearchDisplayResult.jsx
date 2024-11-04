import { List, ListItem, ListItemText, Box } from '@mui/material';

export function SearchDisplayResult({ searchResult }) {
    return (
        <Box>
            <List>
                {searchResult?.length > 0 ? (
                    searchResult.map((result, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={result}  />
                        </ListItem>
                    ))
                ) : (
                    <ListItem>
                        <ListItemText primary="No results found" />
                    </ListItem>
                )}
            </List>
        </Box>
    );
}

export default SearchDisplayResult;
