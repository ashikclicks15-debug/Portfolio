# Ashik clicks - Photography Portfolio

## ফাইল সাজানো
```
photography-portfolio/
├── index.html
├── style.css
├── script.js
└── images/
    ├── nature-1.jpg ... nature-3.jpg
    ├── rural-1.jpg ... rural-3.jpg
    ├── flower-1.jpg ... flower-3.jpg
    ├── street-1.jpg ... street-3.jpg
    ├── portrait-1.jpg ... portrait-3.jpg
    ├── animals-1.jpg ... animals-3.jpg
    ├── sky-1.jpg ... sky-3.jpg
    └── sunset-1.jpg ... sunset-3.jpg
```

## GitHub Pages-এ live করার ধাপ
1. github.com এ লগইন করে **New repository** তৈরি করুন (নাম যেমন: `portfolio`), Public রাখুন।
2. **Add file → Upload files** এ গিয়ে `index.html`, `style.css`, `script.js` আর `images` ফোল্ডার ড্র্যাগ করে দিন, তারপর **Commit changes**।
3. **Settings → Pages** এ যান। Source এ **Deploy from a branch**, Branch এ **main** এবং **/(root)** বেছে **Save** করুন।
4. ১-২ মিনিট পর `https://আপনার-username.github.io/portfolio/` লিংকে সাইট চালু হবে।

## ছবি যোগ করা
- ছবির নাম হুবহু উপরের মতো দিন (ছোট হাতের অক্ষরে)।
- বেশি ছবি চাইলে `script.js` এর শুরুতে `photosPerSubject` এর সংখ্যা বাড়ান।
- ছবি না থাকলে সাইটে ধূসর বক্সে লেখা দেখাবে কোন নামে ছবি দিতে হবে।
