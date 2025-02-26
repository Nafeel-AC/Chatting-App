import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../supabase';
import Alert from './Alert';
import Navbar from './Navbar';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]); // New state for friends
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const fetchProfiles = async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        setAlertMessage(error.message);
      } else {
        setProfiles(data);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('friend_requests')
          .select('*, profiles!friend_requests_sender_id_fkey(username)')
          .eq('receiver_id', user?.id)
          .eq('status', 'pending'); // Only fetch pending requests

        if (error) throw error;
        setFriendRequests(data || []);
      } catch (error) {
        setAlertMessage(error.message);
      }
    };

    // New function to fetch all accepted friend requests
    const fetchFriends = async () => {
      try {
        // Fetch where user is receiver
        const { data: receiverData, error: receiverError } = await supabase
          .from('friend_requests')
          .select('sender_id')
          .eq('receiver_id', user?.id)
          .eq('status', 'accepted');

        // Fetch where user is sender
        const { data: senderData, error: senderError } = await supabase
          .from('friend_requests')
          .select('receiver_id')
          .eq('sender_id', user?.id)
          .eq('status', 'accepted');

        if (receiverError || senderError) throw receiverError || senderError;

        // Combine all friend IDs
        const friendIds = [
          ...(receiverData?.map(item => item.sender_id) || []),
          ...(senderData?.map(item => item.receiver_id) || [])
        ];

        setFriends(friendIds);
      } catch (error) {
        setAlertMessage(error.message);
      }
    };

    fetchUser();
    fetchProfiles();
    if (user) {
      fetchFriendRequests();
      fetchFriends();
    }
  }, [user]);

  const sendFriendRequest = async (receiverId) => {
    try {
      const { error } = await supabase.from('friend_requests').insert([
        { sender_id: user.id, receiver_id: receiverId }
      ]);
      if (error) throw error;
      setAlertMessage('Friend request sent successfully!');
    } catch (error) {
      setAlertMessage(error.message);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      // Remove the accepted request from the local state
      setFriendRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      
      setAlertMessage('Friend request accepted!');
    } catch (error) {
      setAlertMessage(error.message);
    }
  };

  return (
    <DashboardContainer>
      <Navbar />
      <StyledWrapper>
        {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage('')} />}
        <StyledHeader>Dashboard</StyledHeader>
        <Section>
          <SectionHeader>Send Friend Requests</SectionHeader>
          <UserList>
            {profiles.map(profile => (
              profile.id !== user?.id && !friends.includes(profile.id) && (
                <UserCard key={profile.id}>
                  <Avatar src={`https://api.dicebear.com/6.x/initials/svg?seed=${profile.username}`} alt={profile.username} />
                  <Username>{profile.username}</Username>
                  <StyledButton onClick={() => sendFriendRequest(profile.id)}>Send Friend Request</StyledButton>
                </UserCard>
              )
            ))}
          </UserList>
        </Section>
        <Section>
          <SectionHeader>Friend Requests</SectionHeader>
          <RequestList>
            {friendRequests.map(request => (
              <RequestCard key={request.id}>
                <Avatar src={`https://api.dicebear.com/6.x/initials/svg?seed=${request.profiles.username}`} alt={request.profiles.username} />
                <Username>{request.profiles.username}</Username>
                <StyledButton accept onClick={() => acceptFriendRequest(request.id)}>Accept</StyledButton>
              </RequestCard>
            ))}
          </RequestList>
        </Section>
      </StyledWrapper>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const StyledWrapper = styled.div`
  padding: 2rem;
  padding-top: calc(56px + 2rem); /* Navbar height + padding */
  background: #f0f2f5;
  min-height: 100vh;
  width: 100%;
  animation: ${fadeIn} 0.5s ease-in;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const StyledHeader = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  width: 100%;
`;

const SectionHeader = styled.h2`
  font-size: 1.8rem;
  color: #34495e;
  margin-bottom: 1rem;
  padding: 0 1rem;
`;

const UserList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const RequestList = styled(UserList)``;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const UserCard = styled(Card)``;

const RequestCard = styled(Card)``;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const Username = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const StyledButton = styled.button`
  padding: 0.7rem 1.2rem;
  background: ${props => props.accept ? '#2ecc71' : '#3498db'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  font-weight: 600;

  &:hover {
    background: ${props => props.accept ? '#27ae60' : '#2980b9'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export default Dashboard;