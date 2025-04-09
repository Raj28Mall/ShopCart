/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ShoppingBag, ArrowDown, ChevronDown, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import { useProductStore } from '@/store/productStore';
import { ProductCard } from '@/components/productCard';

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  shortDescription: string
  longDescription: string
  rating: number
  quantity: number
  details: string[]
}


const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const FILTERS=["Clothes", "Electronics", "Kitchen Appliances", "Sports", "Beauty"];
const SORT_BY=[ {name: "Rating", value:"rating"}, {name:"Newest", value:"newest"}, {name: "Price: Low to High", value:"price-low"}, {name: "Price: High to Low", value:"price-high"}];

export default function Products(){
    const [sortOption, setSortOption] = useState<string>();
    const [displayCount, setDisplayCount]=useState<number>(15);
    const products= useProductStore((state) => state.products);
    const setProducts= useProductStore((state) => state.setProducts);
    const [displayProducts, setDisplayProducts]= useState<Product[]>([]);
    const [loading, setLoading]= useState<boolean>(true);

    useEffect(() => {
      const load = async ()=>{
        await sleep(1000);
        setLoading(false);
        setProducts([
          {
            id: 1,
            name: "Premium Cotton T-Shirt",
            price: 29.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Clothes",
            rating: 4.4,
            quantity: 0,
            shortDescription: "Comfortable everyday cotton t-shirt with classic fit.",
            longDescription: "Experience unparalleled comfort with our Premium Cotton T-Shirt, crafted from the finest cotton fibers for breathability and softness. The classic cut flatters all body types with room across the chest and shoulders, while the reinforced collar maintains its shape wash after wash. Features precision stitching that prevents fraying, making it perfect for countless outfits. Whether paired with jeans for a casual look or layered under a blazer, this t-shirt delivers exceptional quality for everyday wear.",
            details: ["Made from 100% premium cotton", "Machine washable", "Available in multiple colors"]
          },
          {
            id: 2,
            name: "Wireless Headphones",
            price: 129.99,
            image: "/headphones.webp",
            category: "Electronics",
            rating: 4.6,
            quantity: 0,
            shortDescription: "Premium noise-cancelling wireless headphones with exceptional sound quality.",
            longDescription: "Immerse yourself in an audio experience that transforms how you listen to music with our Wireless Headphones. The advanced noise cancellation technology creates a personal sanctuary by neutralizing outside distractions. Custom-engineered 40mm drivers deliver crystal-clear high notes, rich midtones, and deep bass that reveals subtle details in your tracks. Premium memory foam ear cushions provide hours of listening comfort while creating an acoustic seal that enhances noise-cancelling. Perfect for commuting, working in crowded spaces, or appreciating your music in its fullest fidelity.",
            details: ["Bluetooth 5.0", "20-hour battery", "Foldable design", "Built-in mic for calls"]
          },
          {
            id: 3,
            name: "Ceramic Coffee Mug",
            price: 19.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Kitchen Appliances",
            rating: 4.2,
            quantity: 0,
            shortDescription: "Elegant ceramic mug for hot and cold beverages.",
            longDescription: "Transform your daily coffee or tea ritual with our artisanal Ceramic Coffee Mug, handcrafted by skilled artisans. The premium ceramic features specialized glazing that maintains your beverage's temperature longer while preventing metallic or plastic aftertaste. The ergonomically designed handle provides perfect balance and comfortable grip. The mug's substantial weight creates a satisfying heft that grounds your morning routine. Each mug undergoes multiple quality inspections to ensure durability, promising to become a cherished vessel for countless warm conversations.",
            details: ["12oz capacity", "Microwave and dishwasher safe", "Matte ceramic finish"]
          },
          {
            id: 4,
            name: "Eco-Friendly Notebook",
            price: 9.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.1,
            quantity: 0,
            shortDescription: "Sustainable notebook made from recycled materials.",
            longDescription: "Our Eco-Friendly Notebook represents perfect harmony between functionality and environmental responsibility. The smooth, acid-free pages provide an exceptional writing experience with just the right texture to prevent skipping while allowing ink to dry quickly. Each sheet is processed using renewable energy and filtered water, significantly reducing carbon footprint. The binding is designed to lay completely flat when open, allowing full page utilization. The subtle flecks visible in the paper tell the story of its previous life, creating a unique aesthetic that reminds you of your contribution to sustainable practices.",
            details: ["80 ruled pages", "Made with recycled paper", "A5 size"]
          },
          {
            id: 5,
            name: "Bluetooth Speaker",
            price: 49.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.5,
            quantity: 0,
            shortDescription: "Compact portable speaker with powerful sound and long battery life.",
            longDescription: "Experience room-filling sound that defies the compact dimensions of our Bluetooth Speaker. Engineered with dual passive radiators working with the high-excursion driver, this powerhouse delivers stunning clarity with impressive bass response. The precision-tuned acoustics automatically adjust to your environment, optimizing sound whether outdoors or in any room. The ruggedized exterior protects sophisticated internal technology, including a digital signal processor that prevents distortion at maximum volume. Features intuitive touch controls and voice assistant compatibility for hands-free control.",
            details: ["10W output", "Water-resistant", "12-hour playtime", "Supports TWS pairing"]
          },
          {
            id: 6,
            name: "Running Shoes",
            price: 89.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Sports",
            rating: 4.3,
            quantity: 0,
            shortDescription: "Athletic running shoes with cushioned support and breathable design.",
            longDescription: "Transform your running experience with these meticulously engineered shoes. The revolutionary midsole features responsive cushioning that compresses under impact and rebounds to propel you forward, reducing fatigue and returning energy to your stride. The breathable mesh upper incorporates zones of flexibility and support, expanding with your foot's motion while providing stability where needed most. Reflective elements enhance visibility during early morning or evening runs. The outsole pattern was developed by analyzing thousands of wear patterns, reinforcing high-abrasion areas while reducing weight in others for optimal durability and lightness.",
            details: ["Mesh upper", "EVA sole", "Arch support", "Ideal for daily runs and training"]
          },
          {
            id: 7,
            name: "Stainless Steel Water Bottle",
            price: 24.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Kitchen Appliances",
            rating: 4.7,
            quantity: 0,
            shortDescription: "Insulated water bottle that maintains temperature for hours.",
            longDescription: "Our premium Stainless Steel Water Bottle features sophisticated vacuum insulation technology that creates a barrier between your beverage and outside temperatures. The double-wall construction keeps ice solid for over 24 hours in heat, while hot beverages maintain temperature for 12 hours. Medical-grade stainless steel prevents flavor transfer, while the precision-engineered cap creates a hermetic seal eliminating leaks. The exterior features specialized powder coating providing secure grip even with condensation while resisting scratches. By eliminating single-use plastics, this bottle is both practical luxury and environmental statement.",
            details: ["Double-wall insulated", "BPA-free", "750ml capacity", "Leak-proof lid"]
          },
          {
            id: 8,
            name: "Minimalist Wristwatch",
            price: 199.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.5,
            quantity: 0,
            shortDescription: "Elegant timepiece with classic design and modern functionality.",
            longDescription: "This Minimalist Wristwatch represents the perfect marriage of traditional craftsmanship and contemporary design. The clean dial features applied indices that catch light differently throughout the day, creating dynamic interplay of shadows and reflections. Beneath the sapphire crystal lies a precision Japanese movement that maintains accuracy within seconds per month. The case is machined from a single block of 316L stainless steel for exceptional corrosion resistance. The genuine leather strap undergoes a 15-step tanning process for butter-soft flexibility, developing a unique patina over time. Water-resistant to 50 meters for versatile daily wear.",
            details: ["Stainless steel body", "Leather strap", "Water resistant", "Quartz movement"]
          },
          {
            id: 9,
            name: "Laptop Stand",
            price: 39.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.4,
            quantity: 0,
            shortDescription: "Ergonomic laptop stand for improved posture and device cooling.",
            longDescription: "Transform your workspace with our ergonomically designed Laptop Stand. The precision-calculated elevation positions your screen at eye level, correcting hunched posture that leads to neck strain during extended work sessions. The open architecture creates channels for air circulation, improving thermal efficiency and preventing CPU throttling during resource-intensive tasks. Constructed from aircraft-grade aluminum, it supports even heavy laptops while remaining lightweight. Silicone contact points provide stability while protecting your device from scratches. The collapsible design transforms from full elevation to flat storage in seconds, perfect for hybrid workers or digital nomads.",
            details: ["Aluminum alloy", "Adjustable height", "Supports up to 17\" laptops"]
          },
          {
            id: 10,
            name: "Desk Organizer Set",
            price: 17.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.2,
            quantity: 0,
            shortDescription: "Multi-piece desk organization system for efficient workspace management.",
            longDescription: "Restore order to your workspace with our comprehensive Desk Organizer Set, designed to address the organizational challenges of modern professionals. Each component is engineered for specific office essentials while maintaining visual harmony. The pen holder features graduated compartments that separate writing instruments by height. The document tray incorporates a subtle incline that keeps papers aligned, while tiered levels create natural prioritization. The sticky note compartment includes a weighted base for one-handed note retrieval. Crafted from durable materials with fingerprint-resistant finish, this system transforms desktop chaos into intentional organization.",
            details: ["5-piece set", "Includes pen holder", "Tray", "Sticky note box", "And more"]
          },
          {
            id: 11,
            name: "LED Desk Lamp",
            price: 34.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.6,
            quantity: 0,
            shortDescription: "Adjustable desk lamp with multiple lighting modes and USB charging.",
            longDescription: "Illuminate your workspace with precision using our advanced LED Desk Lamp. The custom-engineered LED array delivers flicker-free illumination, eliminating the strain that contributes to headaches and eye fatigue. The optical diffuser creates even light distribution that minimizes harsh shadows. Select from five color temperature settings developed for different activities—from energizing cool white to warm amber that promotes relaxation. The intuitive touch panel responds to the slightest contact for seamless adjustments. The infinitely adjustable arm combines smooth rotation with firm stability, positioning light precisely where needed without drifting.",
            details: ["Touch controls", "3 color modes", "USB charging port", "Foldable design"]
          },
          {
            id: 12,
            name: "Smartphone Tripod",
            price: 22.49,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.3,
            quantity: 0,
            shortDescription: "Flexible tripod for smartphones with remote shutter control.",
            longDescription: "Elevate your mobile photography with our revolutionary Smartphone Tripod. The innovative flexible legs constructed from specialized polymer wrapped around aluminum cores can bend and twist with secure tension, enabling stable positioning on uneven surfaces or wrapping around poles and branches for unique perspectives. The smartphone mount incorporates a spring-loaded mechanism accommodating devices of any size without adjustment screws. The included Bluetooth remote pairs with any iOS or Android device, enabling shutter triggering from up to 30 feet away—perfect for group photos. The ball head rotates 360 degrees with 90-degree tilt capability for quick recomposition without moving the base.",
            details: ["360° ball head", "Remote shutter", "Compatible with all phones"]
          },
          {
            id: 13,
            name: "Noise-Cancelling Earbuds",
            price: 79.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.5,
            quantity: 0,
            shortDescription: "Wireless earbuds with active noise cancellation and comfortable fit.",
            longDescription: "Discover acoustic sanctuary anywhere with our Noise-Cancelling Earbuds. The hybrid active noise cancellation system employs feedforward and feedback microphones to analyze external sounds and your ear canal's unique properties, generating anti-noise waves that neutralize disturbances. The 8mm beryllium-coated drivers deliver extraordinary detail throughout the frequency range. The ergonomic design was developed using 3D scans from thousands of ear shapes, creating a universal fit that distributes pressure evenly. Voice isolation technology employs beamforming microphones focused on your speech with algorithmic processing that filters background noise, ensuring clear call quality even in crowded environments.",
            details: ["ANC", "8-hour playtime", "Fast charging", "Sweat-proof design"]
          },
          {
            id: 14,
            name: "Portable Charger 10000mAh",
            price: 29.49,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.4,
            quantity: 0,
            shortDescription: "High-capacity portable battery pack for on-the-go charging.",
            longDescription: "Never experience the anxiety of a dying device with our Portable Charger. Premium lithium-polymer cells deliver remarkable energy density in a compact form. The intelligent power management system monitors voltage, current, and temperature, automatically adjusting output to provide fast charging while protecting your devices. Aircraft-grade aluminum housing dissipates heat efficiently while providing durability against drops. The LED power indicator uses calibrated resistance measurements to display actual remaining capacity. Multiple output ports feature device detection technology that optimizes power delivery based on specific requirements of your connected devices.",
            details: ["Dual USB output", "Slim design", "LED battery indicator"]
          },
          {
            id: 15,
            name: "Leather Wallet",
            price: 39.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Clothes",
            rating: 4.2,
            quantity: 0,
            shortDescription: "Genuine leather wallet with RFID protection and multiple compartments.",
            longDescription: "Our Leather Wallet represents the pinnacle of traditional craftsmanship enhanced with modern protective technology. Each piece begins with carefully selected full-grain leather that develops a rich patina over time. The interior features military-grade RFID blocking material that creates an electromagnetic shield around your cards, protecting your financial information from digital theft. Master artisans construct each wallet using traditional saddle stitching with high-tensile thread. The innovative card slot design uses a subtle fan mechanism that presents cards at staggered heights when opened, allowing you to instantly locate the exact card you need.",
            details: ["Genuine leather", "RFID blocking", "8 card slots + coin pocket"]
          },
          {
            id: 16,
            name: "Gaming Mouse",
            price: 59.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.6,
            quantity: 0,
            shortDescription: "Precision gaming mouse with programmable buttons and RGB lighting.",
            longDescription: "Dominate the competition with our Gaming Mouse, designed with esports professionals. The PixelPrecise optical sensor delivers unparalleled tracking accuracy with zero acceleration or prediction algorithms, ensuring every micro-adjustment translates exactly to your screen. The optimized weight distribution was perfected through thousands of gameplay hours. The main switches are rated for 60 million clicks with a mechanical tensioning system balancing tactile feedback with minimal activation force. Programmable buttons feature ultrafast signal processing with 1ms polling rate, eliminating input lag. The customizable RGB lighting system offers 16.8 million color options while providing functional benefits like DPI status indicators.",
            details: ["Ergonomic design", "16000 DPI sensor", "6 programmable buttons", "Ideal for FPS games"]
          },
          {
            id: 17,
            name: "Wireless Mechanical Keyboard",
            price: 109.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.8,
            quantity: 0,
            shortDescription: "Premium wireless keyboard with tactile mechanical switches.",
            longDescription: "Experience typing perfection with our Wireless Mechanical Keyboard. Each key houses an individual German-manufactured switch with gold-plated contact points providing consistent actuation force and satisfying tactile feedback. The keycaps are crafted from double-shot PBT plastic that will never fade even after years of use, with a subtly textured surface for excellent finger positioning. The aircraft-grade aluminum top plate provides exceptional rigidity that eliminates flex and creaking. Advanced Bluetooth implementation features adaptive frequency hopping to avoid interference, while 1000Hz polling rate delivers wired-like responsiveness for demanding gamers.",
            details: ["Customizable keys", "Bluetooth and USB-C connectivity", "Perfect for productivity and gaming"]
          },
          {
            id: 18,
            name: "4K Webcam",
            price: 89.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.5,
            quantity: 0,
            shortDescription: "Ultra HD webcam for professional-quality video calls and streaming.",
            longDescription: "Make an unforgettable impression in every virtual interaction with our professional-grade 4K Webcam. The precision-ground glass lens with multi-element design minimizes distortion while maximizing light capture, delivering exceptional clarity even in low-light environments. The advanced sensor captures four times the resolution of standard HD cameras, revealing natural details that create more authentic connections. The custom-designed signal processor automatically optimizes exposure, color balance, and contrast 60 times per second. Dual stereo microphones employ noise cancellation technology that focuses on your voice while filtering out background distractions.",
            details: ["4K resolution", "Dual noise-canceling mics", "Wide-angle lens", "USB plug-and-play"]
          },
          {
            id: 19,
            name: "Ergonomic Office Chair",
            price: 249.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.7,
            quantity: 0,
            shortDescription: "Adjustable office chair designed for comfort during long work hours.",
            longDescription: "Transform your work experience with our Ergonomic Office Chair, developed with orthopedic specialists. The dynamically adaptive lumbar support automatically adjusts to your movements, providing continuous support for proper spinal alignment. The breathable mesh back features varying tension zones mapped to different areas of your back. The waterfall-edge seat cushion utilizes high-resilience foam with temperature-responsive properties, distributing weight evenly to eliminate pressure points. The precision-engineered synchronous tilt mechanism maintains ideal angles between torso and legs throughout different recline positions, allowing posture changes throughout the day to reduce muscle fatigue.",
            details: ["Adjustable height", "Headrest", "And armrests", "Promotes good posture for long work sessions"]
          },
          {
            id: 20,
            name: "Smart LED Light Strips",
            price: 34.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.3,
            quantity: 0,
            shortDescription: "Customizable LED strips with app control and voice command support.",
            longDescription: "Transform any space with our Smart LED Light Strips that combine sophisticated illumination technology with intuitive controls. Each strip contains individually addressable RGB LEDs capable of displaying 16 million distinct colors, allowing you to precisely match existing décor or create dramatic contrasts. The advanced controller interprets audio input through frequency analysis algorithms, synchronizing light patterns with your music. The modular design allows you to connect multiple strips seamlessly while maintaining perfect color uniformity. The smartphone app provides unprecedented control from simple color selection to complex dynamic scenes simulating natural phenomena like ocean waves or sunrise progressions.",
            details: ["Compatible with Alexa/Google", "16M colors", "Music sync", "App-controlled"]
          },
          {
            id: 21,
            name: "USB-C Docking Station",
            price: 79.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.4,
            quantity: 0,
            shortDescription: "Multi-port hub for connecting multiple devices to your laptop.",
            longDescription: "Transform your laptop into a complete workstation with our USB-C Docking Station. The precision-machined aluminum housing contains advanced chipsets that manage multiple high-bandwidth data streams simultaneously. The HDMI ports support 60Hz refresh rates at full 4K resolution, enabling smooth visuals for video editing or presentations. The USB ports feature smart power management that identifies connected devices and delivers optimal charging current. The Gigabit Ethernet port provides secure, stable networking that outperforms wireless connections. The SD card reader supports high-capacity UHS-II cards, offering transfer speeds up to 300MB/s for importing large media files.",
            details: ["Includes HDMI", "USB-A/C", "Ethernet", "SD card reader", "Ideal for work-from-home setups"]
          },
          {
            id: 22,
            name: "Adjustable Standing Desk",
            price: 399.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.8,
            quantity: 0,
            shortDescription: "Motorized desk that transitions between sitting and standing positions.",
            longDescription: "Revolutionize your work environment with our Adjustable Standing Desk. Commercial-grade dual motors operate in perfect synchronization to provide smooth, whisper-quiet height adjustments, lifting up to 350 pounds with absolute stability. The advanced control system features four programmable memory positions for instant transitions between sitting and standing heights. The anti-collision detection system uses sensitive accelerometers to halt and reverse movement if obstructions are detected. The sustainably sourced desktop resists scratches, water damage, and heat. The steel frame construction incorporates cross-supports that eliminate wobbling even at maximum height extension.",
            details: ["Programmable presets", "Smooth motor lift", "Enhances productivity and posture"]
          },
          {
            id: 23,
            name: "Noise-Isolating Microphone",
            price: 119.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.6,
            quantity: 0,
            shortDescription: "Studio-quality microphone for professional recordings and streaming.",
            longDescription: "Capture broadcast-quality audio with our Noise-Isolating Microphone. The large-diaphragm condenser capsule features a precision-manufactured gold-sputtered membrane that captures the subtle nuances of your voice with remarkable sensitivity. The cardioid polar pattern focuses on sound sources directly in front while rejecting off-axis noise, creating clean recordings even in imperfect spaces. The included shock mount employs military-grade elastic suspension that isolates the capsule from vibrations through your desk or floor. The studio-grade internal components utilize discrete circuitry rather than integrated chips, delivering superior signal-to-noise ratio with low distortion.",
            details: ["Cardioid pattern", "Shock mount", "Pop filter included", "USB plug-and-play"]
          },
          {
            id: 24,
            name: "Foldable Laptop Stand",
            price: 27.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.4,
            quantity: 0,
            shortDescription: "Portable laptop stand that folds flat for easy transport.",
            longDescription: "Elevate your mobile workstation with our ingeniously designed Foldable Laptop Stand. The sophisticated hinge mechanism transforms from a flat profile to a sturdy elevation platform in seconds, requiring no assembly. The aerospace-grade aluminum construction achieves remarkable structural integrity while maintaining minimal weight. The optimized viewing angle positions your screen at eye level, immediately improving posture by straightening your spine and relieving neck strain. The open architecture improves airflow around your device, preventing thermal throttling during processor-intensive tasks. The non-slip silicone pads grip both laptop and supporting surface securely.",
            details: ["Adjustable angles", "Aluminum build", "Improves ergonomics and cooling"]
          },
          {
            id: 25,
            name: "Fitness Tracker Watch",
            price: 79.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Sports",
            rating: 4.5,
            quantity: 0,
            shortDescription: "Smart watch that monitors health metrics and daily activities.",
            longDescription: "Transform your health journey with our comprehensive Fitness Tracker Watch. The advanced optical heart rate monitor uses multiple LED wavelengths and algorithms to deliver medical-grade accuracy during both rest and high-intensity activities. The accelerometer and gyroscope work together to identify specific movement patterns, automatically recognizing different exercise types without manual input. The sleep analysis system tracks not just duration but also sleep architecture, including light, deep, and REM phases, providing actionable recommendations for improving rest quality. The interface presents complex health data through easily understood visualizations that highlight meaningful patterns.",
            details: ["Heart rate", "Sleep monitoring", "Waterproof", "Long battery life", "Syncs with mobile apps"]
          },
          {
            id: 26,
            name: "Anti-Glare Screen Protector",
            price: 14.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.2,
            quantity: 0,
            shortDescription: "Matte screen filter that reduces eye strain and reflections.",
            longDescription: "Protect both your device and vision with our specialized Anti-Glare Screen Protector. The precision-manufactured film incorporates microscopic texture elements that diffuse reflected light without distorting pixels, reducing harsh reflections that cause eye strain. The oleophobic coating repels fingerprints and oils, maintaining a clean appearance. The multi-layer construction includes a self-healing top coat that allows minor scratches to disappear over time. The matte finish provides a paper-like writing experience when using a stylus, creating just the right resistance for precise control. The specialized adhesive applies without bubbles yet can be removed without residue.",
            details: ["Scratch-resistant", "Fingerprint-proof", "Easy installation for laptops/tablets"]
          },
          {
            id: 27,
            name: "Smart Door Lock",
            price: 129.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.4,
            quantity: 0,
            shortDescription: "Digital door lock with remote access and monitoring features.",
            longDescription: "Modernize your home security with our Smart Door Lock. Military-grade encryption protocols protect all communications between the lock, smartphone, and servers. The mechanical components feature hardened steel construction and anti-drill plates exceeding the highest residential security ratings. The intuitive mobile app provides complete access management, allowing you to grant entry permissions with time constraints while maintaining a detailed access log. The auto-lock feature secures your door automatically after a customizable delay. The weatherproof exterior components withstand extreme temperatures, rain, and UV exposure without degradation.",
            details: ["Supports passcodes", "Remote access", "Activity logs", "Integrates with smart home systems"]
          },
          {
            id: 28,
            name: "Wireless Charging Pad",
            price: 49.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.3,
            quantity: 0,
            shortDescription: "Fast-charging wireless pad for compatible smartphones and devices.",
            longDescription: "Eliminate cable clutter with our premium Wireless Charging Pad. The advanced charging coil array features overlapping coverage patterns that eliminate precise placement requirements, allowing reliable charging regardless of device position—even in protective cases up to 5mm thick. The intelligent power management system automatically detects your device's specific charging capabilities, delivering the maximum safe power level from 5W up to 15W. The minimalist design incorporates an ambient light sensor that dims the status indicator at night. The non-slip surface utilizes medical-grade silicone that maintains its tackiness without collecting dust.",
            details: ["Qi-certified", "Supports 15W fast charging", "Anti-slip base", "LED status indicator"]
          },
          {
            id: 29,
            name: "Ultra Slim Power Bank",
            price: 32.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.5,
            quantity: 0,
            shortDescription: "Thin, lightweight portable battery with digital power display.",
            longDescription: "Experience the perfect synthesis of capacity and portability with our Ultra Slim Power Bank. Revolutionary lithium-polymer cell technology achieves energy density 30% higher than conventional power banks, enabling a slim 8.5mm profile that slides easily into pockets. The high-precision digital display shows exact remaining battery percentage rather than vague LED indicators. Premium circuit design incorporates 12 separate protection systems against overcharging, overheating, and power surges. The dual output ports feature independent charging controllers that deliver optimized power to each connected device simultaneously without performance degradation.",
            details: ["Dual output", "USB-C and micro-USB input", "LED display", "Airline safe"]
          },
          {
            id: 30,
            name: "Electric Milk Frother",
            price: 19.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Kitchen Appliances",
            rating: 4.6,
            quantity: 0,
            shortDescription: "Handheld frother for creating barista-quality coffee drinks at home.",
            longDescription: "Transform your morning coffee routine with our professional-grade Electric Milk Frother. The precision-engineered motor spins the whisk at the optimal 19,000 RPM—creating perfect microfoam without excessive splashing. The sophisticated spiral whisk head is manufactured from food-grade stainless steel with ideal tine arrangement for velvety foam with the microbubble consistency required for latte art. The ergonomic handle features a soft-touch silicone grip for comfortable control. The waterproof sealing exceeds IPX7 standards, allowing immersion for easy cleaning without water damage concerns.",
            details: ["One-button operation", "Stainless steel whisk", "Ideal for lattes and cappuccinos"]
          },
          {
            id: 31,
            name: "Mini Projector",
            price: 199.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.3,
            quantity: 0,
            shortDescription: "Compact projector for home entertainment and presentations.",
            longDescription: "Unleash entertainment possibilities anywhere with our revolutionary Mini Projector. The advanced LED light source produces remarkably vivid colors with 120% Rec.709 color gamut coverage while operating silently with 30,000 hours of life. The custom-designed optical system creates stunning clarity while the automatic keystone correction and focus features instantly optimize projection geometry even when placed at imperfect angles. The intuitive interface requires zero technical knowledge, while versatile connectivity options support everything from DVD players to streaming devices and gaming consoles. The built-in stereo speakers utilize sophisticated digital signal processing to create surprisingly rich sound.",
            details: ["HD resolution", "HDMI/USB input", "Portable design", "Built-in speakers"]
          },
          {
            id: 32,
            name: "WiFi Security Camera",
            price: 89.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.4,
            quantity: 0,
            shortDescription: "Smart security camera with motion detection and remote viewing.",
            longDescription: "Protect what matters most with our sophisticated WiFi Security Camera. The advanced image sensor captures crystal-clear 1080p footage with remarkable low-light performance, utilizing infrared illumination that's invisible to the human eye but provides detailed nighttime monitoring up to 30 feet away. The intelligent motion detection system uses computer vision algorithms that distinguish between humans, animals, and object movement, reducing false alerts while ensuring notification of legitimate security concerns. The two-way audio feature enables clear communication through built-in noise-cancelling microphones and a powerful speaker. The intuitive mobile app provides secure access to live and recorded footage from anywhere.",
            details: ["1080p recording", "Motion detection", "Two-way audio", "App access"]
          },
          {
            id: 33,
            name: "Wireless Barcode Scanner",
            price: 59.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.1,
            quantity: 0,
            shortDescription: "Cordless scanner for inventory management and point-of-sale systems.",
            longDescription: "Streamline your business operations with our professional-grade Wireless Barcode Scanner. The advanced optical system captures crisp barcode images even when printed with low contrast, damaged, or on reflective surfaces that confound basic scanners. The specialized decoder interprets over 30 barcode formats including UPC/EAN, Code 39, QR, and DataMatrix. The wireless design utilizes enhanced Bluetooth technology with automatic frequency hopping that maintains reliable connectivity up to 100 feet from the receiver. The ergonomic design reduces operator fatigue during intensive scanning sessions, with intuitive button placement and balanced weight distribution.",
            details: ["Supports 1D/2D codes", "Long battery life", "Plug-and-play USB receiver"]
          },
          {
            id: 34,
            name: "Multi-Port USB Hub",
            price: 24.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.4,
            quantity: 0,
            shortDescription: "Aluminum USB hub that expands connectivity for multiple devices.",
            longDescription: "Expand your digital workspace with our premium Multi-Port USB Hub. The aircraft-grade aluminum housing provides superior electromagnetic shielding, acts as an effective heat sink, and offers structural integrity protecting internal components. Each USB port is powered by an independent controller chip that delivers full 5Gbps bandwidth to all connected devices simultaneously. The specialized power management system intelligently distributes electrical current according to each device's requirements, properly supporting external drives or high-power peripherals without affecting stability of other connected devices. The plug-and-play functionality requires no driver installation across all major operating systems.",
            details: ["4 USB 3.0 ports", "Compact aluminum body", "Ideal for accessories and storage"]
          },
          {
            id: 35,
            name: "Cordless Handheld Vacuum",
            price: 69.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Kitchen Appliances",
            rating: 4.3,
            quantity: 0,
            shortDescription: "Lightweight portable vacuum for quick and convenient cleaning.",
            longDescription: "Conquer everyday messes with our sophisticated Cordless Handheld Vacuum. The brushless DC motor delivers remarkable suction power while operating with greater efficiency than conventional motors, extending battery life while generating less heat and noise. The cyclonic filtration system creates a powerful vortex that separates dust and debris before reaching the HEPA filter, maintaining optimal airflow while capturing 99.97% of particles as small as 0.3 microns. The thoughtfully designed nozzle combines a wide pickup path with precision edges that clean effectively along baseboards and furniture edges. The transparent dust bin allows monitoring collection capacity at a glance, with one-touch emptying directly into trash without contact with collected dust.",
            details: ["Rechargeable battery", "HEPA filter", "Lightweight", "Great for quick cleanups"]
          }
        ]);
      };
      load(); 
    }, [products]);


    useEffect(() => {
      setDisplayProducts(products);
    }, [products]);
    
    
    const [selected, setSelected]=useState<string[]>([]);

    const toggleSelection = (value: string) => {
      setSelected((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    };

    const handleSort=(sortMethod : string)=>{
      if( !sortMethod ){
        setDisplayProducts(products);
        return;
      }

      if (sortMethod === 'price-low') {
        setDisplayProducts((prev) => [...prev].sort((a, b) => a.price - b.price));
      } else if (sortMethod === 'price-high') {
        setDisplayProducts((prev) => [...prev].sort((a, b) => b.price - a.price));
      } else if (sortMethod === 'rating') {
        setDisplayProducts((prev) => [...prev].sort((a, b) => b.rating - a.rating));
      }
      else if (sortMethod === 'newest') {
        setDisplayProducts((prev) => [...prev].sort((a, b) => b.id - a.id));
      }
    }

    useEffect(() => {
      if (!sortOption) return;
      handleSort(sortOption);
    }, [sortOption]);


    useEffect(() => {
      let updatedProducts= [];
      updatedProducts = products.filter((product) => {
        if (selected.length === 0) return true; // no filters selected, show all products
        return selected.includes(product.category);
      });
      
      if( !sortOption ){
        setDisplayProducts(updatedProducts);
        return;
      }

      if (sortOption === 'price-low') {
        setDisplayProducts(updatedProducts.sort((a, b) => a.price - b.price));
      } else if (sortOption === 'price-high') {
        setDisplayProducts(updatedProducts.sort((a, b) => b.price - a.price));
      } else if (sortOption === 'rating') {
        setDisplayProducts(updatedProducts.sort((a, b) => b.rating - a.rating));
      }
      else if (sortOption === 'newest') {
        setDisplayProducts(updatedProducts.sort((a, b) => b.id - a.id));
      }

    }, [selected, products, sortOption]);

    
    return(
      <div className='overflow-x-hidden min-h-screen bg-white'>
        <Navbar/> 
        <div className='flex flex-row justify-between items-center px-12 py-4 mt-5 mx-5 w-[100vw] overflow-x-hidden'>
            <h1 className='text-3xl font-bold'>All Products</h1>
            <div className='flex flex-row space-x-2'>
                {selected.map((item)=>(
                    <div key={item} className='bg-slate-100 px-2 py-1 rounded-md flex justify-center items-center'>
                        {item}
                        <Button variant={'ghost'} size={'xs'} className='ml-2' onClick={() => toggleSelection(item)}><X/></Button>
                    </div>
                ))}
                {selected.length>1 ? (
                    <Button variant={'outline'} size={'xs'} className='ml-2 px-2 py-1' onClick={() => setSelected([])}>Clear All <X/></Button>
                ) : null}
            </div>
            <div className='flex flex-row space-x-2'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-[180px] flex flex-row justify-between items-center px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
                  >
                    <span>Filters</span>
                    <ChevronDown className="text-gray-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-fit rounded-md border border-gray-200 shadow-md">
                  <div className="flex flex-col gap-2 p-2">
                    {FILTERS.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <Checkbox checked={selected.includes(option)} onCheckedChange={() => toggleSelection(option)} />
                        {option}
                      </label>  
                    ))}
                  </div>
                </PopoverContent>
            </Popover>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px] px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md">
                {SORT_BY.map((option) => (
                  <SelectItem key={option.value} className="text-sm text-gray-700 px-3 py-2 hover:bg-gray-100" value={option.value} onClick={()=> setSortOption(option.value)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
        </div>
          <div className="flex flex-col justify-center items-center font-sans overflow-x-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-6 my-8 px-5 md:px-10 xl:px-25 w-[100vw] ">
              {loading ? (
                Array.from({ length: 15 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse pt-0">
                    <div className="relative h-[250px] w-full bg-gray-200">
                    <Image
                          src={"/placeholder.svg"}
                          alt={"Loading..."}
                          fill
                          className="object-cover"
                        />
                    </div>
                    <CardContent className="px-4">
                      <div className="h-6 bg-gray-300 rounded mb-2" />
                      <div className="flex justify-between items-center mt-2">
                        <div className="h-4 w-16 bg-gray-300 rounded" />
                        <div className="h-8 w-24 bg-gray-300 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : displayProducts.length > 0 ? (
                displayProducts.slice(0, displayCount).map((product) => (
                  <ProductCard key={product.id} id={product.id} name={product.name} image={product.image} price={product.price} quantity={product.quantity}/>
                ))
              ) : (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-3xl font-bold text-gray-700 animate-pulse">🚧 Coming Soon!</p>
                  <p className="text-sm text-gray-500 mt-2">We&apos;ve got something amazing coming for you!</p>
                </div>
              )}
          </div>

          <div className="flex justify-center mb-12 mt-6" hidden={displayCount>=displayProducts.length}>
            <Button size={'xl'} disabled={displayCount>=displayProducts.length} className="text-white mx-auto bg-slate-600 hover:bg-slate-800" onClick={() => {setDisplayCount(displayCount + 15);}}>
              Load More
            </Button>
          </div>
        </div>
      </div>
    );
}