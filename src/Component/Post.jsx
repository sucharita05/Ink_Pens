import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@mui/material/TablePagination';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: 'wheat',
    },
    heading: {
        fontSize: theme.typography.pxToRem(18),
        fontWeight: theme.typography.fontWeightBold,
    },
    content: {
        fontSize: theme.typography.pxToRem(14),
        fontWeight: theme.typography.fontWeightRegular,
        textAlign: "left",
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
    },
    table: {
        minWidth: 650,
    },
    tableheader: {
        fontWeight: theme.typography.fontWeightBold,
        color: "#ffffff",
        background: "#3f51b5"
    },
    tableCell: {
        background: "#f50057"
    },
    button: {
        fontSize: "12px",
        minWidth: 100
    }
}));

const Post = () => {
    const baseUrl = 'https://hn.algolia.com/api/v1/search_by_date?tags=story&page=';
    const [rows, setRows] = useState([]);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [tablePage, setTablePage] = useState(0);
    const rowsPerPage = 20;

    useEffect(() => {
        getPosts();
    }, [page]);

    useEffect(() => {
        let oldposts = posts;
        rows.forEach(post => {
            oldposts.push(post);
        });
        setPosts(oldposts);
    }, [rows]);

    const getPosts = () => {
        let url = baseUrl + page;
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        console.log(data);
                        if (data && data.hits.length > 0) {
                            let newposts = [];
                            data.hits.forEach(post => {
                                newposts.push({
                                    id: post.objectID,
                                    title: post.title,
                                    url: post.url,
                                    author: post.author
                                });
                            });
                            setRows(newposts);
                        }
                    });
                } else {
                    throw new Error('something went wrong while requesting posts');
                }
                setTimeout(() => {
                    let newPage = page;
                    newPage += 1;
                    setPage(newPage);
                }, 10000);
            })
            .catch((err) => console.log(err.message));
    }

    const handleChangePage = (event, newPage) => {
        setTablePage(newPage);
    }

    const classes = useStyles();

    return (
        <>{posts && posts.length > 0 ? (<div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} className={classes.content}>
                    <TableContainer component={Paper}>
                        <Table id="split_table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>URL</TableCell>
                                    <TableCell>Author</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {posts.slice(tablePage * rowsPerPage, tablePage * rowsPerPage + rowsPerPage).map((item, index) => (
                                    <TableRow key={index} selected={false}>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.url}</TableCell>
                                        <TableCell>{item.author}</TableCell>
                                    </TableRow>))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={posts.length}
                        rowsPerPageOptions={[20]}
                        rowsPerPage={rowsPerPage}
                        page={tablePage}
                        onPageChange={handleChangePage}
                    />
                </Grid>
            </Grid>
        </div>) : 'Loading data...'}
        </>
    )
}

export default Post;
