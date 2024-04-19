import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/'
import { doCreateUserWithEmailAndPassword } from '../firebase/auth'
import '../home.css'

const Register = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()


        if (!isRegistering) {
            try {
                await doCreateUserWithEmailAndPassword(email, password)
                alert("Successfully created an account.");

            } catch (error) {
                console.error("Sign-in error:", error.message);
                alert("Sorry. something went wrong.");
            } finally {
            }

        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <div class="parent">

                <div class="child">
                    <div class="left">
                        <h3>BRAIN TUMOR DETECTION</h3>
                        <br />
                        <h4>I am a Deep learning model. I can classify brain tumors upto 4 types. Try me out!</h4>
                        <br />
                        <br />
                        <Link to={'/login'}> <button class="upload">
                            Create an account here 📝
                        </button>
                        </Link>

                    </div>
                    <div class="right">
                        <form onSubmit={onSubmit}>
                            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} class="upload" placeholder="Email" required />
                            <input type="text" class="upload" value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Username" required />
                            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} class="upload" placeholder="password" required />
                            <input type="password" value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value) }} class="upload" placeholder="confirm password" required />
                            <button class="upload" type="submit" id="myButton">
                                Signup 🔓
                            </button>
                        </form>

                    </div>


                </div>
            </div>
        </>
    )
}

export default Register