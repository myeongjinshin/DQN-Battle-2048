import React, { useState } from "react";
import { authService, firebaseInstance } from "../fbase";
import { useHistory } from "react-router";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState("");

    const history = useHistory();

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        }
    } 
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            if(newAccount) {
                await authService.signInWithEmailAndPassword(email, password);
            } else {
                await authService.createUserWithEmailAndPassword(email, password);
            }
            history.push("/");
        } catch(error) {
            setError(error.message);
        }
    }

    const toggleAccount = () => setNewAccount((prev) => !prev);

    const onSocialClick = async (event) => {
        const {target:{name}} = event;
        let provider;
        if(name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        }
        await authService.signInWithPopup(provider);
        history.push("/");
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="email" name="email" placeholder="Email" value={email} onChange={onChange} required />
                <input type="password" name="password" placeholder="Password" value={password} onChange={onChange} required />
                <input type="submit" value={newAccount?"Log In":"Register"}/>
            </form>
            <div><h1>{error}</h1></div>
            <span onClick={toggleAccount}>{newAccount?"Register":"Log In"}</span>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
            </div>
        </div>
    );
}


export default Auth;