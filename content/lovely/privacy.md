# Lovely Privacy Policy

Effective Date: September 29, 2026  
Last Updated: September 29, 2026

**Operator / data controller:** Bilal Labs (“Lovely,” “we,” “us”)  
**Contact:** bdemirer70@gmail.com

---

## Introduction

Lovely is a private app for two partners. You pair with one person, and together you share stories, moods, a photo journal, special days and, only if you turn it on, your location.

What you share in Lovely is visible to you and your paired partner only. It is not public, and we do not sell it or use it for advertising.

This Privacy Policy explains:

- What we collect
- How we use it
- Who can see it and who we share it with
- How long we keep it and how to delete it
- Your rights and how to contact us

---

## Where This Policy Applies

| Platform | How it works |
| --- | --- |
| iOS / iPadOS app | You create an account (Sign in with Apple or email). Your content is stored in our cloud (Google Firebase) so it syncs between you and your partner. |
| Widgets, Live Activities and notifications | Parts of your partner’s content (for example, their latest story photo or mood) are copied to your device so they can appear on your Home Screen and Lock Screen. |
| Website | Our legal and support pages. We do not design the website to collect personal data. |

---

## What We Collect (and Why)

### Account Information

- **Sign in with Apple:** Apple gives us a user identifier and, if you choose, your name and an email address (which may be an Apple private relay address).
- **Email sign-in:** your email address and a password. The password is handled by Firebase Authentication; we never see it in plain text.
- **Profile:** the name you enter, an optional profile photo, the date your relationship started, your app color and language settings.

Why? To create your account, pair you with your partner and show your profile to them.

### Pairing

To pair, one partner creates a 6-digit invite code and the other enters it. We store the invite, which account created it and when, and a count of wrong code attempts (to block guessing). Once paired, we store the partnership between the two accounts.

### Content You Share With Your Partner

- **Memories:** a title, text, date, an optional photo and an optional place (place name, city, country and coordinates).
- **Special days:** a title, date, icon and color.
- **Stories:** a photo and a short caption. A story is shown for 6 hours; it stays in your shared archive until its author deletes it.
- **Moods:** an emoji and an optional short note, shown for 12 hours.

Why? This content is the app. It is stored so it appears for you and your partner on every device you use.

### Photos

When you add a photo, Lovely re-encodes it on your device before upload. The photo’s embedded metadata (EXIF), including the GPS position and camera details, is removed and never leaves your device. When you pick a photo, Lovely may read its capture date and location on your device to suggest a date and place for the memory; you can change or remove both before saving. Our server re-compresses any photo that is too large or still carries metadata.

Lovely uses the system photo picker, so it only sees the photos you choose. Camera access is only used when you take a photo for a story.

### Location (Optional, off by default)

Location sharing is off until you turn it on in Profile (“Share my location with my partner”) and grant the iOS permission.

- **Distance:** your position is rounded to about 100 meters and stored so your partner can see how far apart you are and see you on the couple map. It is updated when you have moved a significant distance (about 20 km), when you open the map, or when your partner starts a live location card. iOS may wake the app in the background for this if you allow “Always” access.
- **Live location:** when you start it, for the period you pick (15 minutes, 1 hour or 8 hours), your precise position is shared with your partner while you move, so their Lock Screen card can show how far away you are and when you arrive. It stops by itself when the period ends, and you can stop it any time.
- **Route distance and time:** during live location your phone asks Apple Maps for the walking or driving distance and travel time to your partner. That request goes from your device to Apple and includes both positions.

We use location only to show distance and positions to your paired partner. We do not use it for advertising, and we do not keep a location history: each new position replaces the previous one. Turning the setting off, signing out, ending the partnership or deleting your account removes your stored position.

### Notifications

If you allow notifications, we store your device’s push token so we can tell you when your partner shares something (for example, a new story, memory, mood, or a live location update). Push tokens are private: your partner cannot see them. We use Apple Push Notification service (directly and through Firebase Cloud Messaging) to deliver them. Story notifications may include the story photo, which your device downloads to display the notification and the Home Screen widget.

### Purchases (Lovely Premium)

Lovely Premium is an auto-renewing subscription sold through the Apple App Store. Apple processes the payment; we never receive your card details. We use RevenueCat to check your subscription status. RevenueCat receives your Lovely account identifier and purchase information from Apple (product, dates, status). We store whether you (or your partner) have Premium and until when, because one subscription covers both partners.

### Support

If you email us, we receive your email address and what you write. The in-app feedback email includes your app version and iOS version.

### What We Do Not Collect

