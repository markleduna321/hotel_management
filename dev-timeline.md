Phase 1
UI ----
*icons
*modals
*buttons
*tables
*components
*sections
*pages
*animations
*charts
*color pallete

Pages
****Homepage
- Hero Section (Hotel) with React Three Fiber
1. The Architectural Journey SequenceThe scroll timeline must follow a strict, linear narrative that mimics a physical check-in experience:1.The Hero Arrival (Scroll Level 0):Exterior Shot.The canvas displays a cinematic, wide-angle 3D render of the hotel building exterior. The typography features a prominent minimalist welcome headline and a floating, glassmorphic quick-booking bar.

2. The Grand Entrance (Scroll Level 1):Lobby Reveal.As the user scrolls, the camera pushes forward "through" the entrance. The exterior walls fade out as the camera tracks down a sweeping grand hallway, settling on a wide-angle view of the luxury lobby. Text details highlighting curated amenities fade in.3.The Suite Showcase (Scroll Level 2):Room Sequence.The next scroll pushes the camera out of the lobby and directly into a signature guest suite. Instead of cutting to a new scene, the camera glides into the room, showcasing architectural details like a floor-to-ceiling window view.4.Room-to-Room Switching (Scroll Level 3+):Cross-Fade Carousel.Further scrolling locks the camera position in space but changes the room types (e.g., Deluxe Room to Executive Suite). The transition uses a 3D depth-fade where the furniture of the current room dissolves while the new layout materializes.2. Advanced Technical RefactoringTo handle detailed indoor environments without introducing immense lag or long loading screens, implement these optimization practices.3D Asset Strategy: GLTF SplittingDo not load the entire hotel as a single, massive 3D model.Split your assets into separate GLTF files: exterior.glb, lobby.glb, and rooms.glb.Use the React Three Fiber <Suspense> boundary paired with pre-fetching. While the user is exploring the exterior Hero section, trigger a background download of the lobby.glb mesh.The Illusion of Depth: Camera Panning & LayeringTrue interior 3D modeling can be performance-heavy on mobile web browsers. To maintain a premium 60fps feel:Mix 3D and high-resolution 2D assets. Use high-fidelity, pre-rendered 360-degree equirectangular projection maps mapped onto the inside of a Three.js cylinder or sphere.When the user scrolls, use GSAP to subtly pan the camera’s Field of View (FOV) and rotate the cylinder. This creates a realistic parallax effect that mimics moving your head through a physical room.

3. UI/UX Data Overlay MatrixThe booking UI must morph dynamically based on the current camera position to ensure the context matches the visuals.Journey StagePrimary UI ElementMicro-Interaction1. Hotel ExteriorSticky Booking Bar (Dates, Guests, Check Availability)Minimizes into a thin header bar upon scroll initiation.2. The LobbyExperience Cards (Spa, Fine Dining, Concierge Services)Interactive hot-spots fade into the 3D space over key amenities.3. Room ShowcaseLive Dynamic Pricing + "Book This Suite" CTA ButtonSlide-in panel with room square footage, bed type, and amenities.

4. footer
- Powered asuraTECH Solutions

****Login/Register Page

****Booking page
- Booking page can be accessed with requiring the user to be logged-in.
- User can browse rooms 