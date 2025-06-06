
import CyberButton from "@/components/CyberButton";
import TerminalInput from "@/components/TerminalInput";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Send = () => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "ERROR",
        description: "Message cannot be empty",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending
    toast({
      title: "TRANSMISSION SENT",
      description: `Your ${isAnonymous ? 'anonymous' : 'identified'} confession has been transmitted to the digital void.`,
    });

    // Reset form
    setRecipient("");
    setMessage("");
  };

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-neon-cyan mb-2 neon-glow glitch-effect" data-text="SEND CONFESSION">
            SEND CONFESSION
          </h1>
          <p className="text-neon-pink mono-text">
            // TRANSMIT YOUR THOUGHTS TO THE MATRIX
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card-vaporwave p-6 rounded-lg border-2 border-neon-cyan/30 cyber-grid crt-scanlines">
            
            <TerminalInput
              label="RECIPIENT ADDRESS (OPTIONAL)"
              placeholder="user@cybervoid.net"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />

            <div className="mt-6">
              <label className="block text-sm font-orbitron text-neon-cyan uppercase tracking-wider mb-2">
                CONFESSION MESSAGE
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your deepest, darkest digital secrets..."
                rows={6}
                className="w-full px-4 py-3 bg-background/80 border-2 border-neon-purple/30 rounded-lg
                         text-foreground font-mono placeholder:text-muted-foreground resize-none
                         focus:border-neon-purple focus:outline-none focus:ring-0
                         focus:shadow-lg focus:shadow-neon-purple/30
                         transition-all duration-300 crt-scanlines
                         hover:border-neon-purple/50"
              />
            </div>

            {/* Options */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-neon-pink/20">
                <div>
                  <div className="font-orbitron text-neon-pink text-sm">ANONYMOUS MODE</div>
                  <div className="text-xs text-muted-foreground mono-text">Hide your identity from the matrix</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-12 h-6 rounded-full border-2 transition-all duration-300 relative ${
                    isAnonymous 
                      ? 'border-neon-pink bg-neon-pink/20' 
                      : 'border-neon-cyan/50 bg-background/20'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full transition-all duration-300 absolute top-0.5 ${
                    isAnonymous 
                      ? 'left-6 bg-neon-pink' 
                      : 'left-0.5 bg-neon-cyan/50'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-neon-purple/20">
                <div>
                  <div className="font-orbitron text-neon-purple text-sm">ENCRYPTION</div>
                  <div className="text-xs text-muted-foreground mono-text">Encode your message for security</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEncrypted(!isEncrypted)}
                  className={`w-12 h-6 rounded-full border-2 transition-all duration-300 relative ${
                    isEncrypted 
                      ? 'border-neon-purple bg-neon-purple/20' 
                      : 'border-neon-cyan/50 bg-background/20'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full transition-all duration-300 absolute top-0.5 ${
                    isEncrypted 
                      ? 'left-6 bg-neon-purple' 
                      : 'left-0.5 bg-neon-cyan/50'
                  }`} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <CyberButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                TRANSMIT TO VOID
              </CyberButton>
            </div>
          </div>
        </form>

        {/* Status Display */}
        <div className="mt-6 p-4 bg-card-vaporwave rounded-lg border border-neon-cyan/30">
          <div className="mono-text text-sm space-y-1">
            <div className="text-neon-cyan">STATUS: READY_FOR_TRANSMISSION</div>
            <div className="text-neon-pink">MODE: {isAnonymous ? 'ANONYMOUS' : 'IDENTIFIED'}</div>
            <div className="text-neon-purple">ENCRYPTION: {isEncrypted ? 'ENABLED' : 'DISABLED'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Send;
