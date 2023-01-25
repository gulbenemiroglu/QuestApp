import React, {useState} from "react";
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText'
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { PostWithoutAuth } from "../../services/HttpService";
function Auth() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    let navigate = useNavigate();
    
    const handleUsername = (value) => {
         setUsername(value)
     } 

    const handlePassword = (value) => {
         setPassword(value)
     } 


    const handleButton = (path) => {
         sendRequest(path)
         setUsername("")
         setPassword("")  
         navigate("/auth");
        
     }

   
    const sendRequest = (path) => {
        fetch("/auth/" + path,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")

                },
                body: JSON.stringify({
                    userName: username,
                    password:password
                }),
            })
            .then((res) => res.json())
            .then((result) => {localStorage.setItem("tokenKey",result.message);
                               localStorage.setItem("currentUser",result.userId);
                               localStorage.setItem("userName",username)})
            .catch((err) => console.log(err))
    }

    return(
        <>
       
        <FormControl>
            
            <InputLabel>Username</InputLabel>
            <Input  
            onChange = {(i) => handleUsername(i.target.value)}
            
            />
            <InputLabel  style={{top: 80}}>Password</InputLabel>
            <Input  style={{top: 40}}
            onChange = {(i) => handlePassword(i.target.value)}
            />
            <Button variant = "contained"
                style = {{marginTop : 60,
                background :'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color : 'white'}}
                onClick= {() => handleButton("register")}
                
            >Register</Button>
            <FormHelperText style={{margin:20}}>Are you already registered?</FormHelperText>
            <Button variant = "contained"
                style = {{
                background :'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color : 'white'}}
               onClick={() => handleButton("login")}
            
            >Login</Button>
            
        </FormControl>
        </>
 
    )

}
export default Auth;