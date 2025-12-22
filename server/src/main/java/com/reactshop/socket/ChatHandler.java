package com.reactshop.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule; // Fontos import!
import com.reactshop.model.Message;
import com.reactshop.repository.MessageRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class ChatHandler extends TextWebSocketHandler {

    private final MessageRepository messageRepository;
    private final ObjectMapper objectMapper;
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    public ChatHandler(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        List<Message> history = messageRepository.findTop50ByOrderByTimestampAsc();
        for (Message msg : history) {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(msg)));
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Message incoming = objectMapper.readValue(message.getPayload(), Message.class);
        incoming.setTimestamp(System.currentTimeMillis());
        
        Message saved = messageRepository.save(incoming);
        
        String jsonPayload = objectMapper.writeValueAsString(saved);
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage(jsonPayload));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        sessions.remove(session);
    }
}