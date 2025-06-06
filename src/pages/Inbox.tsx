
import ConfessionCard from "@/components/ConfessionCard";
import CyberButton from "@/components/CyberButton";
import { Lock, Eye, Share } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface InboxMessage {
  id: string;
  content: string;
  timestamp: string;
  isEncrypted: boolean;
  isDecrypted: boolean;
  sender?: string;
}

const Inbox = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<InboxMessage[]>([
    {
      id: "msg_001",
      content: "***ENCRYPTED*** 4a7b9c2e8f1d3a6e9b4c7f2a8e5d1c9f",
      timestamp: "1H AGO",
      isEncrypted: true,
      isDecrypted: false,
      sender: "anonymous@void.net"
    },
    {
      id: "msg_002",
      content: "I saw what you did with that CSS animation. You're a wizard! Teach me your cyberpunk ways, master of the neon arts.",
      timestamp: "3H AGO",
      isEncrypted: false,
      isDecrypted: true,
      sender: "dev_ghost_42"
    },
    {
      id: "msg_003",
      content: "***ENCRYPTED*** 9e3f7a1b4c8d2f6a9e3b7c5f1a8d4e7b",
      timestamp: "5H AGO",
      isEncrypted: true,
      isDecrypted: false,
      sender: "cipher_punk_2077"
    }
  ]);

  const handleDecrypt = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              isDecrypted: true, 
              content: "Your secret admirer thinks your code is beautiful. Every function you write is poetry in motion. Keep being amazing! 💜"
            }
          : msg
      )
    );
    
    toast({
      title: "DECRYPTION COMPLETE",
      description: "Message has been decoded from the cyber void."
    });
  };

  const handleMakePublic = (messageId: string) => {
    toast({
      title: "PUBLISHED TO FEED",
      description: "Message has been shared with the collective consciousness."
    });
  };

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-neon-purple mb-2 neon-glow glitch-effect" data-text="SECURE INBOX">
            SECURE INBOX
          </h1>
          <p className="text-neon-cyan mono-text">
            // ENCRYPTED TRANSMISSIONS FROM THE MATRIX
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card-vaporwave p-4 rounded-lg border border-neon-pink/30 text-center">
            <div className="text-2xl font-orbitron text-neon-pink">{messages.length}</div>
            <div className="text-xs text-muted-foreground mono-text">TOTAL</div>
          </div>
          <div className="bg-card-vaporwave p-4 rounded-lg border border-neon-purple/30 text-center">
            <div className="text-2xl font-orbitron text-neon-purple">
              {messages.filter(m => m.isEncrypted && !m.isDecrypted).length}
            </div>
            <div className="text-xs text-muted-foreground mono-text">ENCRYPTED</div>
          </div>
          <div className="bg-card-vaporwave p-4 rounded-lg border border-neon-cyan/30 text-center">
            <div className="text-2xl font-orbitron text-neon-cyan">
              {messages.filter(m => m.isDecrypted || !m.isEncrypted).length}
            </div>
            <div className="text-xs text-muted-foreground mono-text">READABLE</div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              <ConfessionCard
                id={message.id}
                content={message.content}
                timestamp={message.timestamp}
                likes={0}
                isAnonymous={!message.sender || message.sender.includes('anonymous')}
                isEncrypted={message.isEncrypted && !message.isDecrypted}
              />
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                {message.isEncrypted && !message.isDecrypted && (
                  <CyberButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDecrypt(message.id)}
                    className="flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    DECRYPT
                  </CyberButton>
                )}
                
                {(message.isDecrypted || !message.isEncrypted) && (
                  <>
                    <CyberButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleMakePublic(message.id)}
                      className="flex items-center gap-2"
                    >
                      <Share className="w-4 h-4" />
                      MAKE PUBLIC
                    </CyberButton>
                    
                    <CyberButton
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      MARK READ
                    </CyberButton>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-orbitron text-neon-cyan mb-2">INBOX EMPTY</h3>
            <p className="text-muted-foreground mono-text">
              No encrypted transmissions detected in the void.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
