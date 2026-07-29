const fs = require('fs');
const path = './src/i18n/locales/soundbuttons/en.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

Object.assign(data, {
  "article.title": "{siteName}: Play, Download and Share the Best Sound Buttons Online",
  "article.toc.title": "Table of Contents",
  "article.toc.intro": "Introduction",
  "article.toc.what_are_sound_buttons": "What are Sound Buttons?",
  "article.toc.what_is_meme_soundboard": "What Is a Meme Soundboard?",
  "article.toc.who_uses": "Who Uses Sound Buttons?",
  "article.toc.ultimate_collection": "The Ultimate Meme Soundboard Collection",
  "article.toc.why_ours_stands_out": "Why Our Meme Soundboard Stands Out",
  "article.toc.unblocked": "What Is Meme Soundboard Unblocked?",
  "article.toc.most_popular": "Most Popular Meme Sound Buttons",
  "article.toc.explore_categories": "Explore All Soundboard Categories",
  "article.toc.why_best": "Why {siteName} Is the Best",
  "article.toc.faq": "Frequently Asked Questions",
  
  "article.intro.title": "Introduction",
  "article.intro.p1": "Welcome to {siteNameCompact}, your one-stop shop for sound buttons, meme sounds, and soundboards that actually work without any hassle. Whether you're here to prank a friend, spice up a stream, or just click random sounds because it's fun, you're in the right place. No sign-ups, no annoying pop-ups, just sounds ready to play in one click.",
  "article.intro.p2": "We built this site to be fast, simple, and packed with the sounds people actually search for. So let's get into what sound buttons are all about, and why so many people keep coming back to click, laugh, and share.",
  
  "article.what_are_sound_buttons.title": "What are Sound Buttons?",
  "article.what_are_sound_buttons.p1": "Sound buttons are exactly what they sound like. Small clickable buttons that play a short audio clip the moment you tap them. Could be a funny line from a show, a viral meme sound, an old school game effect, or just a weird noise that somehow became internet famous.",
  "article.what_are_sound_buttons.p2": "The idea is simple. You click, it plays, you laugh or send it to a friend. That's the whole magic behind it. No downloads needed unless you want to keep the sound for later, and even that only takes one more click.",
  
  "article.what_is_meme_soundboard.title": "What Is a Meme Soundboard?",
  "article.what_is_meme_soundboard.p1": "A meme soundboard is basically a themed collection of sound buttons built around internet memes and viral moments. Think of clips from trending videos, funny reactions, or sounds that blew up on social media overnight.",
  "article.what_is_meme_soundboard.p2": "Our meme soundboard collects all these trending sounds in one place so you don't have to dig through random videos trying to find that one sound everyone's using. It's organized, easy to browse, and updated often with whatever's currently making the rounds online.",
  
  "article.who_uses.title": "Who Uses Sound Buttons?",
  "article.who_uses.p1": "Honestly, a lot more people than you'd think. Streamers use them to react live on camera. Content creators drop them into videos for extra comedic timing. Friend groups use them in voice chats just to mess with each other. Even teachers have been known to sneak in a funny sound button to lighten up a boring class.",
  "article.who_uses.p2": "And then there's the casual crowd. People who just enjoy clicking through sounds because it's oddly satisfying. If you've ever found yourself clicking one sound after another with no real plan, you already know exactly what we mean.",
  
  "article.ultimate_collection.title": "The Ultimate Meme Soundboard Collection",
  "article.ultimate_collection.p1": "We've put together what we think is one of the biggest and most useful meme soundboard collections around. Clips from viral videos, classic internet jokes, trending audio, all sorted so you're not scrolling forever trying to find something good.",
  "article.ultimate_collection.p2": "New meme sounds get added regularly too, so if you're someone who likes staying on top of whatever's trending, check the meme soundboard section often. Chances are, whatever sound just went viral is already sitting there waiting for you.",
  
  "article.why_ours_stands_out.title": "Why Our Meme Soundboard Stands Out",
  "article.why_ours_stands_out.p1": "There's a lot of soundboard sites out there, not gonna lie. But here's the thing, most of them are cluttered with ads, slow loading pages, or sounds that are outdated by months.",
  "article.why_ours_stands_out.p2": "Ours focuses on speed and simplicity. Clips load instantly, the layout is clean, and we keep things updated so you're not stuck listening to sounds that stopped being funny a year ago. Basically, we cut the noise and keep the actual sounds.",
  
  "article.unblocked.title": "What Is Meme Soundboard Unblocked?",
  "article.unblocked.p1": "A lot of people search for meme soundboard unblocked because they're trying to use sound buttons somewhere that usually blocks access to random websites, like school or work networks. Basically it means a soundboard site that still works even under restricted internet connections.",
  "article.unblocked.p2": "Good news, our site is lightweight and doesn't rely on heavy downloads or shady scripts, so it tends to work fine in most places where other sites get blocked. Just keep in mind that network restrictions vary depending on where you're browsing from.",
  
  "article.most_popular.title": "Most Popular Meme Sound Buttons",
  "article.most_popular.p1": "Some sounds just never get old. The ones that everyone recognizes the second they hear the first half second of it. Those tend to be our most clicked buttons, and honestly, that says a lot.",
  "article.most_popular.p2": "Popular meme sounds usually come from viral clips, funny movie lines, or reaction sounds that somehow became a whole internet moment. If you're not sure where to start, the meme soundboard is a solid first stop since it's basically a highlight reel of internet culture.",
  
  "article.explore_categories.title": "Explore All Soundboard Categories",
  "article.explore_categories.p1": "Memes are great, but they're not the only thing here. We've got categories covering everything from movie quotes to game sounds to random funny effects that don't fit anywhere else but somehow still get clicked constantly.",
  "article.explore_categories.p2": "Browsing by category makes it way easier to find exactly what you're looking for instead of scrolling endlessly. And if you're the type who likes checking what's new, our latest sounds page gets updated regularly with fresh uploads across every category.",
  
  "article.why_best.title": "Why {siteName} Is the Best for Sound Buttons",
  "article.why_best.p1": "Most \"sound buttons\" sites are a mess. They're slow loading, packed with paywalls, have broken players, and honestly half the buttons turn out to be ads in disguise. We built {siteName} because we got tired of dealing with that too. Here's what you actually get:",
  
  "article.why_best.l1_title": "Massive library of sound buttons:",
  "article.why_best.l1_desc": " You'll find viral meme clips, classic sound effects, TikTok audio, anime quotes, prank sounds and honestly a lot of weird stuff you didn't even know you needed.",
  "article.why_best.l2_title": "Instant playback:",
  "article.why_best.l2_desc": " Every sound is optimised for a sub-second response, so you press it, hear it, and react right away.",
  "article.why_best.l3_title": "Unblocked, everywhere:",
  "article.why_best.l3_desc": " It works on school WiFi, office networks and locked-down devices with no VPN and no proxy needed, just the site itself.",
  "article.why_best.l4_title": "Mobile-friendly:",
  "article.why_best.l4_desc": " The site is built for thumbs, taps and phones first, so it works smoothly no matter what device you're on.",
  "article.why_best.l5_title": "New sounds added daily:",
  "article.why_best.l5_desc": " If something just went viral, chances are it's already sitting on the site waiting for you.",
  
  "article.faq.title": "Frequently Asked Questions",
  "article.faq.q1": "Is {siteName} free to use?",
  "article.faq.a1": "Yes, completely free. No subscriptions, no hidden fees.",
  "article.faq.q2": "Is this a meme soundboard unblocked at school?",
  "article.faq.a2": "Yes. We don't use blocked embeds or flagged audio hosts, so {siteName} loads where most other soundboard sites fail.",
  "article.faq.q3": "Can I download the sounds?",
  "article.faq.a3": "Yes, most sound buttons have a simple download option right next to the play button.",
  "article.faq.q4": "How often are new sounds added?",
  "article.faq.a4": "Pretty often. Check the newest uploads page if you want to stay updated on fresh content.",
  "article.faq.q5": "What is a meme soundboard used for?",
  "article.faq.a5": "It's used to quickly find and play trending meme sounds, usually for streaming, content creation, or just messing around with friends."
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
