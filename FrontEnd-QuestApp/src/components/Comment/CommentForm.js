import React, { useState } from "react";
import { Avatar, Button, Card, CardContent, InputAdornment, OutlinedInput } from "@mui/material";

function CommentForm(props) {
    const {userId, userName, postId} =props;
    const [text, setText] = useState("");

 
    const saveComment = () => {
        fetch("/comments",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")

                },
                body: JSON.stringify({
                    postId:postId,
                    userId: userId,
                    text: text
                }),
            })
            .then((res) => res.json())
            .catch((err) => console.log("error"))
    }


    const handleSubmit = () => {
        saveComment();
        setText("");
       
    }

    const handleChange = (value) =>{
        setText(value);
    }

    return(
        <div>
        <Card className='cardMargin '  >
            <CardContent>
                <OutlinedInput
                
                id='outlined-adorment-amount'
                multiline
                inputProps={{ maxLength: 250 }}
                fullWidth
                onChange={(i) => handleChange(i.target.value)}
                value={text}
                startAdornment = {
                    <InputAdornment position="start">
                        <Avatar sx={{ bgcolor: 'red[500]' }} aria-label="recipe">
                                {userName.charAt(0).toUpperCase()}   
                        </Avatar>
                    </InputAdornment>
                }
                
                endAdornment = {
                    <InputAdornment position="end">
                        <Button
                        variant='contained'
                        onClick={handleSubmit}
                    >New Comment
                    </Button>
                    </InputAdornment>
                }
                >

                </OutlinedInput>
            </CardContent>
        </Card>
        </div>
    )
}

export default CommentForm;