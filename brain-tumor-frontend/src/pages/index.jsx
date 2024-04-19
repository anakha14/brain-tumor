import React, { useEffect, useState } from 'react'
import '../home.css';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context';
import { setDoc, doc, serverTimestamp, arrayUnion, Timestamp } from 'firebase/firestore';
import { db, storage } from "../firebase/firebase";
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Home = () => {
    const { userLoggedIn } = useAuth()
    const { currentUser } = useAuth()
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    const [classtype, setClasstype] = useState();
    const [imageurl, setImageurl] = useState(null);
    const [percentage, setPercentage] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);


    const uploadFile = () => {
        setIsPredicting(true)
        const img_unique_id = uuid();
        const storageRef = ref(storage, img_unique_id);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                setPercentage(progress);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageurl(downloadURL);
                    console.log('completed')
                    console.log(downloadURL)
                    console.log('completed')
                    handleUpload(downloadURL);
                });
            }
        );
        setIsPredicting(false)
    };


    const handleUpload = async (downloadURL) => {
        if (file) {
            const imageData = new FormData();
            imageData.append('image', file);
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: imageData,
            });
            const data = await response.json();
            setClasstype(data.data['class']);
            console.log(data.data['class']);


            const userDocRef = doc(db, "users", currentUser.email);
            console.log(imageurl)
            console.log(data.data['class'])
            await setDoc(userDocRef, {
                uploads: arrayUnion({
                    imageURL: downloadURL,
                    result: data.data['class'],
                    timestamp: Timestamp.now(),
                }),
            }, { merge: true });
            console.log('Upload details stored in Firestore');
        }
    };

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    }, [file]);

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div class="parent">
            {!userLoggedIn && (<Navigate to={'/login'} replace={true} />)}
            <div class="child">
                <div class="left">
                    {classtype && <h3> This is <strong>{classtype}</strong></h3>}
                    {!classtype && <h3><strong>BRAIN TUMOR DETECTION</strong></h3>}

                    <br />
                    <h4 className='desc'>I am a Deep learning model. I can classify brain tumors upto 4 types. Try me out!</h4>
                    <br />
                    <br />
                    {!preview && <button class="upload">
                        pick an image 👉
                    </button>
                    }
                    {!isPredicting && <> {preview && <button class="upload" onClick={uploadFile}>
                        Predict
                    </button>}</>}

                    {isPredicting && <> {preview && <button class="upload" >
                        ⏳
                    </button>}</>}

                    {classtype && <button class="upload" onClick={handleReload}>
                        Check another
                    </button>}



                </div>
                <div class="right">
                    <form action="/submit" method="POST" enctype="multipart/form-data">
                        <div class="container">


                            {preview && <img src={preview} alt="Preview" />}

                            {!preview && <label for="fileInput" id="dropArea">
                                <input type="file" id="fileInput" accept="image/*" hidden name="image" onChange={(e) => {
                                    setFile(e.target.files[0])
                                }} />
                                <div id="img-view">
                                    <p>pick an image</p>
                                </div>


                            </label>
                            }



                        </div>
                    </form>
                </div>


            </div>
        </div>
    )
}

export default Home