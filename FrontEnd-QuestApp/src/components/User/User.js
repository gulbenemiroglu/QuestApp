import React from "react";
import { useParams } from "react-router-dom";

function User(){

    const {userId} = useParams();

    return(
        <div>
            User!! userid:{userId} 
        </div>
    )
}

export default User;