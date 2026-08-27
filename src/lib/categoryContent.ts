export const CATEGORY_DESCRIPTIONS: Record<string, string[]> = {
  'anime': [
    "This anime soundboard is packed with voice lines, battle cries, and reaction clips pulled straight from your favorite shows. From dramatic power up moments to iconic one liners, you'll find the sounds anime fans quote the most.",
    "These clips are popular because anime moments hit different when they get turned into sound bites. A single line from a fight scene or a funny character outburst can carry so much energy that people want to reuse it over and over, whether that's in a video edit, a stream, or just to make friends laugh who watch the same shows. A lot of these clips have gone on to become memes on their own, way outside the anime they came from.",
    "Just tap any button below to play the sound right away, or hit download if you want to save it and use it somewhere else.",
    "If anime clips are your thing, you might also like the reaction soundboard for more expressive moments, or check out the meme soundboard for clips that started as anime references and turned into something bigger online."
  ],
  'creativity': [
    "The creativity soundboard is a mix of musical clips, jingles, and quirky sound bites meant for people who like to build something with sound instead of just reacting with it. Think background stings, playful notes, and unusual audio you won't find in a typical meme collection.",
    "People come here when they're working on something, not just reacting to something. Content creators, video editors, and streamers use these clips to add a bit of flavor to their projects without needing to dig through a music library or worry about copyright strikes. It's also just a fun place to browse if you enjoy unusual little sounds.",
    "Hit play on any sound to preview it instantly, then download the one you want to drop into your own project.",
    "Pair these with clips from the sound effects soundboard if you're building something more complete, or check out our blog for tips on how creators are using soundboards in their content."
  ],
  'games': [
    "The games soundboard collects iconic sound effects and voice clips from popular video games, covering everything from classic jingles to funny in game moments that players know by heart.",
    "Gamers love these clips because gaming culture runs on inside jokes and shared moments. A specific sound effect or character line can instantly bring back a memory for anyone who has played the game, which makes these clips perfect for reacting during a match, dropping into a Discord call, or referencing in a gaming video. Some of these sounds are so well known they've become part of internet culture on their own.",
    "Tap any button to hear the clip instantly, or download it to use in your own gaming content.",
    "If you're into competitive or funny gaming moments, the reaction soundboard has more clips worth checking out, or browse the meme soundboard for crossover sounds that started in games and spread everywhere online."
  ],
  'meme': [
    "The meme soundboard is home to the internet's most recognizable sound bites, the kind of clips that show up in comment sections, video edits, and group chats without any explanation needed.",
    "These sounds are popular because memes move fast, and having the right sound ready to go makes a reaction, a joke, or an edit land instantly. A well timed meme sound can say more than a sentence ever could. This category gets updated constantly since new sounds go viral all the time, so there's always something fresh to find here.",
    "Just click a button to play the sound instantly, or download it to use in your own videos, streams, or chats.",
    "Check out the trending page to see what's blowing up right now, or browse the reaction soundboard if you want more clips built for quick reactions."
  ],
  'movies': [
    "The movies soundboard brings together famous lines, dramatic moments, and funny quotes pulled straight from film, the kind of clips that people quote long after the movie itself is over.",
    "Movie lines stick with people because a great scene often comes down to one perfect line delivered the right way. Once that line gets clipped and shared enough, it takes on a life of its own outside the movie, turning into something people drop into conversations, edits, and reactions for years. This category is great for anyone who loves quoting films or wants a clip that instantly sets a mood.",
    "Tap play to hear any clip right away, or download it if you want to use it somewhere else.",
    "If you like quotable moments, the reaction soundboard has more options for expressive clips, or check the TikTok soundboard for movie lines that have gone viral online."
  ],
  'politics': [
    "The politics soundboard features sound clips tied to public figures, speeches, and moments from the news that have made their way into internet culture and everyday conversation.",
    "These clips get used a lot because political moments often get turned into jokes, reactions, or commentary once they hit social media. A single quote or moment can end up repeated across memes and videos for months. This category is meant for entertainment and commentary purposes, giving people a way to reference these moments quickly without searching through news clips.",
    "Click any button to play the sound instantly, or download it if you'd like to use it elsewhere.",
    "For more reaction style content, check out the reaction soundboard, or browse our blog for context behind some of the more talked about sound clips on the site."
  ],
  'prank': [
    "The prank soundboard is built for classic gag sounds and funny audio clips designed to catch people off guard, from fake alarms to silly effects perfect for messing with friends.",
    "Pranks have been a part of internet culture forever, and sound is one of the easiest ways to pull one off. Whether you're setting up a joke in person, playing something unexpected during a call, or just looking for a laugh, these clips are made for exactly that. It's a category people come back to often since a good prank sound never really gets old.",
    "Tap play to preview any sound, or download it so you can use it whenever the moment calls for it.",
    "Looking for more laughs? The meme soundboard has plenty of crossover options, or check the reaction soundboard for clips that work well alongside a good prank."
  ],
  'reaction': [
    "The reaction soundboard is stacked with clips made for exactly one purpose, giving you the perfect audio response to whatever just happened, whether that's shock, disappointment, excitement, or straight up confusion.",
    "These sounds are some of the most used on the whole site because reactions are universal. Everyone needs a quick way to respond to something wild without typing out a whole message, and a well placed sound clip does that instantly. This category works great during calls, streams, gaming sessions, or just texting friends throughout the day.",
    "Just hit play to hear any sound right away, or download it to keep it handy for later.",
    "Pair these with clips from the meme soundboard for even more reaction options, or check out the trending page to see which reaction sounds are popular right now."
  ],
  'sound effects': [
    "The sound effects soundboard is a straightforward collection of classic audio effects, covering things like alarms, dings, whooshes, and other everyday sounds that don't need any context to be useful.",
    "People use these clips constantly because sometimes you just need a plain sound effect, not a meme or a quote. These are the kind of sounds that fit into video editing, presentations, notifications, or just adding a bit of flavor to a conversation. It's a simple but genuinely useful category for anyone working on a project or just having fun.",
    "Tap play to preview any effect instantly, or download it to use it in your own work.",
    "If you're editing something bigger, check out the creativity soundboard for more production friendly clips, or browse the games soundboard for effects pulled from popular titles."
  ],
  'tiktok': [
    "The TikTok soundboard collects the audio clips behind the platform's biggest trends, from viral one liners to background sounds that ended up in thousands of videos.",
    "TikTok moves incredibly fast, and a sound can go from unknown to everywhere within days. This category exists so you can grab those exact clips without digging through the app, whether you want to use one in your own video or just relive a trend that made you laugh. New sounds get added here as soon as they start picking up traction.",
    "Click any button to play the sound instantly, or download it to use in your own content.",
    "Check the trending page to catch what's currently blowing up, or browse the meme soundboard for TikTok sounds that have crossed over into general meme culture."
  ]
};

