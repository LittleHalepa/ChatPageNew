import "./Styles/ChatPage.css";
import { useState, useContext, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { collection, query, where, getDoc, updateDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db, storage } from "./firebase";
import { AuthContext } from "./context/AuthContext";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { ref, getDownloadURL } from "firebase/storage";

function ChatPage() {

  const [img, setImg] = useState(null);
  const [currentChat, setCurrentChat] = useState("No one selected!");
  const [selectedFriendIndex, setSelectedFriendIndex] = useState(null);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const ref1 = useRef();

  useEffect(() => {
    ref1.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      }
    }

    currentUser.uid && getChats();

  }, [currentUser.uid]);

  console.log(chats);

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setUser(userData);
        setChats(c => ({...c, [userData.uid]: {userInfo: {uid: userData.uid, displayName: userData.displayName}}}));
        // setFriendsList(f => [...f, userData.displayName]);
      });
      
    } catch (err) {
      setErr(true);
    }
  }

  function handleFindClick(event) {
    handleSearch();
  }

  function handleFindKeyDown(event) {
    if (event.key === "Enter") {
      handleFindClick();
    }
  }

  function handleDeleteClick(index) {
    
    const friendToDelete = Object.entries(chats)[index][1].userInfo.displayName;
    const friendToDeleteUid = Object.entries(chats)[index][1].userInfo.uid;
    const combinedId = currentUser.uid > friendToDeleteUid ? currentUser.uid + friendToDeleteUid : friendToDeleteUid + currentUser.uid;
    const chatRef = doc(db, "chats", combinedId);

    deleteDoc(chatRef);

    updateDoc(doc(db, "userChats", currentUser.uid), {
      [combinedId]: null,
    });

    updateDoc(doc(db, "userChats", friendToDeleteUid), {
      [combinedId]: null,
    });

    setChats(Object.fromEntries(Object.entries(chats).filter(([key, value]) => key !== friendToDeleteUid)));
    setMessages([]);
    setCurrentChat("No one selected!");

  }

  useEffect(() => {
    if (user) {
      const setupChat = async () => {
        console.log("User found:", user);

        //create user chats
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        try {
          const res = await getDoc(doc(db, "chats", combinedId));

          if (!res.exists()) {
            //create chat in chats collection
            await setDoc(doc(db, "chats", combinedId), { messages: [] });
          }
          //create user chats
          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [combinedId + ".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
            },
          });

          await updateDoc(doc(db, "userChats", user.uid), {
            [combinedId + ".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
            },
          });
        } catch (err) {
          console.error("Error creating user chats:", err);
        }
      };

      setupChat();
    }
  }, [user]);

  useEffect(() => {
    if (username) {
      const searchUser = async () => {
        const q = query(collection(db, "users"), where("displayName", "==", username));
  
        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(async (doc) => {
            const userData = doc.data();
            setUser(userData);
          });
        } catch (err) {
          setErr(true);
        }
      };
  
      searchUser();
    }
  }, [username]);

  useEffect(() => {
    if (user) {
      const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
      const unsub = onSnapshot(doc(db, "chats", combinedId), (doc) => {
        const data = doc.data();
        if (data) {
          setMessages(data.messages);
        }
      });
  
      return () => {
        unsub();
      }
    }
  }, [user, currentUser.uid]);
  

  async function handleSelectChat(event, index) {

    const newCurrentChat = event.target.tagName === "H2" ? event.target.innerText : event.target.querySelector(".chat-list-item h2").innerText;
    if (newCurrentChat === currentChat) {
      return;
    }
    setCurrentChat(newCurrentChat);
    setSelectedFriendIndex(index);
    setMessages([]);
    setUsername(newCurrentChat);
  }

  const setupChat = async (userData) => {
    if (!userData) {
      console.error("User not found");
      return;
    }
  
    console.log("User found:", userData);
  
    //create user chats
    const combinedId = currentUser.uid > userData.uid ? currentUser.uid + userData.uid : userData.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
  
      if (!res.exists()) {
        //create chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
      }
      //create user chats
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: userData.uid,
          displayName: userData.displayName,
        },
      });
  
      await updateDoc(doc(db, "userChats", userData.uid), {
        [combinedId + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
        },
      });
    } catch (err) {
      console.error("Error creating user chats:", err);
    }
  };

  function handleAddMessage() {
    if (currentChat === "No one selected!") {
      return;
    }

    const newMessage = document.querySelector(".message-input").value;
    const newMessageSender = currentUser.displayName;

    if (img) {
      setIsLoading(true);
      const storageRef = ref(storage, uuidv4());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error("Upload failed:", error);
          setIsLoading(false);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);

            setMessages(m => [...m, { message: newMessage, sender: newMessageSender, img: downloadURL }]);
            const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
            const chatRef = doc(db, "chats", combinedId);
            await updateDoc(chatRef, {
              messages: [...messages, { message: newMessage, sender: newMessageSender, img: downloadURL }],
            });
            document.querySelector(".message-input").value = "";
            setImg(null);
            document.querySelector(".file-label").classList.remove("file-selected");
            setIsLoading(false);
          } catch (error) {
            console.error("Error getting download URL:", error);
            setIsLoading(false);
          }
        }
      );
    }  

    if (newMessage) {
      setMessages(m => [...m, {message: newMessage, sender: newMessageSender}]);
      const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
      const chatRef = doc(db, "chats", combinedId);
      updateDoc(chatRef, {
        messages: [...messages, {message: newMessage, sender: newMessageSender}],
      });
      document.querySelector(".message-input").value = "";
    }
  }

  function handleMessageKeyDownAdd(event) {
    if (event.key === "Enter") {
      handleAddMessage();
    }
  }

  function selectFile(event) {
    document.querySelector(".file-label").classList.add("file-selected");
    setImg(event.target.files[0]);
  }

  return (
    
    
    <div className="container">

      <ul>
        {messages.map((message, index) => (
          <li key={index} className="message-item-li">
            <h3 className="author-of-message" style={{ color: message.sender === currentUser.displayName ? "rgba(0, 255, 13, 0.51)" : "rgb(85, 93, 255)"}} key={index}>{message.sender}</h3>
            <div className="message-div-item" ref={ref1} style={{backgroundColor: message.sender === currentUser.displayName ? "rgba(0, 255, 13, 0.51)" : "rgb(85, 93, 255)"}}>
              <p className="message-text-item">
                {message.message}
              </p>
              {message.img && <img src={message.img} className="user-image"></img>}
            </div>
          </li>
        ))}
        {isLoading && (
        <li className="message-item-li">
          <div className="message-div-item" ref={ref1} style={{backgroundColor: "gray"}}>
            <p className="message-text-item">Uploading image...</p>
          </div>
        </li>
      )}
      </ul>
      
        <header className="header">
          <h1 className="header-chat-name">{currentChat}</h1>
        </header>
        <nav className="side-bar">
          <div className="search-bar-div">
            <div>
              <input type="text" placeholder="Find friends" onKeyDown={handleFindKeyDown} onChange={e=>setUsername(e.target.value)}/>
              <button onClick={handleFindClick}>Find</button>
          </div>
          {err && <span>Something went wrong!</span>}
          </div>
          <div className="chat-list-div">
            <ul>
              {chats && Object.entries(chats).map((friend,index) => (
                friend[1] && friend[1].userInfo && (
                <li key={friend[0]}>
                  <div className="chat-list-item" onClick={(event) => handleSelectChat(event, index)} style={{
                  backgroundColor: selectedFriendIndex === index ? "rgba(61, 69, 238, 0.51)" : "rgb(61, 69, 238)"
                  }}>
                    <h2 onClick={handleSelectChat} className="h2-friend">
                      {friend[1].userInfo.displayName}
                    </h2>
                    <button onClick={() => handleDeleteClick(index)}>
                      <i className='bx bxs-trash-alt'></i>
                    </button>
                  </div>
                </li>
                )
              ))}
            </ul>
          </div>
        </nav>
        <footer className="chat-page-footer">
          <button className="log-out-button" onClick={() => signOut(auth)}>
            <i className='bx bx-power-off'></i>
          </button>
          <input type="text" placeholder="Type your message here!" className="message-input" onKeyDown={handleMessageKeyDownAdd} />
          <input type="file" accept=".png,.jpg" className="file-input" placeholder="file" name="file" id="file" onChange={e => selectFile(e)}/>
          <label htmlFor="file" className="file-label">
            <i className='bx bx-image-add'></i>
          </label>
          <button onClick={handleAddMessage}>Send</button>
        </footer>
      </div>
    

  );
}

export default ChatPage;