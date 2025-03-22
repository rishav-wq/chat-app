import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from '../config/firebase'; // Adjust path if needed

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const navigate = useNavigate();
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const [chatVisible, setChatVisible] = useState(false)

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);

            if (userData.avatar && userData.name) {
                navigate('/chat');
            } else {
                navigate('/profile');
            }

            // Update lastSeen when the user is active
            await updateDoc(userRef, {
                lastSeen: Date.now(),
            });

            // Create an interval to update lastSeen every 60 seconds
            const intervalId = setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now(),
                    });
                }
            }, 60000);

            // Cleanup the interval when the component unmounts or `userData` changes
            return () => clearInterval(intervalId);
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, 'chats', userData.id);
            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data().chatsData;
            
                const tempData = [];

                for (const item of chatItems) {
                    const userRef = doc(db, 'users', item.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    tempData.push({ ...item, userData }); // Merge item and userData into one object
                }

                setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
            });

            // Cleanup the subscription when the component unmounts
            return () => {
                unSub();
            };
        }
    }, [userData]); // Add `userData` as a dependency to ensure it only runs when `userData` changes

    const value = {
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData,
        messages,
        setMessages,
        messagesId,
        setMessagesId,
        chatUser,
        setChatUser,
        chatVisible, 
        setChatVisible
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
