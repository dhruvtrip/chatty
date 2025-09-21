package com.trip.chatty.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

//    Inform users that a user disconnected/left the chat room
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event){
        // to be handled
    }
}
