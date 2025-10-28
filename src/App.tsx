import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Id } from "../convex/_generated/dataModel";
import { Button } from "./components/Button";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Chef Chat</h2>
        <div className="flex gap-4 items-center">
          <ProfileButton />
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 flex">
        <Authenticated>
          <ChatApp />
        </Authenticated>
        <Unauthenticated>
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md mx-auto">
              <div className="flex flex-col gap-8">
                <div className="text-center">
                  <h1 className="text-5xl font-bold accent-text mb-4">Chef Chat</h1>
                  <p className="text-xl text-slate-600">Sign in to get started</p>
                </div>
                <SignInForm />
              </div>
            </div>
          </div>
        </Unauthenticated>
      </main>
      <Toaster />
    </div>
  );
}

function ChatApp() {
  const [selectedChannel, setSelectedChannel] = useState<Id<"channels"> | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  if (showProfile) {
    return <ProfileEditor onClose={() => setShowProfile(false)} />;
  }

  return (
    <>
      <div className="w-64 border-r bg-gray-50 p-4 flex flex-col h-[calc(100vh-73px)]">
        <div className="font-semibold mb-4 text-gray-700">Channels</div>
        <ChannelList selectedChannel={selectedChannel} onSelectChannel={setSelectedChannel} />
        <NewChannelButton />
      </div>
      <div className="flex-1 flex flex-col h-[calc(100vh-73px)]">
        {selectedChannel ? (
          <ChatPanel channelId={selectedChannel} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a channel to start chatting
          </div>
        )}
      </div>
    </>
  );
}

function ProfileButton() {
  const [showProfile, setShowProfile] = useState(false);

  if (showProfile) {
    return <ProfileEditor onClose={() => setShowProfile(false)} />;
  }

  return (
    <Button onClick={() => setShowProfile(true)}>
      Edit Profile
    </Button>
  );
}

function ProfileEditor({ onClose }: { onClose: () => void }) {
  const userId = useQuery(api.auth.loggedInUser)?._id;
  const profile = useQuery(api.profiles.get, userId ? { userId } : "skip");
  const generateUploadUrl = useMutation(api.profiles.generateUploadUrl);
  const updateProfile = useMutation(api.profiles.update);
  const [name, setName] = useState(profile?.name ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await updateProfile({ name });
    onClose();
  }

  async function handleFileChange(e: FormEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      await updateProfile({ name, avatarId: storageId });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              disabled={uploading}
            />
          </div>
          {profile?.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChannelList({
  selectedChannel,
  onSelectChannel,
}: {
  selectedChannel: Id<"channels"> | null;
  onSelectChannel: (channelId: Id<"channels">) => void;
}) {
  const channels = useQuery(api.channels.list) ?? [];

  return (
    <div className="flex-1 overflow-auto">
      {channels.map((channel) => (
        <button
          key={channel._id}
          onClick={() => onSelectChannel(channel._id)}
          className={`w-full text-left px-2 py-1 rounded ${
            channel._id === selectedChannel
              ? "bg-indigo-100 text-indigo-900"
              : "hover:bg-gray-100"
          }`}
        >
          # {channel.name}
        </button>
      ))}
    </div>
  );
}

function NewChannelButton() {
  const createChannel = useMutation(api.channels.create);
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate() {
    const name = prompt("Enter channel name:");
    if (!name) return;

    setIsCreating(true);
    try {
      await createChannel({ name });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Button
      onClick={handleCreate}
      disabled={isCreating}
      className="mt-2"
    >
      New Channel
    </Button>
  );
}

function ChatPanel({ channelId }: { channelId: Id<"channels"> }) {
  const messages = useQuery(api.messages.list, { channelId }) ?? [];
  const sendMessage = useMutation(api.messages.send);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage({
      channelId,
      content: newMessage,
    });
    setNewMessage("");
  }

  return (
    <>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageRow key={message._id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </form>
    </>
  );
}

function MessageRow({ message }: { message: any }) {
  const profile = useQuery(api.profiles.get, { userId: message.authorId });

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-none">
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      <div>
        <div className="font-medium">{profile?.name ?? "Unknown User"}</div>
        <div className="text-gray-700">{message.content}</div>
      </div>
    </div>
  );
}
