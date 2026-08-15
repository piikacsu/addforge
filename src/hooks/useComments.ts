import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'adforge_comments_v6';
const VISITS_KEY = 'adforge_visits';

export type ReactionType = '👍' | '👎' | '😂' | '🔥';

export interface CommentEntry {
  id: string;
  websiteId: string;
  text: string;
  author: string;
  rating: number;
  reactions: Record<ReactionType, number>;
  userReactions?: Record<string, ReactionType>;
  createdAt: string;
}

interface CommentsData {
  comments: Record<string, CommentEntry[]>;
}

const SEED_COMMENTS: CommentsData = {
  comments: {
    // Piikacsu's Games (9 comments)
    'piikacsu-games': [
      { id: 'seed-pg-1', websiteId: 'piikacsu-games', author: 'GamerPro99', text: 'This gaming portal is amazing! The dark UI with cyan glow looks so cool. The authentication screen feels like entering a secret base.', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-10T14:30:00Z' },
      { id: 'seed-pg-2', websiteId: 'piikacsu-games', author: 'NightOwl', text: 'Love the futuristic design! Piikacsu has some really fun games here. The Operative Name / Access Key concept is creative.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 1, '🔥': 1 }, createdAt: '2026-06-11T09:15:00Z' },
      { id: 'seed-pg-3', websiteId: 'piikacsu-games', author: 'RetroFan88', text: 'The games on Piikacsu are so addictive! I spent 3 hours playing last night. The neon aesthetic really sets the mood.', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 3 }, createdAt: '2026-06-08T20:45:00Z' },
      { id: 'seed-pg-4', websiteId: 'piikacsu-games', author: 'PixelMaster', text: 'Best gaming website I have found this year. The dark theme is easy on the eyes and the game selection is incredible.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-12T03:20:00Z' },
      { id: 'seed-pg-5', websiteId: 'piikacsu-games', author: 'NeonDreamer', text: 'The login screen alone is worth visiting. That cyan glow effect is pure cyberpunk vibes. Highly recommend!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-07T16:10:00Z' },
      { id: 'seed-pg-6', websiteId: 'piikacsu-games', author: 'SpeedRunner42', text: 'Played all the games in one weekend. Some are really challenging! The leaderboard system keeps me coming back.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 1, '🔥': 1 }, createdAt: '2026-06-13T01:30:00Z' },
      { id: 'seed-pg-7', websiteId: 'piikacsu-games', author: 'CasualGamer7', text: 'Perfect for casual gaming sessions. The variety of games means there is always something new to try. Love it!', rating: 4, reactions: { '👍': 1, '👎': 0, '😂': 0, '🔥': 0 }, createdAt: '2026-06-09T11:00:00Z' },
      { id: 'seed-pg-8', websiteId: 'piikacsu-games', author: 'DevSkeptic', text: 'Was skeptical at first but the quality of these browser games surprised me. Smooth performance and great art style.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-06T19:45:00Z' },
      { id: 'seed-pg-9', websiteId: 'piikacsu-games', author: 'MidnightPlayer', text: 'I play here every night before bed. The dark UI is perfect for late night gaming sessions. Five stars!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-13T07:15:00Z' },
    ],
    // Mc Locate (9 comments)
    'mc-locate': [
      { id: 'seed-ml-1', websiteId: 'mc-locate', author: 'TravelerX', text: 'Mc Locate is so useful when traveling! Found McDonald\'s in Tokyo within seconds. The city skyline background is beautiful too.', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-09T18:45:00Z' },
      { id: 'seed-ml-2', websiteId: 'mc-locate', author: 'FoodieLife', text: 'Great app for finding fast food anywhere in the world. The search is fast and the results are accurate. Love it!', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-12T11:20:00Z' },
      { id: 'seed-ml-3', websiteId: 'mc-locate', author: 'Wanderlust', text: 'The "Find Every McDonald\'s, Anywhere" tagline is perfect. Used this in Paris and London - worked flawlessly!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-11T22:10:00Z' },
      { id: 'seed-ml-4', websiteId: 'mc-locate', author: 'RoadTripKing', text: 'Used Mc Locate on a cross-country road trip in the US. Never missed a McDonald\'s stop! Saved us so much time.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 1, '🔥': 1 }, createdAt: '2026-06-10T15:30:00Z' },
      { id: 'seed-ml-5', websiteId: 'mc-locate', author: 'CityExplorer', text: 'The interface is so clean and modern. Type any city and boom - all McDonald\'s locations with directions. Brilliant!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-08T09:45:00Z' },
      { id: 'seed-ml-6', websiteId: 'mc-locate', author: 'BurgerHunter', text: 'As a McDonald\'s enthusiast, this is my go-to tool. Found locations in Berlin, Rome, and even small towns in Spain!', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-07T14:20:00Z' },
      { id: 'seed-ml-7', websiteId: 'mc-locate', author: 'DigitalNomad', text: 'Working remotely means I travel a lot. Mc Locate helps me find the closest McDonald\'s for wifi and coffee in any city!', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 1, '🔥': 0 }, createdAt: '2026-06-11T06:00:00Z' },
      { id: 'seed-ml-8', websiteId: 'mc-locate', author: 'VacationFamily', text: 'Our family used this on vacation in Orlando. Found 12 McDonald\'s nearby! The kids were happy every single day.', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 1, '🔥': 2 }, createdAt: '2026-06-12T21:30:00Z' },
      { id: 'seed-ml-9', websiteId: 'mc-locate', author: 'StudentLife', text: 'Late night study sessions = McDonald\'s runs. This app finds the 24-hour locations perfectly. A lifesaver for students!', rating: 4, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-06T23:45:00Z' },
    ],
    // Piikacsu AI (9 comments)
    'piikacsu-ai': [
      { id: 'seed-pa-1', websiteId: 'piikacsu-ai', author: 'TechEnthusiast', text: 'Piikacsu AI has a really sleek interface. The dark blue gradient with the yellow login button looks stunning. AI responses are quick!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-10T08:00:00Z' },
      { id: 'seed-pa-2', websiteId: 'piikacsu-ai', author: 'AIExplorer', text: 'The "Continue as Guest" option is convenient. The chat interface is clean and the AI actually gives helpful responses. 5 stars!', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 3 }, createdAt: '2026-06-12T16:30:00Z' },
      { id: 'seed-pa-3', websiteId: 'piikacsu-ai', author: 'DesignLover', text: 'Beautiful dark theme! The Piikacsu branding with the planet logo is really well done. Best AI chat UI I\'ve seen.', rating: 5, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-11T13:45:00Z' },
      { id: 'seed-pa-4', websiteId: 'piikacsu-ai', author: 'CodeWizard', text: 'I use Piikacsu AI for coding help. It debugs my JavaScript faster than Stack Overflow. The responses are super accurate!', rating: 4, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-09T10:15:00Z' },
      { id: 'seed-pa-5', websiteId: 'piikacsu-ai', author: 'CreativeWriter', text: 'This AI helped me brainstorm ideas for my novel. The conversations feel natural and the suggestions are genuinely creative.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 1, '🔥': 1 }, createdAt: '2026-06-08T17:30:00Z' },
      { id: 'seed-pa-6', websiteId: 'piikacsu-ai', author: 'StudentHelper', text: 'Piikacsu AI explained calculus concepts better than my professor! The step-by-step breakdowns are incredibly helpful.', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-10T12:00:00Z' },
      { id: 'seed-pa-7', websiteId: 'piikacsu-ai', author: 'NightCoder', text: 'The dark blue theme is perfect for late-night coding sessions. The AI keeps up with complex technical questions too. Love it!', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-07T02:45:00Z' },
      { id: 'seed-pa-8', websiteId: 'piikacsu-ai', author: 'CuriousMind', text: 'I ask Piikacsu AI random questions all day and it never disappoints. From history to science, it knows everything!', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 1, '🔥': 0 }, createdAt: '2026-06-11T18:20:00Z' },
      { id: 'seed-pa-9', websiteId: 'piikacsu-ai', author: 'TechReviewer', text: 'Compared to other AI chatbots, Piikacsu stands out with its beautiful design and fast responses. The guest login is a nice touch.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-13T04:00:00Z' },
    ],
    // ABENERP (9 comments)
    'abenerp': [
      { id: 'seed-ab-1', websiteId: 'abenerp', author: 'EngineerPro', text: 'ABENERP made getting custom parts so easy. Uploaded my CAD file, got a quote in minutes, and the parts arrived exactly as specified.', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-13T08:30:00Z' },
      { id: 'seed-ab-2', websiteId: 'abenerp', author: 'MakerSpaceFan', text: 'The website looks stunning with that city skyline and rain effect. The orange ABENERP branding really pops against the moody background.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-12T14:15:00Z' },
      { id: 'seed-ab-3', websiteId: 'abenerp', author: 'CADDesigner', text: 'As a mechanical designer, I need reliable manufacturing partners. ABENERP delivers quality parts from my CAD files every single time.', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-11T19:45:00Z' },
      { id: 'seed-ab-4', websiteId: 'abenerp', author: 'StartupFounder', text: 'We use ABENERP for our prototype runs. The on-demand model saves us tons compared to traditional manufacturing. Highly recommended!', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-10T11:00:00Z' },
      { id: 'seed-ab-5', websiteId: 'abenerp', author: 'IndustrialArt', text: 'The "Your CAD. Your part. Made." tagline says it all. Simple process, professional results. The water reflection on the site is beautiful too.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 1, '🔥': 1 }, createdAt: '2026-06-09T16:20:00Z' },
      { id: 'seed-ab-6', websiteId: 'abenerp', author: '3DPrintFan', text: 'Switched from 3D printing to ABENERP for metal parts. The quality is incredible and the turnaround time is faster than I expected.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-08T09:10:00Z' },
      { id: 'seed-ab-7', websiteId: 'abenerp', author: 'ProductDev', text: 'Our product development team uses ABENERP for all our custom component needs. The quote system is transparent and pricing is fair.', rating: 4, reactions: { '👍': 1, '👎': 0, '😂': 0, '🔥': 0 }, createdAt: '2026-06-07T22:30:00Z' },
      { id: 'seed-ab-8', websiteId: 'abenerp', author: 'AestheticLover', text: 'Honestly, I visited the site just because it looked beautiful. But the service is actually top-notch! Best manufacturing site I have used.', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-06T13:40:00Z' },
      { id: 'seed-ab-9', websiteId: 'abenerp', author: 'RoboticsClub', text: 'Our university robotics club gets all our custom brackets and parts from ABENERP. Great prices for students and excellent quality!', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-05T17:00:00Z' },
    ],
    // Emoji Kitchen Mixer (9 comments)
    'emoji-kitchen': [
      { id: 'seed-ek-1', websiteId: 'emoji-kitchen', author: 'EmojiLover', text: 'This emoji mixer is SO FUN! I spent an hour mixing random emojis and got some hilarious combinations. The Random Mix button is genius!', rating: 5, reactions: { '👍': 5, '👎': 0, '😂': 3, '🔥': 2 }, createdAt: '2026-06-13T10:00:00Z' },
      { id: 'seed-ek-2', websiteId: 'emoji-kitchen', author: 'DesignerDaily', text: 'Love the clean white design of Emoji Alchemy Studio. It is simple, intuitive, and the emoji mixing is surprisingly addictive. Great work!', rating: 4, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-13T11:30:00Z' },
      { id: 'seed-ek-3', websiteId: 'emoji-kitchen', author: 'SocialMediaStar', text: 'I use the emoji combinations I create here for my Instagram stories. My followers always ask where I get those unique emoji blends!', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 1, '🔥': 2 }, createdAt: '2026-06-12T15:00:00Z' },
      { id: 'seed-ek-4', websiteId: 'emoji-kitchen', author: 'CasualBrowser', text: 'Who knew mixing two emojis could create something completely new? The concept is so creative. Endless entertainment for free!', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 1, '🔥': 0 }, createdAt: '2026-06-12T08:45:00Z' },
      { id: 'seed-ek-5', websiteId: 'emoji-kitchen', author: 'CreativeSoul', text: 'The Emoji Alchemy Studio is a perfect example of a simple idea executed brilliantly. Mix, create, share - it just works!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-11T20:15:00Z' },
      { id: 'seed-ek-6', websiteId: 'emoji-kitchen', author: 'TeenVibes', text: 'Me and my friends have a competition to see who can create the weirdest emoji combination. This site is our favorite time killer!', rating: 4, reactions: { '👍': 3, '👎': 0, '😂': 2, '🔥': 1 }, createdAt: '2026-06-11T14:30:00Z' },
      { id: 'seed-ek-7', websiteId: 'emoji-kitchen', author: 'AppReviewer', text: 'Beautiful minimal UI, fast loading, and a genuinely fun concept. The emoji picker is smooth and the mix results load instantly. 5/5!', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-10T09:00:00Z' },
      { id: 'seed-ek-8', websiteId: 'emoji-kitchen', author: 'MemeCreator', text: 'The emoji combinations I find here are gold for making memes. Some of the mixes are absolutely cursed in the best way possible!', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 3, '🔥': 1 }, createdAt: '2026-06-10T22:45:00Z' },
      { id: 'seed-ek-9', websiteId: 'emoji-kitchen', author: 'DevFan', text: 'As a developer I appreciate how clean and well-built this is. The transitions are smooth and the UX is top tier. Love it!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-09T16:20:00Z' },
    ],
    // Black Hole Explorer (9 comments) - 5 star rated
    'hskaozbhw4liw': [
      { id: 'seed-nt-1', websiteId: 'hskaozbhw4liw', author: 'TechVisionary', text: 'Black Hole Explorer is absolutely incredible! The 3D visualization of black holes is mind-blowing and the interactive features are top-notch. A must-visit for any space enthusiast!', rating: 5, reactions: { '👍': 5, '👎': 0, '😂': 0, '🔥': 3 }, createdAt: '2026-06-14T08:00:00Z' },
      { id: 'seed-nt-2', websiteId: 'hskaozbhw4liw', author: 'AstroFanatic', text: 'The black hole simulations on this site are some of the best I have ever seen. The interface is sleek, the science is accurate, and the educational value is a game changer.', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-14T10:30:00Z' },
      { id: 'seed-nt-3', websiteId: 'hskaozbhw4liw', author: 'ScienceTeacher', text: 'I use Black Hole Explorer in my classroom and my students are amazed every time. The interactive tools make learning about space so engaging. Five stars without hesitation!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-13T16:45:00Z' },
      { id: 'seed-nt-4', websiteId: 'hskaozbhw4liw', author: 'SpaceLover', text: 'The purple and blue gradient design is gorgeous! It perfectly matches the cosmic vibe of exploring black holes. The 3D visualization section is incredibly well-designed.', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-13T12:00:00Z' },
      { id: 'seed-nt-5', websiteId: 'hskaozbhw4liw', author: 'CosmosDaily', text: 'I have been exploring Black Hole Explorer for hours. The interactive simulations are stunning and accurate. Highly recommended for anyone fascinated by the universe!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-12T20:15:00Z' },
      { id: 'seed-nt-6', websiteId: 'hskaozbhw4liw', author: 'PhysicsStudent', text: 'The educational content on Black Hole Explorer is impressive. I was able to understand complex astrophysics concepts in minutes. Truly next-gen science education!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-06-12T09:30:00Z' },
      { id: 'seed-nt-7', websiteId: 'hskaozbhw4liw', author: 'UXDesigner', text: 'From a design perspective, Black Hole Explorer is flawless. The glassmorphism cards, the particle effects, the typography — everything comes together perfectly. Beautiful and functional.', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 3 }, createdAt: '2026-06-11T18:00:00Z' },
      { id: 'seed-nt-8', websiteId: 'hskaozbhw4liw', author: 'AstronomerPro', text: 'The scientific accuracy of the black hole models is remarkable. Black Hole Explorer makes complex astronomy accessible to everyone. The future of science education is here.', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-06-11T11:45:00Z' },
      { id: 'seed-nt-9', websiteId: 'hskaozbhw4liw', author: 'InnovationLead', text: 'Our entire team is obsessed with Black Hole Explorer. The combination of stunning visuals and real science in one platform is exactly what the industry needed.', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 3 }, createdAt: '2026-06-10T14:20:00Z' },
    ],
    // Flappy 3D (9 comments)
    'flappy-3d': [
      { id: 'seed-f3d-1', websiteId: 'flappy-3d', author: 'BirdWatcher', text: 'This 3D bird game is stunning! The low-poly art style with golden lighting is beautiful. Super addictive gameplay that keeps me coming back for more!', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 3 }, createdAt: '2026-07-16T10:00:00Z' },
      { id: 'seed-f3d-2', websiteId: 'flappy-3d', author: 'SkyDancer', text: 'Cannot stop playing Flappy 3D! The cinematic atmosphere makes it feel like a premium console game. Love the smooth flight mechanics and responsive controls.', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-15T14:30:00Z' },
      { id: 'seed-f3d-3', websiteId: 'flappy-3d', author: 'GameDev12', text: 'The visuals in this game are incredible. Soaring through clouds with that golden sunset backdrop is pure eye candy. Best browser game experience this year!', rating: 4, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-14T09:15:00Z' },
      { id: 'seed-f3d-4', websiteId: 'flappy-3d', author: 'CasualFlyer', text: 'The 3D perspective adds so much depth to the classic flappy concept. My high score is 42 and I am determined to beat it. So addictive!', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 1, '🔥': 1 }, createdAt: '2026-07-13T16:45:00Z' },
      { id: 'seed-f3d-5', websiteId: 'flappy-3d', author: 'ParentGamer', text: 'My kids love Flappy 3D! The colorful bird design and floating islands are adorable. Great for all ages and the controls are simple enough for little ones.', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-07-12T11:00:00Z' },
      { id: 'seed-f3d-6', websiteId: 'flappy-3d', author: 'SoundScaper', text: 'The music and sound design match the visuals perfectly. Very relaxing yet challenging gameplay loop. The wind sound effects are so immersive!', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-07-11T20:30:00Z' },
      { id: 'seed-f3d-7', websiteId: 'flappy-3d', author: 'IndieReviewer', text: 'Flappy 3D proves browser games can look AAA-quality. The depth of field and lighting effects are impressive. A shining example of modern web game development.', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-10T13:45:00Z' },
      { id: 'seed-f3d-8', websiteId: 'flappy-3d', author: 'LunchBreakPro', text: 'Spent my entire lunch break playing this. Just one more try... classic addicting gameplay with gorgeous presentation. Perfect for short gaming sessions.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 1, '🔥': 1 }, createdAt: '2026-07-09T08:00:00Z' },
      { id: 'seed-f3d-9', websiteId: 'flappy-3d', author: 'PixelPilot', text: 'The controls are buttery smooth and the 3D camera work is fantastic. A must-play for casual gamers who appreciate beautiful game design!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-08T17:20:00Z' },
    ],
    // OLYMPUS (9 comments)
    'olympus': [
      { id: 'seed-ol-1', websiteId: 'olympus', author: 'MythHunter', text: 'OLYMPUS is a breathtaking journey into Greek mythology. The columns and lightning effects are incredibly atmospheric. Felt like I was standing on Mount Olympus itself!', rating: 5, reactions: { '👍': 5, '👎': 0, '😂': 0, '🔥': 3 }, createdAt: '2026-07-16T11:00:00Z' },
      { id: 'seed-ol-2', websiteId: 'olympus', author: 'HistoryBuff99', text: 'The presentation of the gods and myths is so well done. The dark stormy aesthetic with golden accents is absolutely perfect for the subject matter.', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-15T15:30:00Z' },
      { id: 'seed-ol-3', websiteId: 'olympus', author: 'ClassicsProf', text: 'Learned so much about Greek mythology from OLYMPUS. Beautifully designed and very educational. Will definitely use this in my lectures next semester!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-14T10:15:00Z' },
      { id: 'seed-ol-4', websiteId: 'olympus', author: 'CinemaFan', text: 'The Mount Olympus backdrop with lightning is pure cinematic gold. Whoever designed this has an eye for epic visuals. Every scroll reveals something new.', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 3 }, createdAt: '2026-07-13T18:45:00Z' },
      { id: 'seed-ol-5', websiteId: 'olympus', author: 'PantheonExplorer', text: 'As a mythology enthusiast, OLYMPUS exceeded my expectations. The attention to detail in the artwork and storytelling is remarkable. Truly immersive!', rating: 4, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-07-12T09:00:00Z' },
      { id: 'seed-ol-6', websiteId: 'olympus', author: 'ArtStudent', text: 'The interactive elements exploring the pantheon are fantastic. Makes learning about ancient Greece so engaging. The typography choices are chef is kiss.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 1, '🔥': 1 }, createdAt: '2026-07-11T14:20:00Z' },
      { id: 'seed-ol-7', websiteId: 'olympus', author: 'TypeNerd', text: 'The typography and laurel wreath designs give OLYMPUS such an authentic ancient Greek feel. Super immersive and the color palette is divine.', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-10T16:30:00Z' },
      { id: 'seed-ol-8', websiteId: 'olympus', author: 'EduCreator', text: 'I have shared OLYMPUS with all my history students. The combination of education and stunning visuals is unbeatable. Learning has never looked this good.', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-09T12:00:00Z' },
      { id: 'seed-ol-9', websiteId: 'olympus', author: 'ZeusFanboy', text: 'From Zeus to Hades, every deity section is thoughtfully crafted. A masterpiece of mythological web design. The golden accents against dark stone are epic!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 3 }, createdAt: '2026-07-08T20:00:00Z' },
    ],
    // NIGHTLINES (9 comments)
    'nightlines': [
      { id: 'seed-nl-1', websiteId: 'nightlines', author: 'TrainWhisperer', text: 'NIGHTLINES captured the romance of sleeper trains perfectly. The atmospheric night scenes and warm window lights are beautiful. Makes me want to travel tonight!', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 3 }, createdAt: '2026-07-16T09:00:00Z' },
      { id: 'seed-nl-2', websiteId: 'nightlines', author: 'RailRomancer', text: 'As someone who loves train travel, this atlas is a dream come true. The route details and berth information are so useful for planning real trips!', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-15T14:00:00Z' },
      { id: 'seed-nl-3', websiteId: 'nightlines', author: 'NightOwlTravel', text: 'The moody blue aesthetic of NIGHTLINES is incredibly atmospheric. The combination of practical timetables and dreamy visuals makes this truly unique.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-07-14T11:30:00Z' },
      { id: 'seed-nl-4', websiteId: 'nightlines', author: 'BackpackerSam', text: 'Discovered so many night train routes I never knew existed. This atlas is both beautiful and practical. My new favorite travel resource!', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-13T19:00:00Z' },
      { id: 'seed-nl-5', websiteId: 'nightlines', author: 'InsomniaWriter', text: 'The field notes and timetables are so well presented. The whole site feels like a beautiful travel journal. Perfect late-night browsing material.', rating: 4, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-07-12T22:00:00Z' },
      { id: 'seed-nl-6', websiteId: 'nightlines', author: 'WanderlustSoul', text: 'NIGHTLINES has that perfect nostalgic, wanderlust-inducing quality. The starry sky and mountain passes in the artwork are absolutely gorgeous.', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-11T16:00:00Z' },
      { id: 'seed-nl-7', websiteId: 'nightlines', author: 'EuroTripper', text: 'Used this to plan my trip from Paris to Venice by sleeper. The information was spot-on and the presentation was stunning. Highly recommended!', rating: 5, reactions: { '👍': 4, '👎': 0, '😂': 0, '🔥': 2 }, createdAt: '2026-07-10T10:00:00Z' },
      { id: 'seed-nl-8', websiteId: 'nightlines', author: 'PhotoJunkie', text: 'The cinematic photography style makes every route look magical. NIGHTLINES is digital art as much as it is a travel tool. Truly inspiring work.', rating: 5, reactions: { '👍': 3, '👎': 0, '😂': 0, '🔥': 3 }, createdAt: '2026-07-09T18:30:00Z' },
      { id: 'seed-nl-9', websiteId: 'nightlines', author: 'SlowTraveler', text: 'There is something deeply romantic about night trains that NIGHTLINES captures perfectly. The practical info mixed with poetic presentation is brilliant.', rating: 4, reactions: { '👍': 2, '👎': 0, '😂': 0, '🔥': 1 }, createdAt: '2026-07-08T21:00:00Z' },
    ],
  },
};

function getCommentsData(): CommentsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // First visit: seed with default comments
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_COMMENTS));
  return SEED_COMMENTS;
}

function saveCommentsData(data: CommentsData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getVisits(): Record<string, number> {
  try {
    const raw = localStorage.getItem(VISITS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

export function recordVisit(websiteId: string) {
  try {
    const visits = getVisits();
    visits[websiteId] = (visits[websiteId] || 0) + 1;
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  } catch { /* ignore */ }
}

export function hasVisited(websiteId: string): boolean {
  return (getVisits()[websiteId] || 0) > 0;
}

export function useComments() {
  const [data, setData] = useState<CommentsData>(getCommentsData);

  useEffect(() => {
    setData(getCommentsData());
  }, []);

  const comments = Object.values(data.comments).flat();

  const getCommentsForWebsite = useCallback((websiteId: string): CommentEntry[] => {
    return data.comments[websiteId] || [];
  }, [data]);

  const getCommentCount = useCallback((websiteId: string): number => {
    return (data.comments[websiteId] || []).length;
  }, [data]);

  const addComment = useCallback((websiteId: string, text: string, author: string, rating: number = 0) => {
    const newComment: CommentEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      websiteId,
      text,
      author,
      rating,
      reactions: { '👍': 0, '👎': 0, '😂': 0, '🔥': 0 },
      userReactions: {},
      createdAt: new Date().toISOString(),
    };
    setData(prev => {
      const updated = {
        comments: {
          ...prev.comments,
          [websiteId]: [...(prev.comments[websiteId] || []), newComment],
        },
      };
      saveCommentsData(updated);
      return updated;
    });
  }, []);

  const toggleReaction = useCallback((websiteId: string, commentId: string, userId: string, reaction: ReactionType) => {
    setData(prev => {
      const websiteComments = [...(prev.comments[websiteId] || [])];
      const idx = websiteComments.findIndex(c => c.id === commentId);
      if (idx === -1) return prev;

      const comment = { ...websiteComments[idx] };
      const userReactions = { ...comment.userReactions };
      const reactions = { ...comment.reactions };

      // If user already has this reaction, remove it
      if (userReactions[userId] === reaction) {
        reactions[reaction] = Math.max(0, (reactions[reaction] || 0) - 1);
        delete userReactions[userId];
      } else {
        // Remove old reaction if exists
        const oldReaction = userReactions[userId];
        if (oldReaction) {
          reactions[oldReaction] = Math.max(0, (reactions[oldReaction] || 0) - 1);
        }
        reactions[reaction] = (reactions[reaction] || 0) + 1;
        userReactions[userId] = reaction;
      }

      comment.reactions = reactions;
      comment.userReactions = userReactions;
      websiteComments[idx] = comment;

      const updated = {
        comments: { ...prev.comments, [websiteId]: websiteComments },
      };
      saveCommentsData(updated);
      return updated;
    });
  }, []);

  const getAverageRating = useCallback((websiteId: string): number => {
    const list = data.comments[websiteId] || [];
    const rated = list.filter(c => c.rating > 0);
    if (rated.length === 0) return 0;
    return Math.round((rated.reduce((sum, c) => sum + c.rating, 0) / rated.length) * 10) / 10;
  }, [data]);

  const getTopCommenters = useCallback((): { author: string; count: number }[] => {
    const authorCounts: Record<string, number> = {};
    for (const comment of comments) {
      authorCounts[comment.author] = (authorCounts[comment.author] || 0) + 1;
    }
    return Object.entries(authorCounts)
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [comments]);

  const getRecentActivity = useCallback((): CommentEntry[] => {
    return [...comments]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);
  }, [comments]);

  const getTotalComments = useCallback((): number => {
    return comments.length;
  }, [comments]);

  const getReactionCounts = useCallback((websiteId: string, commentId: string): Record<ReactionType, number> => {
    const list = data.comments[websiteId] || [];
    const comment = list.find(c => c.id === commentId);
    return comment?.reactions || { '👍': 0, '👎': 0, '😂': 0, '🔥': 0 };
  }, [data]);

  const getUserReaction = useCallback((websiteId: string, commentId: string, userId: string): ReactionType | null => {
    const list = data.comments[websiteId] || [];
    const comment = list.find(c => c.id === commentId);
    return comment?.userReactions?.[userId] || null;
  }, [data]);

  return {
    comments,
    getCommentsForWebsite,
    getCommentCount,
    addComment,
    toggleReaction,
    getAverageRating,
    getTopCommenters,
    getRecentActivity,
    getTotalComments,
    getReactionCounts,
    getUserReaction,
  };
}

export function getAllComments(): CommentsData {
  return getCommentsData();
}