- No advertising identifier (IDFA), no tracking across other apps or websites, and no ads.
- No third-party analytics or attribution SDKs.
- No AI or machine-learning service receives your content.
- No contacts, health data or browsing history.

---

## Who Can See Your Data

| Who | What |
| --- | --- |
| Your paired partner | Your name, profile photo, relationship start date, the memories and special days either of you adds, your stories, your mood and, only if you turned it on, your location. Your partner can edit and delete shared memories. |
| People you are not paired with | Nothing. There are no public profiles, feeds or search. |
| You | Everything above, plus your own settings. |

When a partnership ends, the other person can no longer see your content, and you can no longer see theirs.

---

## Who We Share Data With (and Why)

We share data only with service providers that run Lovely for us. They process it on our behalf and under their own security and privacy commitments, which provide protection at least equal to this policy.

| Vendor | Purpose | Data |
| --- | --- | --- |
| Google Firebase (Authentication, Cloud Firestore, Cloud Storage, Realtime Database, Cloud Functions, Cloud Messaging) | Accounts, storing and syncing your content, photos and location between partners, notifications | Account, profile, content, photos, location, push tokens |
| RevenueCat | Subscription status | Account identifier, purchase information from Apple |
| Apple (App Store, Sign in with Apple, Push Notification service, Maps) | Distribution, payments, sign-in, notifications, route distance and time | As described above |

We do **not** sell your data. We do **not** share it for targeted advertising. We do **not** use it to build profiles for anyone else.

### Legal requirements

We may disclose information if required by law or legal process, or if we believe it is necessary to protect the rights, safety and security of our users or others.

### Corporate transactions

If Lovely is involved in a merger, acquisition, reorganization or sale of assets, information we hold may transfer as part of that transaction. We will give notice where required by law.

---

## Where We Store Your Data

Your data is stored on Google Firebase servers in the United States (us-east1; the location database in us-central1). Where required (for example, under the GDPR or UK GDPR), transfers rely on appropriate safeguards such as Standard Contractual Clauses.

---

## How Long We Keep Your Data

| Data | Retention |
| --- | --- |
| Account, profile, memories, special days, stories | Until you delete them or delete your account |
| Mood | Replaced by your next mood; deleted with your account |
| Location | Only your latest position is kept; removed when you turn sharing off, sign out, end the partnership or delete your account |
| Push tokens | Until you sign out, the token stops working, or you delete your account |
| Invites and wrong-code counters | Until used or replaced; the counter resets after an hour |
| Subscription status | While needed to provide Premium; RevenueCat and Apple keep purchase records under their own policies |
| Support emails | As long as needed to answer and keep a record of the request |

---

## Deleting Your Data

- **Delete an item:** delete a memory, special day or story in the app. Its photo is removed from our storage.
- **Stop sharing location:** turn it off in Profile.
- **Delete your account:** Profile → Delete account. This permanently deletes your account, profile, the memories and stories you created (with their photos), your mood, your location, your invites and your push tokens, ends your partnership and revokes Sign in with Apple. Content your partner created stays with your partner.
- Deleting the app or your account does **not** cancel an App Store subscription. Cancel it in your Apple Account settings.
- RevenueCat may keep purchase records it needs; email us to request their deletion.

---

## Your Privacy Rights

Depending on where you live, you may have the right to access, correct, export or delete your data, to restrict or object to certain uses, and to withdraw consent. You can correct and delete most data directly in the app. For anything else, email bdemirer70@gmail.com. If we deny a request, you can appeal by replying to our email, and you may contact your local data protection authority.

### Legal bases (EEA/UK and similar regions)

- **Contract:** to provide Lovely (your account, pairing, sharing with your partner, Premium).
- **Consent:** location sharing, notifications, camera and photo access. You can withdraw consent at any time in the app or in iOS Settings.
- **Legitimate interests:** keeping Lovely secure and preventing abuse (for example, limiting invite code guesses).
- **Legal obligations:** complying with the law.

---

## Security

Data is encrypted in transit. Access to your content is limited by our database and storage rules to you and your active partner. Protect your device with a passcode and keep iOS up to date. No method of storage or transmission is 100% secure.

---

## Children’s Privacy

Lovely is not intended for anyone under 18. We do not knowingly collect personal information from children under 18. If you believe a child has used Lovely, contact bdemirer70@gmail.com and we will delete the account.

---

## Changes to This Policy

We may update this policy. The latest version is always at this page. If changes are material, we will let you know in the app where required.

---

## Contact Us

Email: bdemirer70@gmail.com
