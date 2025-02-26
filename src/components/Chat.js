"use client"

import { useState, useEffect } from "react"
import styled, { keyframes, createGlobalStyle } from "styled-components"
import { supabase } from "../supabase"
import Navbar from "./Navbar"

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9f6f0;
  }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`

const ChatContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease-out;
  position: fixed; /* Add this */
  top: 0;         /* Add this */
  left: 0;        /* Add this */
  right: 0;       /* Add this */
  bottom: 0;      /* Add this */
`

const ChatLayout = styled.div`
  display: flex;
  height: calc(100vh - 56px); /* Update this to match Bootstrap navbar height */
  margin-top: 56px;           /* Add this to account for navbar */
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(184, 134, 11, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const FriendsList = styled.div`
  width: 300px;
  background: #fdfbf7;
  border-right: 2px solid #d4af37; /* Updated border */
  box-shadow: 2px 0 4px rgba(212, 175, 55, 0.1); /* Added shadow */
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    height: 100px;
    border-right: none;
    border-bottom: 2px solid #d4af37;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
  }
`

const FriendsHeader = styled.div`
  padding: 20px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #b8860b;
  border-bottom: 2px solid #e6d7b3; /* Made border thicker */
  text-align: center;
  position: relative;

  &:after {  /* Added decorative line */
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background: #d4af37;
  }
`

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.selected ? "#f1e5b9" : "transparent")};

  &:hover {
    background: ${(props) => (props.selected ? "#ecd671" : "#f7ebc8")};
  }

  @media (max-width: 768px) {
    flex-shrink: 0;
    padding: 10px;
    width: 80px;
    flex-direction: column;
    text-align: center;
  }
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  transition: transform 0.3s ease;
  border: 1px solid #d4af37;

  ${FriendItem}:hover & {
    transform: scale(1.1);
  }
`

const FriendName = styled.div`
  font-weight: 400;
  color: #8b4513;

  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`

const ChatWindow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`

const ChatHeader = styled.div`
  padding: 20px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #b8860b;
  border-bottom: 2px solid #e6d7b3; /* Made border thicker */
  text-align: center;
  position: relative;

  &:after {  /* Added decorative line */
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background: #d4af37;
  }
`

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #fdfbf7;
  height: calc(100vh - 180px); /* Add this to account for header and message form */
`

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 12px 18px;
  border-radius: 18px;
  margin: 5px;
  background: ${(props) => (props.sent ? "#d4af37" : "#f1e5b9")};
  color: ${(props) => (props.sent ? "#ffffff" : "#8b4513")};
  align-self: ${(props) => (props.sent ? "flex-end" : "flex-start")};
  animation: ${slideIn} 0.3s ease-out;
  box-shadow: 0 2px 5px rgba(184, 134, 11, 0.1);
  font-weight: 300;

  @media (max-width: 480px) {
    max-width: 80%;
    padding: 10px 15px;
    font-size: 14px;
  }
`

const MessageForm = styled.form`
  display: flex;
  padding: 20px;
  background: #fdfbf7;
  border-top: 2px solid #e6d7b3; /* Made border thicker */
  position: sticky;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -4px 6px rgba(212, 175, 55, 0.05); /* Added subtle shadow */

  @media (max-width: 480px) {
    padding: 10px;
    gap: 5px;
  }
`

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #d4af37;
  border-radius: 25px;
  outline: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #8b4513;
  font-family: 'Poppins', sans-serif;

  &:focus {
    border-color: #b8860b;
    box-shadow: 0 0 0 2px rgba(184, 134, 11, 0.2);
  }

  &::placeholder {
    color: #d4af37;
  }
`

const SendButton = styled.button`
  padding: 12px 25px;
  margin-left: 10px;
  background: #d4af37;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background: #b8860b;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(184, 134, 11, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #b8860b;
  animation: ${fadeIn} 0.5s ease-out;
  background: #fdfbf7;
  font-weight: 300;
`

const Chat = () => {
  const [user, setUser] = useState(null)
  const [friends, setFriends] = useState([])
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    const fetchFriends = async () => {
      if (!user) return

      try {
        const { data: receiverData } = await supabase
          .from("friend_requests")
          .select("sender_id, profiles!friend_requests_sender_id_fkey(username)")
          .eq("receiver_id", user.id)
          .eq("status", "accepted")

        const { data: senderData } = await supabase
          .from("friend_requests")
          .select("receiver_id, profiles!friend_requests_receiver_id_fkey(username)")
          .eq("sender_id", user.id)
          .eq("status", "accepted")

        const friendsList = [
          ...(receiverData?.map((item) => ({
            id: item.sender_id,
            username: item.profiles.username,
          })) || []),
          ...(senderData?.map((item) => ({
            id: item.receiver_id,
            username: item.profiles.username,
          })) || []),
        ]

        setFriends(friendsList)
      } catch (error) {
        console.error("Error fetching friends:", error)
      }
    }

    fetchUser()
    if (user) {
      fetchFriends()
    }
  }, [user])

  useEffect(() => {
    if (selectedFriend) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender_id.eq.${user.id},receiver_id.eq.${selectedFriend.id}),and(sender_id.eq.${selectedFriend.id},receiver_id.eq.${user.id})`,
          )
          .order("created_at", { ascending: true })

        if (error) console.error("Error fetching messages:", error)
        else setMessages(data || [])
      }

      fetchMessages()

      const subscription = supabase
        .channel("messages")
        .on("INSERT", (payload) => {
          if (
            (payload.new.sender_id === user.id && payload.new.receiver_id === selectedFriend.id) ||
            (payload.new.sender_id === selectedFriend.id && payload.new.receiver_id === user.id)
          ) {
            setMessages((current) => [...current, payload.new])
          }
        })
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [selectedFriend, user])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedFriend) return

    try {
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          receiver_id: selectedFriend.id,
          content: newMessage,
        },
      ])

      if (error) throw error
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  return (
    <>
      <GlobalStyle />
      <ChatContainer>
        <Navbar />
        <ChatLayout>
          <FriendsList>
            <FriendsHeader>Friends</FriendsHeader>
            {friends.map((friend) => (
              <FriendItem
                key={friend.id}
                selected={selectedFriend?.id === friend.id}
                onClick={() => setSelectedFriend(friend)}
              >
                <Avatar
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${friend.username}&backgroundColor=d4af37&textColor=ffffff`}
                  alt={friend.username}
                />
                <FriendName>{friend.username}</FriendName>
              </FriendItem>
            ))}
          </FriendsList>

          {selectedFriend ? (
            <ChatWindow>
              <ChatHeader>{selectedFriend.username}</ChatHeader>
              <MessagesContainer>
                {messages.map((message, index) => (
                  <MessageBubble key={index} sent={message.sender_id === user?.id}>
                    {message.content}
                  </MessageBubble>
                ))}
              </MessagesContainer>
              <MessageForm onSubmit={sendMessage}>
                <MessageInput
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <SendButton type="submit">Send</SendButton>
              </MessageForm>
            </ChatWindow>
          ) : (
            <EmptyState>Select a friend to start chatting</EmptyState>
          )}
        </ChatLayout>
      </ChatContainer>
    </>
  )
}

export default Chat

