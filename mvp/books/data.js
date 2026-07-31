/* Books I've Read — data + affiliate URL builder
   amazonUrl is NEVER hardcoded per book: it is always derived from `asin`
   via buildAmazonAffiliateUrl() at runtime. */

const AMAZON_TAG = "valesae-21";

function buildAmazonAffiliateUrl(asin) {
  if (!asin || typeof asin !== "string") return null;
  const clean = asin.trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(clean)) return null;
  return `https://www.amazon.ae/dp/${clean}/ref=nosim?tag=${AMAZON_TAG}`;
}

// Covers are self-hosted (sourced from Open Library, converted to WebP) rather than
// hot-linked: openlibrary.org routes through archive.org and regularly takes seconds
// per image, which made the grid load visibly slowly.
function coverUrl(asin) {
  return `/books/covers/${asin}.webp`;
}

const BOOKS = [
  { title: "The Lean Startup", author: "Eric Ries", asin: "0307887898", category: "Entrepreneurship", featured: true, displayOrder: 1, status: "read",
    shortReview: "I recommend this book because it taught me to treat every new idea as a hypothesis to test, not a plan to defend. Build, measure, learn, in that order." },
  { title: "Business Model Generation", author: "Alexander Osterwalder & Yves Pigneur", asin: "0470876417", category: "Strategy & Planning", featured: true, displayOrder: 2, status: "read",
    shortReview: "The Business Model Canvas is the one tool I still sketch on a napkin during client calls. This is the book that made it standard practice." },
  { title: "Zero to One", author: "Peter Thiel", asin: "0804139296", category: "Entrepreneurship", featured: true, displayOrder: 3, status: "read",
    shortReview: "I recommend this book because it forces you to defend why your idea is a real monopoly opportunity, not just a good idea." },
  { title: "The Hard Thing About Hard Things", author: "Ben Horowitz", asin: "0062273205", category: "Management & Leadership", featured: true, displayOrder: 4, status: "read",
    shortReview: "No sugar coating. I recommend it for the chapters on firing people and surviving a business that is genuinely close to failing." },
  { title: "Blue Ocean Strategy", author: "W. Chan Kim & Renée Mauborgne", asin: "1625274491", category: "Strategy & Planning", featured: true, displayOrder: 5, status: "read",
    shortReview: "I read this to stop competing on the same metrics as everyone else. The value curve exercise alone is worth the price." },
  { title: "Good to Great", author: "Jim Collins", asin: "0066620996", category: "Management & Leadership", featured: true, displayOrder: 6, status: "read",
    shortReview: "I recommend this for the Hedgehog Concept: what you can be best at, what drives your economics, what you are deeply passionate about." },
  { title: "The Innovator's Dilemma", author: "Clayton M. Christensen", asin: "0062060244", category: "Strategy & Planning", featured: true, displayOrder: 7, status: "read",
    shortReview: "I recommend this to explain why good companies lose to worse products. It changed how I read competitive threats for clients." },
  { title: "Influence", author: "Robert B. Cialdini", asin: "006124189X", category: "Marketing & Sales", featured: true, displayOrder: 8, status: "read",
    shortReview: "The reference book on persuasion. I recommend it to every marketer who wants to know why a tactic works, not just that it works." },
  { title: "High Output Management", author: "Andrew S. Grove", asin: "0679762884", category: "Management & Leadership", featured: true, displayOrder: 9, status: "read",
    shortReview: "I recommend this because it treats management as an operational discipline. Still the clearest book on what a manager actually produces." },
  { title: "Start with Why", author: "Simon Sinek", asin: "1591846447", category: "Management & Leadership", featured: true, displayOrder: 10, status: "read",
    shortReview: "I recommend it for the Golden Circle framework. Simple enough to use in a client workshop the same afternoon you read it." },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", asin: "0374533555", category: "Economics & Decision-Making", featured: true, displayOrder: 11, status: "read",
    shortReview: "Not a business book, but every business decision I make is shaped by System 1 and System 2. I recommend it without hesitation." },

  { title: "Value Proposition Design", author: "Alexander Osterwalder, Yves Pigneur et al.", asin: "1118968077", category: "Marketing & Sales", displayOrder: 12, status: "read",
    shortReview: "The companion to the Business Model Canvas. I recommend it to get the value map exercise right before writing any positioning." },
  { title: "Testing Business Ideas", author: "David Bland & Alexander Osterwalder", asin: "1119551447", category: "Entrepreneurship", displayOrder: 13, status: "read",
    shortReview: "A catalogue of experiments you can actually run this week. I recommend it as the practical follow-up to the Canvas." },
  { title: "The Startup Owner's Manual", author: "Steve Blank & Bob Dorf", asin: "0984999302", category: "Entrepreneurship", displayOrder: 14, status: "read",
    shortReview: "Dense and thorough. I recommend it as the step-by-step manual for customer development, not a quick weekend read." },
  { title: "Running Lean", author: "Ash Maurya", asin: "1449305172", category: "Entrepreneurship", displayOrder: 15, status: "read",
    shortReview: "I recommend this for the Lean Canvas variant. More founder-friendly and faster to apply than the original Business Model Canvas." },
  { title: "The Mom Test", author: "Rob Fitzpatrick", asin: "1492180742", category: "Entrepreneurship", displayOrder: 16, status: "read",
    shortReview: "Short and blunt. I recommend it because it fixes the single most common mistake founders make: asking leading questions." },
  { title: "The E-Myth Revisited", author: "Michael Gerber", asin: "0887307280", category: "Entrepreneurship", displayOrder: 17, status: "read",
    shortReview: "I recommend it for the distinction between working in your business and working on it. Old book, still true." },
  { title: "Venture Deals", author: "Brad Feld & Jason Mendelson", asin: "1119594820", category: "Venture Capital", displayOrder: 18, status: "read",
    shortReview: "I recommend this before any term sheet conversation. It explains what VCs actually negotiate for and why." },
  { title: "Lean Analytics", author: "Alistair Croll & Benjamin Yoskovitz", asin: "1449335675", category: "Entrepreneurship", displayOrder: 19, status: "read",
    shortReview: "I recommend it for the one metric that matters framework. Cuts through vanity dashboards fast." },
  { title: "Shoe Dog", author: "Phil Knight", asin: "1501135910", category: "Biography & Memoir", displayOrder: 20, status: "read",
    shortReview: "I recommend it as proof that no founder story is a straight line. Nike almost died more than once before it worked." },
  { title: "Delivering Happiness", author: "Tony Hsieh", asin: "0446576220", category: "Management & Leadership", displayOrder: 21, status: "read",
    shortReview: "I recommend this for how seriously it takes company culture as a growth lever, not a perk." },
  { title: "Company of One", author: "Paul Jarvis", asin: "0358213258", category: "Entrepreneurship", displayOrder: 22, status: "read",
    shortReview: "I recommend it as the counter-argument to grow-at-all-costs. Staying small on purpose is a real strategy." },
  { title: "Built to Last", author: "Jim Collins & Jerry I. Porras", asin: "0060516402", category: "Management & Leadership", displayOrder: 23, status: "read",
    shortReview: "I recommend this alongside Good to Great. It looks at what makes visionary companies survive generations of leadership." },
  { title: "Competitive Strategy", author: "Michael E. Porter", asin: "0684841487", category: "Strategy & Planning", displayOrder: 24, status: "read",
    shortReview: "The five forces, from the source. I recommend reading this before any strategy deck that name-drops Porter." },
  { title: "Competitive Advantage", author: "Michael E. Porter", asin: "0684841460", category: "Strategy & Planning", displayOrder: 25, status: "read",
    shortReview: "The natural follow-up to Competitive Strategy. I recommend it for the value chain framework specifically." },
  { title: "Playing to Win", author: "A.G. Lafley & Roger L. Martin", asin: "142218739X", category: "Strategy & Planning", displayOrder: 26, status: "read",
    shortReview: "I recommend it for the five-choices cascade. The clearest framework I know for turning strategy into an actual answerable question." },
  { title: "The Innovator's DNA", author: "Jeff Dyer, Hal Gregersen & Clayton M. Christensen", asin: "1633697207", category: "Strategy & Planning", displayOrder: 27, status: "read",
    shortReview: "I recommend it for the five discovery skills. Useful when you are trying to hire or become a better innovator, not just study one." },
  { title: "Crossing the Chasm", author: "Geoffrey A. Moore", asin: "0062292986", category: "Marketing & Sales", displayOrder: 28, status: "read",
    shortReview: "I recommend this to anyone selling a new category product. The gap between early adopters and the mainstream is real and it kills startups." },
  { title: "Play Bigger", author: "Al Ramadan, Dave Peterson, Christopher Lochhead & Kevin Maney", asin: "1489391851", category: "Marketing & Sales", displayOrder: 29, status: "read",
    shortReview: "I recommend it for category design. Sometimes the biggest marketing move is naming a category no one owns yet." },
  { title: "Obviously Awesome", author: "April Dunford", asin: "1999023005", category: "Marketing & Sales", displayOrder: 30, status: "read",
    shortReview: "The best short book on positioning I have read. I recommend it before writing any homepage headline." },
  { title: "This Is Marketing", author: "Seth Godin", asin: "0525540830", category: "Marketing & Sales", displayOrder: 31, status: "read",
    shortReview: "I recommend it for the idea that you cannot be for everyone. Smallest viable audience, said plainly." },
  { title: "Purple Cow", author: "Seth Godin", asin: "1591843170", category: "Marketing & Sales", displayOrder: 32, status: "read",
    shortReview: "I recommend it as a reminder that remarkable beats well-marketed. Short, quotable, still holds up." },
  { title: "Positioning", author: "Al Ries & Jack Trout", asin: "0071359168", category: "Marketing & Sales", displayOrder: 33, status: "read",
    shortReview: "The original positioning book. I recommend it to understand where every modern positioning framework actually comes from." },
  { title: "Made to Stick", author: "Chip Heath & Dan Heath", asin: "1400064287", category: "Marketing & Sales", displayOrder: 34, status: "read",
    shortReview: "I recommend it for the SUCCESs framework. It made me rewrite a lot of client messaging to be simpler and more concrete." },
  { title: "Contagious", author: "Jonah Berger", asin: "1451686587", category: "Marketing & Sales", displayOrder: 35, status: "read",
    shortReview: "I recommend it for the STEPPS framework on why things spread. Practical, research-backed, not just anecdotes." },
  { title: "Hooked", author: "Nir Eyal", asin: "1591847788", category: "Product & Growth", displayOrder: 36, status: "read",
    shortReview: "I recommend it to understand habit-forming product design, and to use that responsibly rather than as a growth hack." },
  { title: "Traction", author: "Gabriel Weinberg & Justin Mares", asin: "1591848369", category: "Marketing & Sales", displayOrder: 37, status: "read",
    shortReview: "I recommend it for the Bullseye Framework: testing every channel briefly before doubling down on the one that works." },
  { title: "Growth Hacker Marketing", author: "Ryan Holiday", asin: "1591847389", category: "Marketing & Sales", displayOrder: 38, status: "read",
    shortReview: "I recommend it as a quick read on product-market fit as the actual first step, before any growth tactic matters." },
  { title: "Inspired", author: "Marty Cagan", asin: "1119387507", category: "Product & Growth", displayOrder: 39, status: "read",
    shortReview: "I recommend it for how it separates real product teams from feature factories. Useful even outside pure tech products." },
  { title: "The Lean Product Playbook", author: "Dan Olsen", asin: "1118960874", category: "Product & Growth", displayOrder: 40, status: "read",
    shortReview: "I recommend it for the Product-Market Fit Pyramid. A practical bridge between Lean Startup theory and a real roadmap." },
  { title: "Sprint", author: "Jake Knapp, John Zeratsky & Braden Kowitz", asin: "150112174X", category: "Product & Growth", displayOrder: 41, status: "read",
    shortReview: "I recommend it whenever a client wants to test an idea in days, not months. The five-day structure just works." },
  { title: "Measure What Matters", author: "John Doerr", asin: "0525536221", category: "Management & Leadership", displayOrder: 42, status: "read",
    shortReview: "I recommend it for OKRs done properly. Most teams that say they use OKRs have not actually read this." },
  { title: "Only the Paranoid Survive", author: "Andrew S. Grove", asin: "0385483821", category: "Management & Leadership", displayOrder: 43, status: "read",
    shortReview: "I recommend it for the concept of the strategic inflection point. Written from the inside of a real crisis at Intel." },
  { title: "Radical Candor", author: "Kim Scott", asin: "1250103509", category: "Management & Leadership", displayOrder: 44, status: "read",
    shortReview: "I recommend it for the care personally, challenge directly framework. It changed how I give feedback to clients and partners." },
  { title: "Multipliers", author: "Liz Wiseman", asin: "0062312693", category: "Management & Leadership", displayOrder: 45, status: "read",
    shortReview: "I recommend it to any leader who wants to check whether they are amplifying their team's intelligence or draining it." },
  { title: "Rework", author: "Jason Fried & David Heinemeier Hansson", asin: "0307463745", category: "Entrepreneurship", displayOrder: 46, status: "read",
    shortReview: "Short chapters, strong opinions. I recommend it as a fast antidote to overplanning a business before you have a customer." },
  { title: "Remote", author: "Jason Fried & David Heinemeier Hansson", asin: "0804137501", category: "Business Culture", displayOrder: 47, status: "read",
    shortReview: "I recommend it for anyone building a distributed team. Written years before remote work was the default, and mostly still right." },
  { title: "Predictably Irrational", author: "Dan Ariely", asin: "0061353248", category: "Economics & Decision-Making", displayOrder: 48, status: "read",
    shortReview: "I recommend it for the pricing and anchoring experiments specifically. Directly useful for how I think about offers." },
  { title: "Nudge", author: "Richard H. Thaler & Cass R. Sunstein", asin: "014313700X", category: "Economics & Decision-Making", displayOrder: 49, status: "read",
    shortReview: "I recommend it for choice architecture. Relevant to anything from pricing pages to onboarding flows." },
  { title: "Never Split the Difference", author: "Chris Voss", asin: "0062407805", category: "Negotiation & Communication", displayOrder: 50, status: "read",
    shortReview: "I recommend it for tactical empathy and the calibrated question. The most useful negotiation book I have read for client conversations." }
];

BOOKS.forEach(b => {
  b.amazonUrl = buildAmazonAffiliateUrl(b.asin);
  b.coverImage = coverUrl(b.asin);
});
