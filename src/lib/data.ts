import { type Project, type Volunteer, type Conversation } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImageUrl = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const projects: Project[] = [
  {
    id: 'proj-1',
    title: 'Redesign Community Website',
    nonprofit: 'Greenwood Community Center',
    description: 'We need a complete overhaul of our outdated website to better serve our community members and improve online donations.',
    skills: ['UI/UX Design', 'React', 'Frontend'],
    timeCommitment: '5-10 hours/week',
  },
  {
    id: 'proj-2',
    title: 'Donation Management Database',
    nonprofit: 'Helping Hands Charity',
    description: 'Develop a secure and efficient database to track donations, manage donor information, and generate reports.',
    skills: ['Databases', 'Node.js', 'Backend'],
    timeCommitment: '8-12 hours/week',
  },
  {
    id: 'proj-3',
    title: 'Mobile App for Food Bank',
    nonprofit: 'City Food Bank',
    description: 'Create a simple mobile app for clients to find distribution schedules and for volunteers to sign up for shifts.',
    skills: ['React', 'Frontend', 'Backend'],
    timeCommitment: '10-15 hours/week',
  },
  {
    id: 'proj-4',
    title: 'Volunteer Coordination Platform',
    nonprofit: 'United Volunteers',
    description: 'Build a platform to streamline volunteer recruitment, scheduling, and communication for various events.',
    skills: ['Project Management', 'React', 'Node.js'],
    timeCommitment: '6-8 hours/week',
  },
  {
    id: 'proj-5',
    title: 'Automate Reporting System',
    nonprofit: 'Literacy for All',
    description: 'Set up a DevOps pipeline and automated scripts to generate our weekly and monthly impact reports.',
    skills: ['DevOps', 'Databases', 'Backend'],
    timeCommitment: '4-6 hours/week',
  },
  {
    id: 'proj-6',
    title: 'Improve Accessibility (a11y)',
    nonprofit: 'Access Now Foundation',
    description: 'Audit our existing web application and implement improvements to meet WCAG 2.1 AA standards.',
    skills: ['UI/UX Design', 'Frontend'],
    timeCommitment: '3-5 hours/week',
  },
];

export const volunteers: Volunteer[] = [
  {
    id: 'vol-1',
    name: 'Alice Johnson',
    avatarUrl: getImageUrl('volunteer-1'),
    tagline: 'Full-stack developer passionate about social impact.',
    skills: ['React', 'Node.js', 'Databases'],
    experience: '5+ years in web development',
    availability: 'Evenings & Weekends',
  },
  {
    id: 'vol-2',
    name: 'Ben Carter',
    avatarUrl: getImageUrl('volunteer-2'),
    tagline: 'UX designer focused on creating intuitive user experiences.',
    skills: ['UI/UX Design', 'Frontend'],
    experience: '3 years in digital design',
    availability: 'Flexible, 10 hrs/week',
  },
  {
    id: 'vol-3',
    name: 'Cathy Williams',
    avatarUrl: getImageUrl('volunteer-3'),
    tagline: 'Agile project manager and scrum master.',
    skills: ['Project Management', 'DevOps'],
    experience: '8 years in tech leadership',
    availability: 'Weekdays',
  },
  {
    id: 'vol-4',
    name: 'David Rodriguez',
    avatarUrl: getImageUrl('volunteer-4'),
    tagline: 'Backend engineer specializing in APIs and databases.',
    skills: ['Node.js', 'Databases', 'Backend'],
    experience: '6 years in software engineering',
    availability: 'Weekends',
  },
  {
    id: 'vol-5',
    name: 'Eva Chen',
    avatarUrl: getImageUrl('volunteer-5'),
    tagline: 'Frontend developer with an eye for detail.',
    skills: ['React', 'UI/UX Design', 'Frontend'],
    experience: '4 years in frontend development',
    availability: 'Flexible, 5-8 hrs/week',
  },
];

export const conversations: Conversation[] = [
  {
    id: 'convo-1',
    contactName: 'Alice Johnson',
    contactAvatarUrl: getImageUrl('volunteer-1'),
    lastMessage: 'Sounds great! I can start on the database schema this weekend.',
    lastMessageTimestamp: '2h ago',
    messages: [
      {
        id: 'msg-1-1',
        sender: 'them',
        text: 'Hey! I saw you selected the "Donation Management Database" project. We are so excited to have you on board!',
        timestamp: '3h ago',
        avatarUrl: getImageUrl('volunteer-1'),
      },
      {
        id: 'msg-1-2',
        sender: 'me',
        text: "Hi Alice! Yes, I'm thrilled to contribute. It looks like an interesting challenge. Do you have any initial documentation I can look at?",
        timestamp: '3h ago',
        avatarUrl: getImageUrl('me-avatar'),
      },
      {
        id: 'msg-1-3',
        sender: 'them',
        text: 'Absolutely, I\'ve just sent over an invite to our Notion workspace. All the requirements are detailed there. Let me know if you have any questions.',
        timestamp: '2h ago',
        avatarUrl: getImageUrl('volunteer-1'),
      },
      {
        id: 'msg-1-4',
        sender: 'me',
        text: 'Sounds great! I can start on the database schema this weekend.',
        timestamp: '2h ago',
        avatarUrl: getImageUrl('me-avatar'),
      },
    ],
  },
  {
    id: 'convo-2',
    contactName: 'City Food Bank',
    contactAvatarUrl: getImageUrl('volunteer-3'),
    lastMessage: 'Perfect, thank you!',
    lastMessageTimestamp: '1d ago',
    messages: [],
  },
    {
    id: 'convo-3',
    contactName: 'Ben Carter',
    contactAvatarUrl: getImageUrl('volunteer-2'),
    lastMessage: 'I have some ideas for the wireframes.',
    lastMessageTimestamp: '3d ago',
    messages: [],
  },
];
