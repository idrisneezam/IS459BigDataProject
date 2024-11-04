import { useEffect, useState } from 'react';
import { fetchUsers } from '@/services/UserListService';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper, IconButton, Collapse, Box, Typography, CircularProgress } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.id}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.website}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Additional Information
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Address: {row.address.suite}, {row.address.street}, {row.address.city}, {row.address.zipcode}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Geo: Lat {row.address.geo.lat}, Lng {row.address.geo.lng}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Company: {row.company.name} - {row.company.catchPhrase}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const retrieveUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data); // Map the fetched users to include additional info
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users.');
            } finally {
                setLoading(false);
            }
        };
        retrieveUsers();
    }, []);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: '2rem' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: '2rem' }}>
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom sx={{ marginY: 4 }}>
                User List
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Serial No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Website</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <Row key={user.id} row={user} />
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5} />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default UserList;
