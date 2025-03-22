import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut, sendPasswordResetEmail } from "firebase/auth"; // ✅ Fix: Added missing import
import { getFirestore, setDoc, doc, collection, getDocs } from "firebase/firestore"; // ✅ Fix: Added missing import
import { toast } from "react-toastify";
import { query,where } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCRtppvtlR0qfBfJ2dUy_tN_Sb7Uib3Sts",
    authDomain: "chat-app-gs-e9917.firebaseapp.com",
    projectId: "chat-app-gs-e9917",
    storageBucket: "chat-app-gs-e9917.firebasestorage.app",
    messagingSenderId: "645065367171",
    appId: "1:645065367171:web:79be8f497a87b7b5f4c5b6"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password) => {
    try{
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar:"",
            bio:"Hey, There i am using chat-app",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatsData:[]
        })
    }
    catch(error){
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email, password) => {
    try{
        await signInWithEmailAndPassword(auth,email,password);
    }
    catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}
const logout = async () => {
    try{
        await signOut(auth);
    }
    catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const resetPass = async (email) => {
    if(!email){
        toast.error("Enter your email");
        return null;
    }
    try {
        const userRef = collection(db,'users')
        const q = query(userRef,where("email","==",email));
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth,email);
            toast.success("Reset Email Sent");
        }
        else{
            toast.error("Email doesn't exist")
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}

export {auth,signup,login,logout,db,resetPass}