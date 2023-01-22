import React from "react";
import { Avatar, Card, CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import "./Comment.css";

function Comment(props) {
    const {text, userId, userName} =props;
    

    return(
        <div>
        <Card className='cardMargin card-bg-color' >
            <CardContent>
                <OutlinedInput
                className="outlinedinput-bg-color"
                disabled
                id='outlined-adorment-amount'
                multiline
                inputProps={{ maxLength: 250 }}
                fullWidth
                value={text}  
                startAdornment = {
                    <InputAdornment position="start">
                        <Avatar sx={{ bgcolor: 'red[500]' }} aria-label="recipe">
                                {userName.charAt(0).toUpperCase()}   
                        </Avatar>
                    </InputAdornment>
                }              
                >

                </OutlinedInput>
            </CardContent>
        </Card>
        </div>
    )
}

export default Comment;