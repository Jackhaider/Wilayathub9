

import {
  Wrench,
  Zap,
  Scissors,
  Sparkles,
  Trash2,
  Car,
  Home,
  Gift,
  User,
  Star,
  LucideIcon,
  Bell,
  Palette,
  ChefHat,
  HeartPulse,
  Calculator,
  Scale,
  FlaskConical,
  Briefcase,
  Cake,
  Soup,
  PenSquare,
  BookOpen,
  ShoppingBag,
  Cpu,
  Laptop,
  Users,
  Milk,
  Truck,
  Database,
  Printer,
  Building,
  Flame,
  Shirt,
  HeartHandshake,
  Book,
  KeyRound,
  FileText,
  Package,
  Headphones,
  Newspaper,
  Shield,
  Phone,
  Camera,
  Waypoints,
  GraduationCap,
  Wifi,
  CarTaxiFront,
  Glasses,
  TestTube,
  Bug,
  Cat,
  Frame,
  BarChart,
  History,
  Heart,
  DollarSign,
  UploadCloud,
  type Icon as LucideIconType,
} from "lucide-react";
import { getPlaceholderImage } from "./placeholder-images";

export interface ServiceCategory {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const serviceCategories: ServiceCategory[] = [
    { id: "accountant", name: "Accountant", icon: Calculator },
    { id: "advocate", name: "Advocate", icon: Scale },
    { id: "attar-perfumes", name: "Attar & Perfumes", icon: FlaskConical },
    { id: "beauty", name: "Beauty", icon: Sparkles },
    { id: "cake-dessert", name: "Cake & Dessert", icon: Cake },
    { id: "caterers", name: "Caterers", icon: Soup },
    { id: "computer-hardware", name: "Computer Hardware", icon: Cpu },
    { id: "computer-shops", name: "Computer Shops", icon: Laptop },
    { id: "counselor-psychologist", name: "Counselor / Psychologist", icon: Users },
    { id: "crockery", name: "Crockery", icon: ShoppingBag },
    { id: "dairy", name: "Dairy Fresh", icon: Milk },
    { id: "delivery-services", name: "Delivery Services", icon: Truck },
    { id: "designing", name: "Designing", icon: Palette },
    { id: "disposals", name: "Disposals", icon: Trash2 },
    { id: "documents-work", name: "Documents Work", icon: FileText },
    { id: "dry-fruits", name: "Dry Fruits", icon: Package },
    { id: "developer", name: "Developer", icon: Database },
    { id: "electronic-repair", name: "Electronic Repair", icon: Wrench },
    { id: "event-organizer", name: "Event Organizer", icon: Briefcase },
    { id: "fastener-production", name: "Fastener Production", icon: Wrench },
    { id: "filtered-water", name: "Filtered Water", icon: Milk },
    { id: "fire-extinguisher", name: "Fire Extinguisher", icon: Flame },
    { id: "fried-onion", name: "Fried Onion", icon: ChefHat },
    { id: "garments", name: "Garments", icon: Shirt },
    { id: "gift-suppliers", name: "Gift Suppliers", icon: Gift },
    { id: "grocery", name: "Grocery", icon: ShoppingBag },
    { id: "health-package", name: "Health Package", icon: HeartPulse },
    { id: "hijaab-sajdagah", name: "Hijaab & Sajdagah", icon: Book },
    { id: "frozen-food", name: "Frozen Food", icon: Package },
    { id: "hospital-services", name: "Hospital Services", icon: HeartHandshake },
    { id: "immitation-jewellery", name: "Immitation Jewellery", icon: Sparkles },
    { id: "importer", name: "Importer", icon: Truck },
    { id: "interior-design", name: "Interior Design", icon: Home },
    { id: "international-courier", name: "International Courier", icon: Truck },
    { id: "inverter-battery", name: "Inverter Battery", icon: Zap },
    { id: "islamic-books", name: "Islamic Books", icon: BookOpen },
    { id: "keymaker", name: "Keymaker", icon: KeyRound },
    { id: "leave-license", name: "Leave & License", icon: FileText },
    { id: "lifestyle-accessories", name: "Lifestyle & Accessories", icon: ShoppingBag },
    { id: "loan-services", name: "Loan & Services", icon: Calculator },
    { id: "maulana", name: "Maulana", icon: User },
    { id: "mediclaim-insurance", name: "Mediclaim Insurance", icon: Shield },
    { id: "mehndi-artist", name: "Mehndi Artist", icon: Palette },
    { id: "mic-speaker", name: "Mic & Speaker", icon: Headphones },
    { id: "mouth-freshners", name: "Mouth Freshners", icon: Package },
    { id: "nutrition-supplements", name: "Nutrition Supplements", icon: HeartPulse },
    { id: "ola-uber", name: "Ola & Uber", icon: Car },
    { id: "opticals", name: "Opticals", icon: Glasses },
    { id: "packers-movers", name: "Packers & Movers", icon: Truck },
    { id: "passport", name: "Passport", icon: Newspaper },
    { id: "pathalogy", name: "Pathalogy", icon: TestTube },
    { id: "pest-control", name: "Pest Control", icon: Bug },
    { id: "pet-animals", name: "Pet & Animals", icon: Cat },
    { id: "photography-videography", name: "Photography/Videography", icon: Camera },
    { id: "photo-framing", name: "Photo Framing", icon: Frame },
    { id: "physiotherapist", name: "Physiotherapist", icon: HeartPulse },
    { id: "qaza-namaz", name: "Qaza Namaz", icon: BookOpen },
    { id: "real-estate", name: "Real Estate", icon: Building },
    { id: "tailor", name: "Tailor", icon: Scissors },
    { id: "technical-analyst", name: "Technical Analyst", icon: BarChart },
    { id: "tiffin-service", name: "Tiffin Service", icon: Soup },
    { id: "tours-travels", name: "Tours & Travels", icon: Waypoints },
    { id: "charitable-trust", name: "Charitable Trust", icon: HeartHandshake },
    { id: "tutions", name: "Tutions", icon: GraduationCap },
    { id: "wallpaper-work", name: "Wallpaper Work", icon: Palette },
    { id: "wifi", name: "Wifi", icon: Wifi },
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
  phone?: string;
  location?: string;
}

const generateRandomData = () => ({
  rating: +(Math.random() * (5 - 3.5) + 3.5).toFixed(1),
  reviews: Math.floor(Math.random() * 200) + 10,
  price: Math.floor(Math.random() * (100 - 30 + 1)) + 30,
  distance: +(Math.random() * (10 - 1) + 1).toFixed(1),
  status: Math.random() > 0.5 ? 'available' : 'busy' as "available" | "busy",
});


export const partners: Partner[] = [
  { id: 'acc-1', name: 'Ali Raza Damani', service: 'accountant', phone: '9136714202', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'acc-2', name: 'Aliakbar lalani', service: 'accountant', phone: '9821683127', location: 'Dongri', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'acc-3', name: 'Mazahir Nasir', service: 'accountant', phone: '8097640123', location: 'Byculla / Reay Road', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'acc-4', name: 'Mohd Nawroz Sayed', service: 'accountant', phone: '9004694562', location: 'Kurla West', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'acc-5', name: 'Naaz Rizvi', service: 'accountant', phone: '8828782572', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'adv-1', name: 'Ali Sayyed', service: 'advocate', phone: '9967518683', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'adv-2', name: 'Hasan Mehdi Damani', service: 'advocate', phone: '9653309901', location: '', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'adv-3', name: 'Sayed Saeed Mian Zariwala', service: 'advocate', phone: '7506908899', location: 'Dongri', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'attar-1', name: 'Ali Asgar H. Panjwani', service: 'attar-perfumes', phone: '9029639459', location: 'Kurla', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'attar-2', name: 'Fiza Fragrance', service: 'attar-perfumes', phone: '9967721472 / 9167668121', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'attar-3', name: 'Richfume', service: 'attar-perfumes', phone: '9323856007', location: 'All Over India', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'auto-1', name: 'Abidali Gandhi', service: 'auto-driver', phone: '9322753934', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'auto-2', name: 'Iqbal', service: 'auto-driver', phone: '7208171770', location: 'Behman, Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'auto-3', name: 'Meesam Bhai', service: 'auto-driver', phone: '8779691971 / 8828685147', location: 'Zainabia, Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'auto-4', name: 'Mohd Kasim', service: 'auto-driver', phone: '8689805534', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'auto-5', name: 'Nushad', service: 'auto-driver', phone: '8080739761', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'auto-6', name: 'Rehan', service: 'auto-driver', phone: '9372739788', location: 'Behman, Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'beauty-1', name: 'Shaziya Husain', service: 'beauty', phone: '6267427475', location: 'Andheri - Mira Road (Home Service)', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'beauty-2', name: 'Mrs. Ayman Shamji', service: 'beauty', phone: '7977916863', location: 'Mumbai, Andheri', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'beauty-3', name: 'Khushnuma Aga', service: 'beauty', phone: '9167272452', location: 'Mumbra & Mumbai Based', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'cake-1', name: 'Aliasgher Rattansi - 7thheaven', service: 'cake-dessert', phone: '9136042702', location: 'Mazgaon', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'caterer-1', name: 'HomeMade Snacks Corner', service: 'caterers', phone: '9920360402', location: 'Dongri', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'caterer-2', name: 'Mohammed Akbar', service: 'caterers', phone: '8286747844', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'car-driver-1', name: 'Sayyed anwar hussain', service: 'driver', phone: '7900022477', location: 'Amrut Nagar, Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'carpenter-1', name: 'Abbas', service: 'carpenter', phone: '9930924459', location: 'South Mumbai', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'carpenter-2', name: 'ASIF', service: 'carpenter', phone: '9323647929', location: 'BANDRA TO SANTACRUZ', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'carpenter-3', name: 'Kumail Abbas', service: 'carpenter', phone: '8108064938', location: 'Kurla West', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'carpenter-4', name: 'Jafar Abbas - Contractor', service: 'carpenter', phone: '9920834272', location: 'Bandra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'comp-hw-1', name: 'Gizmosbuy Laptop store Shahnawaz', service: 'computer-hardware', phone: 'Kadar - 7208979260 / MazharAli - 8460013060 / AliHusain - 8849765910', location: 'Jogeshwart west', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'comp-hw-2', name: 'Afzal Jassani', service: 'computer-hardware', phone: '7302518148 / 7977203537', location: 'Kurla', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'comp-hw-3', name: 'Aatif Mirza', service: 'computer-hardware', phone: '9892724431', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'comp-shop-1', name: 'Sajid', service: 'computer-shops', phone: '7666743176', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'comp-shop-2', name: 'Sadiq', service: 'computer-shops', phone: '8097320057', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'comp-shop-3', name: 'Geek Lappy', service: 'computer-shops', phone: '9821426602', location: 'Andheri', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'comp-shop-4', name: 'Ayaz (Blue Bird Computers)', service: 'computer-shops', phone: '9967664893 / +971 521215786', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'comp-shop-5', name: 'Altaf Bootwala', service: 'computer-shops', phone: '9821064462 / 7820306551 / 9920020969', location: 'Bandra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'comp-shop-6', name: 'Ali Asgar H. Panjwani - Refurbished Computer', service: 'computer-shops', phone: '8097860140', location: 'Kurla', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'comp-shop-7', name: 'Afzal Jassani - IT Support', service: 'computer-shops', phone: '7302518148 / 7977203537', location: 'Kurla', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'comp-shop-8', name: 'Aadil', service: 'computer-shops', phone: '8879334601', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'counselor-1', name: 'Sharmin S Merchant', service: 'counselor-psychologist', phone: '9769543882', location: 'Mazgaon', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'counselor-2', name: 'Mohaddesa Dhamani Patel', service: 'counselor-psychologist', phone: '7304354110', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'crockery-1', name: 'Home & Kitchen Products - ONLINE HUB - Mrs. Ishrat Rawjee', service: 'crockery', phone: '9987135125', location: 'Versova, Andheri west', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'crockery-2', name: 'Mohammed Baqir Sayed', service: 'crockery', phone: '9773977647', location: 'Kurla West', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'dairy-1', name: 'Masarrat Contractor - Pure Ghee - Healthy Treat', service: 'dairy', phone: '9820209967', location: 'Versova, Andheri', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'delivery-1', name: 'Ali Imran Moosa', service: 'delivery-services', phone: '9702861472', location: '24/7 - all India Circle - Train / Tatkal Ticket - Sale Relocation', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'design-1', name: 'Amaan mirza', service: 'designing', phone: '9372963469', location: 'Making business card logo invitation card and wedding card', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'design-2', name: 'Zoheb', service: 'designing', phone: '9833697242', location: 'Graphic Designer', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'design-3', name: 'Tanveer Sayed', service: 'designing', phone: '8779790625', location: 'All over Mumbai', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'design-4', name: 'Mohammed Zamaan Variyala', service: 'designing', phone: '7208126927', location: 'Kurla', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'design-5', name: 'Mohamad Abbas Gabhrani', service: 'designing', phone: '8268913267', location: 'Social Media Marketing & Website Designing', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'design-6', name: 'Khan Mohammad Ali', service: 'designing', phone: '8779934001', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'design-7', name: 'Fatima Bhimani', service: 'designing', phone: '9820921644', location: 'Mumbai', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'design-8', name: 'Fasihul Hasan Rizvi', service: 'designing', phone: '9224382332', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'design-9', name: 'Azhar', service: 'designing', phone: '8169404322', location: 'Govandi', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'design-10', name: 'Asif Shaikh', service: 'designing', phone: '8108782025', location: 'Graphic Designer', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'design-11', name: 'Abbas Farishta', service: 'designing', phone: '7700051282', location: 'Graphic Designer', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'design-12', name: 'Mohammed Taqeeb Rizvi', service: 'designing', phone: '8169021830', location: 'Graphic Designer', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'design-13', name: 'Hashim Raza - Unique Arts', service: 'designing', phone: '9870563724 / 7385110110', location: 'Samuel St, Mumbai', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'disposal-1', name: 'Sarfaraz Dildir Sayyed', service: 'disposals', phone: '9892136258', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'disposal-2', name: 'Haidery', service: 'disposals', phone: '7715810154', location: 'Dongri', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'docs-1', name: 'Ali Haq Online Services', service: 'documents-work', phone: '8652745270 / 9082909623', location: 'Govandi', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'docs-2', name: 'Mohammed Aon Momin', service: 'documents-work', phone: '7506995110', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'dry-fruit-1', name: 'QUM DRY FRUITS (Mohammad Taki Hemani)', service: 'dry-fruits', phone: '9326018694', location: 'Dongri', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'dry-fruit-2', name: 'Hasnain Bhimani - Choconuts', service: 'dry-fruits', phone: '8169104942', location: 'Kurla', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'dev-1', name: 'Yusuf Bhimani', service: 'developer', phone: '8108792110 / 9967398246', location: 'Nerul', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'dev-2', name: 'Tabassum Sheliya', service: 'developer', phone: '7021710954', location: 'Mumbai', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'dev-3', name: 'Mohd Hasan Sayyed', service: 'developer', phone: '9167448853', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'dev-4', name: 'Baqir Shaikh', service: 'developer', phone: '8369269987', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'dev-5', name: 'Ali Asgar H. Panjwani', service: 'developer', phone: '8097860140', location: 'Kurla', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'dev-6', name: 'Abbas Ashar', service: 'developer', phone: '8451917056', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'dev-7', name: 'DeveloperOnGo - Mohammad Azam Ansari', service: 'developer', phone: '7021720789', location: 'BKC, Bandra East', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'elec-1', name: 'Sonu Baughe Zehra', service: 'electrician', phone: '7400100846', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'elec-2', name: 'Zulfiqar Mirza', service: 'electrician', phone: '9082193700', location: 'Kurla', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'elec-3', name: 'Zeeshan Sayed', service: 'electrician', phone: '9892381335', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'elec-4', name: 'Sayyed Nazar Abbas', service: 'electrician', phone: '9321586725', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'elec-5', name: 'Saif Sayyad', service: 'electrician', phone: '8268604674', location: 'Bandra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'elec-6', name: 'Qamar Abbas', service: 'electrician', phone: '8779681126', location: 'Dongri', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'elec-7', name: 'Mohammed Athar', service: 'electrician', phone: '9820374344', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'elec-8', name: 'Kasim Khoja', service: 'electrician', phone: '8879476313', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'elec-9', name: 'Jabbar bhai', service: 'electrician', phone: '9833302521', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'elec-10', name: 'Baqir', service: 'electrician', phone: '7718033034', location: 'Santacruz West', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'elec-11', name: 'Anees bhai', service: 'electrician', phone: '9221336925 / 7700099280', location: 'Suhana, Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'elec-12', name: 'Ali Talajawala', service: 'electrician', phone: '8268778614', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'elec-13', name: 'Ali Akbar', service: 'electrician', phone: '8928762657', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'elec-14', name: 'Alamdar', service: 'electrician', phone: '9653123063', location: 'Dongri', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'elec-15', name: 'Abu', service: 'electrician', phone: '9220131798', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'elec-16', name: 'Aamir', service: 'electrician', phone: '7838295512', location: 'Dongri', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'elec-17', name: 'Hasan Rizvi', service: 'electrician', phone: '8454825814', location: 'Golibar, Santacruz East', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'erepair-1', name: 'Arif Rizvi', service: 'electronic-repair', phone: '8655272756 / 8693028419', location: 'Kurla West', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'erepair-2', name: 'Salman Rizvi', service: 'electronic-repair', phone: '9082681923', location: 'Kausa, Mumbra, Thane and Mumbai', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'erepair-3', name: 'Qasim', service: 'electronic-repair', phone: '8850724326', location: 'Sanjay Nagar, Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'erepair-4', name: 'Mohammad Askari', service: 'electronic-repair', phone: '9867439663', location: 'All over Mumbai', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'erepair-5', name: 'Faizan Rizvi', service: 'electronic-repair', phone: '7506069461 / 8082082174', location: 'Bhindibazar, Mumbai & Thane', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'erepair-6', name: 'Arif Rizvi', service: 'electronic-repair', phone: '9892959525', location: 'Mumbai', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
  { id: 'erepair-7', name: 'Arif', service: 'electronic-repair', phone: '8693028419', location: 'Kurla', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-3')?.imageUrl || '' },
  { id: 'erepair-8', name: 'Aman', service: 'electronic-repair', phone: '8169221710', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-4')?.imageUrl || '' },
  { id: 'erepair-9', name: 'Irfan Mirza', service: 'electronic-repair', phone: '9867403646', location: 'Mumbai', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-1')?.imageUrl || '' },
  { id: 'erepair-10', name: 'Aliraza', service: 'electronic-repair', phone: '9170835110', location: 'Mumbra', ...generateRandomData(), avatarUrl: getPlaceholderImage('avatar-2')?.imageUrl || '' },
];


export interface Booking {
    id: string;
    partner: Partner;
    service: ServiceCategory;
    date: Date;
    status: 'Active' | 'Completed' | 'Cancelled' | 'Requested' | 'On the way';
    rating?: number;
}

// Find a partner and service for bookings, defaulting to first if not found
const getPartnerById = (id: string) => partners.find(p => p.id === id) || partners[0];
const getServiceById = (id: string) => serviceCategories.find(s => s.id === id) || serviceCategories[0];


export const bookings: Booking[] = [
    { id: 'booking1', partner: getPartnerById('acc-2'), service: getServiceById('accountant'), date: new Date('2024-08-15T10:00:00'), status: 'Active' },
    { id: 'booking2', partner: getPartnerById('adv-1'), service: getServiceById('advocate'), date: new Date('2024-08-14T14:30:00'), status: 'Completed', rating: 4 },
    { id: 'booking3', partner: getPartnerById('elec-1'), service: getServiceById('electrician'), date: new Date('2024-07-20T09:00:00'), status: 'Completed', rating: 5 },
    { id: 'booking4', partner: getPartnerById('car-driver-1'), service: getServiceById('driver'), date: new Date(), status: 'Active' },
    { id: 'booking5', partner: getPartnerById('carpenter-2'), service: getServiceById('carpenter'), date: new Date('2024-08-18T16:00:00'), status: 'Requested' },
];

export interface NavItem {
    href: string;
    label: string;
    iconName: keyof typeof import("lucide-react");
}

export const customerNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Home', iconName: 'Home' },
    { href: '/history', label: 'My History', iconName: 'History' },
    { href: '/favorites', label: 'Favorites', iconName: 'Heart' },
    { href: '/notifications', label: 'Notifications', iconName: 'Bell' },
    { href: '/profile', label: 'Profile', iconName: 'User' },
];

export const partnerNavItems: NavItem[] = [
    { href: '/partner/dashboard', label: 'Home', iconName: 'Home' },
    { href: '/partner/earnings', label: 'Earnings', iconName: 'DollarSign' },
    { href: '/partner/enquiries', label: 'Enquiries', iconName: 'Briefcase' },
    { href: '/partner/listings', label: 'Listings', iconName: 'Package' },
    { href: '/partner/profile', label: 'Profile', iconName: 'User' },
];

export const partnerOnboardingNavItems: NavItem[] = [
    { href: '/partner/onboarding', label: 'Onboarding', iconName: 'FileText' },
    { href: '/', label: 'Exit', iconName: 'Home' },
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
