import React, { useState, useEffect, useRef } from 'react';
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
import { Container } from '@mui/material';
import Comment from '../Comment/Comment';
import CommentForm from '../Comment/CommentForm';


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function Post(props) {
    const { userId,userName, title, text, postId,likes } = props;
    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [commentList,setCommentList]=useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const isInitialMount = useRef(true);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [likeId, setLikeId] = useState(null);

    let disabled =localStorage.getItem("currentUser") == null ? true : false;

    const handleExpandClick = () => {
        setExpanded(!expanded);
        refreshComments();
    };
    const handleLike = () => {
        setIsLiked(!isLiked);
        if(!isLiked){
            saveLike();
            setLikeCount(likeCount+1)
        }
        else{
            deleteLike();
            setLikeCount(likeCount-1)
        }
    };
    const refreshComments = () => {

        fetch("/comments?postId"+postId)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setCommentList(result)
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const saveLike = () => {
        fetch("/likes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")
                },
                body: JSON.stringify({
                    postId: postId,
                    userId: localStorage.getItem("currentUser")
                }),
            })
            .then((res) => res.json())
            .catch((err) => console.log("error"))
    }

    const deleteLike = () => {
        fetch("/likes/"+likeId ,{
            method:"DELETE",
            headers: {
                "Authorization": localStorage.getItem("tokenKey")
            }
        })
        .catch((err) => console.log(err))
    }

    const checkLikes = () => {
        var likeControl = likes.find((like =>  ""+like.userId === localStorage.getItem("currentUser")));
        if(likeControl != null){
          setLikeId(likeControl.id);
          setIsLiked(true);
        }
      }

    useEffect(() => {
       if (isInitialMount.current) {
         isInitialMount.current=false;
       } else {
        refreshComments();
       }
    }, [commentList])

    useEffect(() => {checkLikes()},[])
    return (
        <>
            <Card className='cardMargin' >
                <CardHeader
                    avatar={                       
                        <Link className="link" to={"/users/"+userId}> 
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {userName.charAt(0).toUpperCase()}   
                            </Avatar>
                        </Link>     
                                          
                    }
                   
                    title={
                        <div className='titleStyle'>{title}</div>
                    }
                />

                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        
                            {text}
                       
                        
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    
                {disabled ?                    
                  <IconButton 
                    disabled
                    onClick={handleLike}
                    aria-label="add to favorites"
                    >
                    <FavoriteIcon style={isLiked? { color: "red" } : null} />
                    </IconButton> :
                    <IconButton 
                    onClick={handleLike}
                    aria-label="add to favorites"
                    >
                    <FavoriteIcon style={isLiked? { color: "red" } : null} />
                    </IconButton>
                  }
                    {likeCount}
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <CommentIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Container fixed >
                    {error? "error" :
                    isLoaded? commentList.map(comment => (
                      <Comment userId = {1} userName = {"user"} text = {comment.text}></Comment>
                    )) : "Loading"}

                    {disabled ? "" :
                        <CommentForm 
                        userId={localStorage.getItem("currentUser")}
                        userName={localStorage.getItem("userName")}
                        postId={postId}>

                        </CommentForm>
                    }
                      
                    </Container>
                </Collapse>
            </Card>
            
        </>
    )
}

export default Post;
