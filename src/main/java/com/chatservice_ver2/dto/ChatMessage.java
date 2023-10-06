package com.chatservice_ver2.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    public enum MessageType {
        ENTER, TALK
    }

    private MessageType type;
    //채팅방 ID
    private String roomId;
    //내용
    private String message;
    //보내는 사람
    private String sender;



}
