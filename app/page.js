'use client'
import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import backgroundImage from '../public/real.webp';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi, I'm MediBot. How can I assist you today?`,
    },
  ]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' },
    ]);

    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        p: 3,
      }}
    >
      <Stack
        direction="column"
        width="600px"
        height="700px"
        borderRadius={4}
        boxShadow={3}
        bgcolor="rgba(255, 255, 255, 0.8)"
        p={3}
        spacing={3}
      >
        <Typography variant="h5" align="center" color="primary" fontWeight="bold">
          MediBot Chat
        </Typography>
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{ 
            borderRadius: 4, 
            border: '1px solid #e0e0e0', 
            p: 2,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(5px)',
          }}
        >
          {
            messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              >
                <Box
                  sx={{
                    bgcolor: message.role === 'assistant' ? 'primary.main' : 'secondary.main',
                    color: 'white',
                    borderRadius: 2,
                    p: 2,
                    maxWidth: '80%',
                    boxShadow: 1,
                  }}
                >
                  {message.content}
                </Box>
              </Box>
            ))
          }
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Type a message"
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            InputProps={{
              style: {
                borderRadius: '16px',
                backgroundColor: 'white', 
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{ borderRadius: '16px', minWidth: '100px' }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
