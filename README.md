# Nova — Education App

Expo (SDK 54) + expo-router + Supabase।

## ১. ডাটাবেস সেটআপ (একবারই)
1. Supabase Dashboard → **SQL Editor** → `supabase/schema.sql` পুরোটা পেস্ট করে **Run**।
2. **Authentication → Providers → Email** → "Confirm email" **বন্ধ** করুন (প্রতিযোগিতায় ইউজাররা সরাসরি ঢুকতে পারবে)।
3. অ্যাপে নিজের ইমেইল দিয়ে **Register** করুন, তারপর SQL Editor-এ চালান:
   ```sql
   update public.profiles set role='admin', approved=true
   where id = (select id from auth.users where email='azim4web@gmail.com');
   ```
   এরপর "Admin Login" দিয়ে ঢুকলেই অ্যাডমিন ড্যাশবোর্ড পাবেন।

## ২. চালানো
```bash
npm install
npx expo start
```

## ৩. APK বানানো (সবাইকে ডাউনলোড করতে দেওয়ার জন্য)
```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```
বিল্ড শেষে EAS একটি ডাউনলোড লিংক দেবে — সেটাই শেয়ার করুন।

## ৪. নিজের জিনিস বসান
- `assets/developer.jpg` → আপনার ছবি (About পেজে দেখাবে; ১:১ রেশিও ভালো)
- `assets/icon.png` → আপনার ফাইনাল অ্যাপ আইকন (১০২৪×১০২৪)

## নিরাপত্তা
শুধু **publishable key** অ্যাপে আছে — এটা নিরাপদ। Supabase-এর **secret / service_role key** কখনো কোডে বা কারও সাথে শেয়ার করবেন না।
অ্যাডমিন রোল সার্ভারে (RLS + trigger) সুরক্ষিত; অ্যাপ থেকে কেউ নিজেকে অ্যাডমিন বানাতে পারবে না।
