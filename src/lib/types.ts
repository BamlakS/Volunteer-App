export type Skill = 'React' | 'Node.js' | 'UI/UX Design' | 'Project Management' | 'Databases' | 'DevOps' | 'Frontend' | 'Backend';

export type Project = {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
  timeCommitment: string;
  creatorId: string;
  creatorName: string;
  creatorAvatarUrl?: string;
};

export type Volunteer = {
  id: string;
  name: string;
  avatarUrl: string;
  tagline: string;
  skills: Skill[];
  experience: string;
  availability: string;
};

export type Message = {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
  avatarUrl: string;
};

export type Conversation = {
  id: string;
  contactName: string;
  contactAvatarUrl: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  messages: Message[];
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl:string;
  role: 'volunteer' | 'non-profit';
};

    