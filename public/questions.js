// IC3 Digital Literacy (GS6) style practice bank. Original questions, grouped by the exam's domains.
// a = index of the correct choice, or an array of indexes when several are correct.

export const DOMAINS = {
  basics: 'technology basics',
  citizen: 'digital citizenship',
  info: 'information management',
  content: 'content creation',
  comms: 'communication',
  collab: 'collaboration',
  safety: 'safety and security',
};

export const QUESTIONS = [
  // technology basics
  { id: 'b1', d: 'basics', q: 'Which component temporarily holds data for programs that are running?', c: ['Hard drive', 'RAM', 'Power supply', 'Network card'], a: 1, x: 'RAM is fast, volatile working memory. Its contents are lost when the power goes off.' },
  { id: 'b2', d: 'basics', q: 'An app freezes and stops responding. What should you try first?', c: ['Reinstall the operating system', 'Force quit the app', 'Replace the RAM', 'Format the drive'], a: 1, x: 'Start with the least disruptive fix: close the stuck app with Task Manager on Windows or Force Quit on macOS.' },
  { id: 'b3', d: 'basics', q: 'Which of these is an operating system?', c: ['Google Chrome', 'Microsoft Word', 'macOS', 'Wi-Fi'], a: 2, x: 'macOS, Windows, Linux, iOS and Android are operating systems. Chrome and Word are applications.' },
  { id: 'b4', d: 'basics', q: 'What does "the cloud" mean when storing files?', c: ['Files stored on remote servers reached over the internet', 'Files stored on a USB drive', 'Files kept only in RAM', 'Files compressed into a zip'], a: 0, x: 'Cloud storage keeps files on a provider’s servers, so you can reach them from any device.' },
  { id: 'b5', d: 'basics', q: 'Which unit is largest?', c: ['Megabyte', 'Kilobyte', 'Terabyte', 'Gigabyte'], a: 2, x: 'KB < MB < GB < TB. Each step is about 1,000× (or 1,024×) larger.' },
  { id: 'b6', d: 'basics', q: 'Why should you install operating system updates?', c: ['They fix security holes and bugs', 'They always make the device faster', 'They delete old files', 'They are required to browse the web'], a: 0, x: 'Updates mainly patch vulnerabilities and fix bugs. Delaying them leaves known holes open.' },
  { id: 'b7', d: 'basics', q: 'Which file extension usually means a compressed archive?', c: ['.docx', '.zip', '.png', '.mp3'], a: 1, x: '.zip bundles and compresses files. .docx is a Word document, .png an image and .mp3 audio.' },

  // digital citizenship
  { id: 'c1', d: 'citizen', q: 'Which image can you most safely reuse in a public presentation without asking?', c: ['Any image found on Google Images', 'An image licensed CC BY, credited to its author', 'A screenshot of a movie poster', 'A photo from a friend’s private account'], a: 1, x: 'Creative Commons BY allows reuse as long as you give credit. Search results are not automatically free to use.' },
  { id: 'c2', d: 'citizen', q: 'What is a digital footprint?', c: ['The trail of data you leave online', 'Your device’s serial number', 'The size of your hard drive', 'A fingerprint login'], a: 0, x: 'Posts, comments, searches and photos add up to a lasting record that others can find.' },
  { id: 'c3', d: 'citizen', q: 'A classmate is being harassed in a group chat. What is the best response?', c: ['Join in so you are not targeted', 'Ignore it, it is not your business', 'Save evidence, support them and report it', 'Delete the chat app'], a: 2, x: 'Keep screenshots, support the target, and report it to the platform or a trusted adult or staff member.' },
  { id: 'c4', d: 'citizen', q: 'Copyright protects a work…', c: ['Only after it is registered', 'Automatically, once it is created in a fixed form', 'Only if it has a © symbol', 'Only for 5 years'], a: 1, x: 'In most countries copyright applies as soon as a work is fixed, for example written down or recorded.' },
  { id: 'c5', d: 'citizen', q: 'Which is good netiquette in a professional email?', c: ['Writing in ALL CAPS for emphasis', 'A clear subject line and a polite tone', 'Replying all to every message', 'Using lots of emoji'], a: 1, x: 'Clear subjects, concise text and a polite tone. All caps reads as shouting.' },
  { id: 'c6', d: 'citizen', q: 'Which of these does accessibility in digital content include? (Choose two)', c: ['Alt text on images', 'Captions on videos', 'Using only colour to show meaning', 'Very small fonts'], a: [0, 1], x: 'Alt text and captions help people using screen readers or with hearing loss. Colour alone excludes colour-blind users.' },
  { id: 'c7', d: 'citizen', q: 'Before posting a photo of friends publicly you should…', c: ['Post it, it is your photo', 'Ask for their permission', 'Blur your own face', 'Only post at night'], a: 1, x: 'Respect other people’s privacy. Ask before sharing images of them.' },

  // information management
  { id: 'i1', d: 'info', q: 'Which search finds pages containing the exact phrase "solar panel cost"?', c: ['solar panel cost', '"solar panel cost"', 'solar OR panel OR cost', 'solar -panel cost'], a: 1, x: 'Quotation marks make the search engine match the exact phrase.' },
  { id: 'i2', d: 'info', q: 'Which search excludes results about cars from "jaguar"?', c: ['jaguar +cars', 'jaguar -cars', 'jaguar "cars"', 'jaguar AND cars'], a: 1, x: 'A minus sign directly before a word excludes it.' },
  { id: 'i3', d: 'info', q: 'Which is the strongest sign that a website is a credible source?', c: ['It has lots of ads', 'It names the author, cites sources and is recently updated', 'It is the first search result', 'It uses bright colours'], a: 1, x: 'Check the author, sources, date and purpose. Ranking and design say nothing about accuracy.' },
  { id: 'i4', d: 'info', q: 'You need to find all files ending in .pdf in a folder. What do you search for?', c: ['pdf?', '*.pdf', '#pdf', '.pdf*'], a: 1, x: 'The * wildcard matches any name, so *.pdf matches every PDF.' },
  { id: 'i5', d: 'info', q: 'What is the best way to keep project files organised?', c: ['Everything on the desktop', 'Descriptive folder names and consistent file names', 'Random names, then search', 'One huge folder'], a: 1, x: 'Clear folders plus consistent names like 2026-10-report-v2.docx make files easy to find.' },
  { id: 'i6', d: 'info', q: 'Which backup approach protects best against a dead laptop?', c: ['A second copy in another folder on the same laptop', 'A copy on cloud storage or an external drive', 'Renaming files', 'Emptying the trash'], a: 1, x: 'A backup must live on a different device or service. A copy on the same disk dies with that disk.' },
  { id: 'i7', d: 'info', q: 'A spreadsheet sorted by "Last name" A→Z is sorted in…', c: ['Descending order', 'Ascending order', 'Random order', 'Filtered order'], a: 1, x: 'A→Z and 0→9 are ascending. Z→A is descending.' },

  // content creation
  { id: 'n1', d: 'content', q: 'Which spreadsheet formula adds the values in A1 through A10?', c: ['=ADD(A1:A10)', '=SUM(A1:A10)', '=TOTAL(A1-A10)', '=A1+A10'], a: 1, x: 'SUM over the range A1:A10. Plain =A1+A10 only adds two cells.' },
  { id: 'n2', d: 'content', q: 'Which formula gives the average of B2:B20?', c: ['=MEAN(B2:B20)', '=AVG(B2:B20)', '=AVERAGE(B2:B20)', '=SUM(B2:B20)/2'], a: 2, x: 'Excel, Sheets and Numbers all use AVERAGE.' },
  { id: 'n3', d: 'content', q: 'Which chart best shows how sales change month by month?', c: ['Pie chart', 'Line chart', 'Scatter plot of unrelated values', 'Table only'], a: 1, x: 'A line chart shows a trend over time. A pie chart shows parts of one whole.' },
  { id: 'n4', d: 'content', q: 'In a document, how do you keep a heading’s style consistent everywhere?', c: ['Format each heading by hand', 'Apply a built-in Heading style', 'Use bigger spaces', 'Underline it'], a: 1, x: 'Styles keep formatting consistent and also power the table of contents and navigation pane.' },
  { id: 'n5', d: 'content', q: 'Which file format keeps a document’s layout the same on any device?', c: ['.txt', '.pdf', '.csv', '.html'], a: 1, x: 'PDF fixes the layout, fonts and pages for sharing and printing.' },
  { id: 'n6', d: 'content', q: 'In =A1*$B$1, what does $B$1 mean?', c: ['A currency value', 'An absolute reference that does not change when copied', 'A hidden cell', 'An error'], a: 1, x: 'The $ signs lock the column and row, so B1 stays fixed when the formula is filled down.' },
  { id: 'n7', d: 'content', q: 'What makes a presentation slide most readable?', c: ['Full paragraphs of text', 'A few key points with large text', 'Six different fonts', 'Text over a busy photo'], a: 1, x: 'Few words, large type and high contrast. The speaker carries the detail.' },

  // communication
  { id: 'm1', d: 'comms', q: 'When should you use BCC in an email?', c: ['To send to many people without showing their addresses to each other', 'To mark the email urgent', 'To attach large files', 'To encrypt the email'], a: 0, x: 'BCC recipients are hidden from everyone else, which protects their addresses.' },
  { id: 'm2', d: 'comms', q: '"Reply all" sends your reply to…', c: ['Only the sender', 'The sender and everyone in To and CC', 'Everyone in your contacts', 'Only BCC recipients'], a: 1, x: 'Reply all goes to the sender plus all visible recipients. Use it only when everyone needs the reply.' },
  { id: 'm3', d: 'comms', q: 'Which tool fits a quick real-time question to a teammate best?', c: ['A formal letter', 'Instant messaging or chat', 'A printed memo', 'A blog post'], a: 1, x: 'Chat is synchronous and quick. Email suits longer or formal messages.' },
  { id: 'm4', d: 'comms', q: 'An attachment is too large to email. What should you do?', c: ['Split it into 50 emails', 'Share a cloud link instead', 'Rename the file', 'Change the extension to .txt'], a: 1, x: 'Upload it to cloud storage and send a link with the right permissions.' },
  { id: 'm5', d: 'comms', q: 'What is an automatic reply ("out of office") for?', c: ['Telling senders you are away and when you will return', 'Blocking spam', 'Forwarding all mail', 'Deleting old mail'], a: 0, x: 'It replies automatically while you are away, often with a backup contact.' },
  { id: 'm6', d: 'comms', q: 'Which is synchronous communication?', c: ['Email', 'A video call', 'A forum post', 'A recorded lecture'], a: 1, x: 'Synchronous means happening live, as on a call. Email and forums are asynchronous.' },

  // collaboration
  { id: 'l1', d: 'collab', q: 'You want a colleague to suggest changes without editing your document directly. Which permission do you give?', c: ['Viewer', 'Commenter', 'Owner', 'No access'], a: 1, x: 'Commenters can add comments or suggestions but cannot change the content.' },
  { id: 'l2', d: 'collab', q: 'Version history in a shared document lets you…', c: ['See and restore earlier versions', 'Undo only the last keystroke', 'Lock the file forever', 'Change the file type'], a: 0, x: 'Cloud editors keep revisions, so you can see who changed what and roll back.' },
  { id: 'l3', d: 'collab', q: 'Which tool works best for scheduling a meeting with five busy people?', c: ['A shared calendar showing availability', 'Emailing each person separately', 'A phone call to each', 'Guessing a time'], a: 0, x: 'Shared calendars show free and busy times and send invites with reminders.' },
  { id: 'l4', d: 'collab', q: 'In a video meeting, you are not speaking. What is good practice?', c: ['Keep your microphone muted', 'Turn up your speakers', 'Share your screen', 'Leave and rejoin'], a: 0, x: 'Muting removes background noise for everyone else.' },
  { id: 'l5', d: 'collab', q: 'What does "Track Changes" (Suggesting mode) do?', c: ['Records edits so others can accept or reject them', 'Saves a backup every minute', 'Translates the document', 'Counts words'], a: 0, x: 'Edits appear as suggestions that the owner can accept or reject one by one.' },
  { id: 'l6', d: 'collab', q: 'A shared link is set to "Anyone with the link can edit". What is the risk?', c: ['None', 'Anyone who gets the link can change or delete content', 'The file becomes read-only', 'The file is deleted'], a: 1, x: 'Links get forwarded. Limit access to named people, or set the link to view-only.' },

  // safety and security
  { id: 's1', d: 'safety', q: 'Which password is strongest?', c: ['password123', 'Fluffy2008', 'river-candle-orbit-71!', 'qwerty'], a: 2, x: 'Long, random passphrases beat short words with digits on the end. Use a password manager.' },
  { id: 's2', d: 'safety', q: 'An email says your account is locked and asks you to sign in via a link. What is this most likely to be?', c: ['A routine notice', 'Phishing', 'A software update', 'Spam filtering'], a: 1, x: 'Urgency plus a sign-in link is classic phishing. Go to the site yourself instead of clicking.' },
  { id: 's3', d: 'safety', q: 'What does two-factor authentication (2FA) add?', c: ['A second password', 'A second proof, such as a code from your phone', 'Faster logins', 'A backup email'], a: 1, x: '2FA combines something you know (a password) with something you have (a phone or key).' },
  { id: 's4', d: 'safety', q: 'Which sign in the browser shows the connection is encrypted?', c: ['http://', 'https:// and a lock icon', 'A .com domain', 'A fast page load'], a: 1, x: 'HTTPS encrypts traffic. It does not prove the site is trustworthy, only that the connection is private.' },
  { id: 's5', d: 'safety', q: 'On public Wi-Fi, which is the safest choice?', c: ['Online banking without a VPN', 'Turning off the firewall', 'Using a VPN or mobile data for sensitive tasks', 'Sharing files with everyone'], a: 2, x: 'Public networks can be monitored. A VPN or mobile data protects sensitive sessions.' },
  { id: 's6', d: 'safety', q: 'What is malware? (Choose two)', c: ['Ransomware', 'A spyware app', 'A browser update from the vendor', 'A spreadsheet'], a: [0, 1], x: 'Malware is any malicious software: viruses, ransomware, spyware, trojans.' },
  { id: 's7', d: 'safety', q: 'What should you do before throwing away an old phone?', c: ['Remove the case', 'Back up, sign out of accounts, then factory reset', 'Delete only photos', 'Nothing'], a: 1, x: 'A factory reset after signing out (for example disabling Find My) wipes your data and unlinks the device.' },
];
