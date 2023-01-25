import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import './Post.css';
import { Link } from 'react-router-dom';
import { Button, OutlinedInput } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function PostForm(props) {
    const { userId, userName, refreshPost } = props;
    const [expanded, setExpanded] = useState(false);
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [isSent, setIsSent] = useState(false);

    const savePost = () => {
        fetch("/posts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")

                },
                body: JSON.stringify({
                    title: title,
                    userId: userId,
                    text: text
                }),
            })
            .then((res) => res.json())
            .catch((err) => console.log("error"))
    }


    const handleSubmit = () => {
        savePost();
        setIsSent(true);
        setTitle("");
        setText("");
        refreshPost();
    }
    const handleTitle = (value) => {
        setTitle(value);
        setIsSent(false);

    }
    const handleText = (value) => {
        setText(value);
        setIsSent(false);

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setIsSent(false);
    };

    return (
        <>
            <Card className='cardMargin' >
                <CardHeader
                    // avatar={                       
                    //     <Link className="link" to={"/users/"+userId}> 
                    //         {userName}
                    //         <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    //             {userName.charAt(0).toUpperCase()}   
                    //         </Avatar>
                    //     </Link>     

                    // }

                    title={
                        <OutlinedInput
                            id='outlined-adorment-amount'
                            multiline
                            placeholder='Title'
                            inputProps={{ maxLength: 25 }}
                            fullWidth
                            value={title}
                            onChange={(i) => handleTitle(i.target.value)}
                        >

                        </OutlinedInput>
                    }
                />

                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        <OutlinedInput
                            id='outlined-adorment-amount'
                            multiline
                            placeholder='Text'
                            inputProps={{ maxLength: 250 }}
                            fullWidth
                            value={text}
                            onChange={(i) => handleText(i.target.value)}
                        >

                        </OutlinedInput>
                    </Typography>
                </CardContent>

                <CardContent>
                    <Button
                        variant='contained'
                        fullWidth
                        onClick={handleSubmit}
                    >Post it
                    </Button>
                    <Snackbar 
                        open={isSent} 
                        autoHideDuration={6000} 
                        onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            Your post is sent!
                            </Alert>
                    </Snackbar>
                </CardContent>



            </Card>

        </>
    )
}

export default PostForm;
