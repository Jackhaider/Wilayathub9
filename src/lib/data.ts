import {
  Wrench,
  Zap,
  Scissors,
  Sparkles,
  Trash2,
  Car,
  Home,
  Calendar,
  Gift,
  User,
  Star,
  LucideIcon,
  Bell,
  Palette,
  ChefHat,
  HeartPulse,
  type Icon as LucideIconType,
} from "lucide-react";
import { getPlaceholderImage } from "./placeholder-images";

export interface ServiceCategory {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const serviceCategories: ServiceCategory[] = [
  { id: "plumber", name: "Plumber", icon: Wrench },
  { id: "electrician", name: "Electrician", icon: Zap },
  { id: "barber", name: "Barber", icon: Scissors },
  { id: "beautician", name: "Beautician", icon: Sparkles },
  { id: "cleaning", name: "Cleaning", icon: Trash2 },
  { id: "driver", name: "Driver", icon: Car },
  { id: "painter", name: "Painter", icon: Palette },
  { id: "chef", name: "Chef", icon: ChefHat },
  { id: "nurse", name: "Nurse", icon: HeartPulse },
];

export interface Partner {
  id: string;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  price: number;
  distance: number;
  status: "available" | "busy";
  avatarUrl: string;
}

export const partners: Partner[] = [
  { id: '1', name: 'John Doe', service: 'electrician', rating: 4.8, reviews: 120, price: 50, distance: 2.5, status: 'available', avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: '2', name: 'Jane Smith', service: 'plumber', rating: 4.9, reviews: 85, price: 45, distance: 1.2, status: 'available', avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: '3', name: 'Mike Johnson', service: 'electrician', rating: 4.7, reviews: 95, price: 55, distance: 3.1, status: 'busy', avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: '4', name: 'Emily White', service: 'beautician', rating: 5.0, reviews: 210, price: 80, distance: 5.0, status: 'available', avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: '5', name: 'Chris Green', service: 'driver', rating: 4.6, reviews: 150, price: 30, distance: 0.8, status: 'available', avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: '6', name: 'Sarah Brown', service: 'cleaning', rating: 4.8, reviews: 110, price: 60, distance: 4.5, status: 'busy', avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
];


export interface Booking {
    id: string;
    partner: Partner;
    service: ServiceCategory;
    date: Date;
    status: 'Active' | 'Completed' | 'Cancelled' | 'Requested' | 'On the way';
}

export const bookings: Booking[] = [
    { id: 'booking1', partner: partners[1], service: serviceCategories[1], date: new Date('2024-08-15T10:00:00'), status: 'Active' },
    { id: 'booking2', partner: partners[3], service: serviceCategories[3], date: new Date('2024-08-14T14:30:00'), status: 'Completed' },
    { id: 'booking3', partner: partners[0], service: serviceCategories[0], date: new Date('2024-07-20T09:00:00'), status: 'Completed' },
    { id: 'booking4', partner: partners[4], service: serviceCategories[5], date: new Date(), status: 'On the way' },
    { id: 'booking5', partner: partners[2], service: serviceCategories[0], date: new Date('2024-08-18T16:00:00'), status: 'Requested' },
];

export interface NavItem {
    href: string;
    label: string;
    iconName: keyof typeof import("lucide-react")["icons"];
}
  
export const customerNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Home', iconName: 'Home' },
    { href: '/bookings', label: 'My Bookings', iconName: 'Calendar' },
    { href: '/notifications', label: 'Notifications', iconName: 'Bell' },
    { href: '/profile', label: 'Profile', iconName: 'User' },
];

export const partnerNavItems: NavItem[] = [
    { href: '/partner/dashboard', label: 'Dashboard', iconName: 'Home' },
    { href: '/partner/earnings', label: 'Earnings', iconName: 'DollarSign' },
    { href: '/notifications', label: 'Notifications', iconName: 'Bell' },
    { href: '/partner/profile', label: 'Profile', iconName: 'User' },
];

export interface ChatMessage {
    id: string;
    sender: 'user' | 'partner';
    text: string;
    timestamp: string;
}

export const chatMessages: ChatMessage[] = [
    { id: '1', sender: 'user', text: 'Hi, are you on your way?', timestamp: '10:30 AM' },
    { id: '2', sender: 'partner', text: 'Yes, I should be there in about 15 minutes.', timestamp: '10:31 AM' },
    { id: '3', sender: 'user', text: 'Great, thank you!', timestamp: '10:31 AM' },
    { id: '4', sender: 'partner', text: 'Just parked outside.', timestamp: '10:45 AM' },
];

export interface Earning {
  month: string;
  total: number;
}

export const earningsData: Earning[] = [
  { month: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];
