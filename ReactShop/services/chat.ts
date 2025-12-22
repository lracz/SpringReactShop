import { ChatMessage } from '../types';

type MessageHandler = (msg: ChatMessage) => void;

const WS_URL = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:5000/chat';

class RealWebSocketService {
  private socket: WebSocket | null = null;
  private handlers: MessageHandler[] = [];
  private isConnected = false;

connect(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      
      setTimeout(() => { 
          console.log('Connecting to WS...');

          this.socket = new WebSocket(`${WS_URL}?username=${username}`); 
          
          this.socket.onopen = () => {
              console.log('✅ Connected to Chat WebSocket');
              this.isConnected = true;
              resolve();
          };
          
          this.socket.onmessage = (event) => {
              try {
                  const msg: ChatMessage = JSON.parse(event.data);
                  this.broadcast(msg); // Továbbítja a fogadott adatot a Forum.tsx-nek
              } catch (e) {
                  console.error('Error parsing received message:', e);
              }
          };
          
          
          this.socket.onerror = (err) => {
            console.error('WebSocket Error', err);
            if (!this.isConnected) {
                reject(err);
            }
          };

      }, 500); // Fél másodperc várakozás
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.handlers = []; 
  }

  send(text: string, user: { id: string, username: string }) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.warn("Socket not connected, cannot send message");
        return;
    }

    const payload = {
      userId: user.id,
      username: user.username,
      text: text,
    };
    
    this.socket.send(JSON.stringify(payload));
    
  }

  onMessage(handler: MessageHandler) {
    this.handlers.push(handler);

    return () => {
        this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  private broadcast(msg: ChatMessage) {
    this.handlers.forEach(h => h(msg));
  }
}

export const chatService = new RealWebSocketService();