export const CATEGORY_DESCRIPTIONS_BY_SITE: Record<string, Record<string, string[]>> = {
  soundbuttons: CATEGORY_DESCRIPTIONS,
  soundboard: CATEGORY_DESCRIPTIONS,
  soundbuttonsguys: CATEGORY_DESCRIPTIONS,
};

export function getCategoryDescriptionHTML(categoryName: string, fallbackDesc?: string, siteId?: string): string {
  const table = (siteId && CATEGORY_DESCRIPTIONS_BY_SITE[siteId]) || CATEGORY_DESCRIPTIONS;
  const key = categoryName.toLowerCase().trim();
  const paragraphs = table[key];
  
  if (paragraphs) {
    return paragraphs.map(p => `<p>${p}</p>`).join('\n');
  }
  
  if (fallbackDesc) {
    return `<p>${fallbackDesc}</p>`;
  }
  
  return `<p>Our ${categoryName} soundboard features a curated collection of high-quality audio clips. All sounds are free to download and unblocked for use anywhere.</p>`;
}

export function getCategoryFaqHTML(categoryName: string): string {
  return `
<h2>Frequently Asked Questions about ${categoryName} Sound Buttons</h2>

<h3>What are ${categoryName} sound buttons on SoundboardMax?</h3>
<p>${categoryName} sound buttons are short audio clips you can play right in your browser with a single tap, no app or download needed to listen. Every button in this ${categoryName} collection is picked to match the theme, so you always know what kind of sound you're getting before you press play.</p>

<h3>How do I download a ${categoryName} sound?</h3>
<p>Tap the ${categoryName} sound you want, then look for the download option on that page. The file saves straight to your device so you can use it later even without internet, or drop it into a video, edit, or project you're working on.</p>

<h3>Can I use ${categoryName} sounds in my videos or streams?</h3>
<p>Yes, for personal projects, memes, and casual content the ${categoryName} soundboard is exactly what these clips are made for. If you're planning something for a monetized channel or brand work, it's worth checking the notes on the individual ${categoryName} sound page first since usage rights can differ from clip to clip.</p>

<h3>Why is ${categoryName} its own category instead of being mixed with everything else?</h3>
<p>Grouping sounds by theme makes it way easier to find what you're looking for. Instead of scrolling through hundreds of unrelated clips, you can jump straight into the ${categoryName} soundboard and browse a page full of sounds that actually fit what you're after.</p>

<h3>Where do the sounds in the ${categoryName} soundboard come from?</h3>
<p>The ${categoryName} category is built from a mix of trending clips, community favorites, and sounds we've added based on what people are actually searching for and sharing. It's not a random dump, the goal is to keep the ${categoryName} page full of sounds people genuinely want to use.</p>

<h3>How often do new ${categoryName} sounds get added?</h3>
<p>We update the ${categoryName} soundboard regularly as new sounds trend or get requested. If a ${categoryName} clip is picking up attention elsewhere, there's a good chance it'll show up here soon, so it's worth checking back every so often if you want the newest stuff.</p>
`;
}
