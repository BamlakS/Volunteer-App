import { conversations } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const activeConversation = conversations[0]; // For demonstration

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
       <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
          Communication Portal
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay connected with your project teams and volunteers.
        </p>
      </header>
      <div className="flex-grow border rounded-lg shadow-sm flex overflow-hidden bg-card">
        {/* Conversation List */}
        <aside className="w-[320px] border-r hidden md:flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-headline font-semibold">Conversations</h2>
          </div>
          <ScrollArea className="flex-grow">
            {conversations.map((convo, index) => (
              <div key={convo.id}>
                <div
                  className={cn(
                    'p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors',
                    convo.id === activeConversation.id && 'bg-muted'
                  )}
                >
                  <Avatar>
                    <AvatarImage src={convo.contactAvatarUrl} alt={convo.contactName} />
                    <AvatarFallback>{convo.contactName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow overflow-hidden">
                    <p className="font-semibold truncate">{convo.contactName}</p>
                    <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                  </div>
                  <span className="text-xs text-muted-foreground self-start shrink-0">{convo.lastMessageTimestamp}</span>
                </div>
                {index < conversations.length - 1 && <Separator />}
              </div>
            ))}
          </ScrollArea>
        </aside>

        {/* Chat Window */}
        <main className="w-full flex flex-col">
          <header className="p-4 border-b flex items-center gap-4">
            <Avatar>
              <AvatarImage src={activeConversation.contactAvatarUrl} alt={activeConversation.contactName} />
              <AvatarFallback>{activeConversation.contactName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{activeConversation.contactName}</h3>
          </header>

          <ScrollArea className="flex-grow p-4 bg-background/30">
            <div className="space-y-6">
              {activeConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-end gap-2 max-w-[85%]',
                    message.sender === 'me' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.avatarUrl} />
                    <AvatarFallback>{message.sender === 'me' ? 'Y' : activeConversation.contactName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'rounded-lg px-3 py-2 shadow-sm',
                      message.sender === 'me'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-card-foreground'
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={cn(
                      'text-xs mt-1 text-right',
                      message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <footer className="p-4 border-t bg-card">
            <div className="flex items-center gap-2">
              <Input placeholder="Type your message..." className="flex-grow" />
              <Button size="icon" aria-label="Send Message">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
