import Post from "../Post/Post";
import React, { useState, useEffect } from 'react';
import './Home.css';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import PostForm from "../Post/PostForm";

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    const refreshPost = () => {

        fetch("/posts")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPostList(result)
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    useEffect(() => {
        refreshPost()
    }, [postList])

    if (error) {
        return <div>Errorrr!!</div>
    }
    else if (!isLoaded) {
        return <div>Loading...</div>
    }
    else {
        return (
            <div>
            <React.Fragment>
                    <CssBaseline />
                    <Container fixed className="homeContainer">
                        <PostForm
                            userId={1}
                            userName={"post.userName"}
                            title={"post.title"}
                            text={"post.text"}
                            refreshPost = {refreshPost}    
                        >
                        
                        </PostForm>
                       
                        {postList.map(post => (
                        <Post
                            key={post.id}
                            userId={post.userId}
                            userName={post.userName}
                            title={post.title}
                            text={post.text}
                            postId={post.id}
                            likes ={post.postLikes}
                        >
                            
                        </Post>

                    ))}
                    </Container>
            </React.Fragment>
            </div>
        )
    }
}

export default Home;