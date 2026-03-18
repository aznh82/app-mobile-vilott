# Google AdMob Setup Guide

## 1. Tạo Google AdMob Account

1. Truy cập https://admob.google.com
2. Đăng nhập bằng Google account
3. Chọn "Create an app" hoặc "Apps" → "+ Add app"
4. Chọn **Android** platform
5. Tên app: **Vietlott**
6. Chọn category: **Games** hoặc **Utilities**

---

## 2. Tạo Ad Unit cho Banner

1. Trong app settings, chọn **Ad Units** → **+ Create Ad Unit**
2. Chọn format: **Banner**
3. Tên: `main_banner`
4. Cop **Ad Unit ID** (format: `ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy`)

---

## 3. Cấu hình App

### 3a. Update `app.json`

Thay `ca-app-pub-xxxxxxxxxxxxxxxx` bằng **App ID** từ AdMob:

```json
"plugins": [
  "expo-sqlite",
  [
    "react-native-google-mobile-ads",
    {
      "googleMobileAdsAppId": "ca-app-pub-YOUR-APP-ID"
    }
  ]
]
```

### 3b. Update `src/components/AdBanner.tsx`

Thay ad unit ID:

```typescript
const BANNER_AD_ID = __DEV__
  ? TestIds.BANNER // Test mode (development)
  : 'ca-app-pub-YOUR-AD-UNIT-ID'; // Production
```

---

## 4. Test Ads (Trước khi release)

**Hiện tại app đang dùng test ad IDs:**
- ✅ Development: Google cung cấp test ads (không tính revenue)
- ✅ Safe: Không vi phạm AdMob policy

**Khi ready to publish:**
1. Thay test ID bằng production ID ở bước 3b
2. Push code lên GitHub
3. Build & upload to Play Store

---

## 5. Monitoring Revenue

1. Vào https://admob.google.com/home
2. Xem revenue dashboard
3. CPM trung bình: **$1 - $3** (Việt Nam region)
4. Thanh toán: Mỗi tháng vào Google Adsense

---

## ⚠️ Important Tips

- **Không click ads của chính mình** → bị ban
- **Chỉ dùng test IDs trong development**
- **Thêm app privacy policy** trước khi release
- **Đợi 24h sau khi add ad unit** trước khi upload production

---

## 📊 Ước tính Revenue

Với 10,000 DAU:
- Impression/day: ~30,000 (3 ads/user)
- CPM: $2
- **Revenue/tháng: $1,800** 🎉

Thực tế có thể thấp hơn tùy vào engagement.

---

## 🔗 Links

- [Google AdMob](https://admob.google.com)
- [React Native Google Mobile Ads Docs](https://invertase.io/oss/react-native-google-mobile-ads)
- [AdMob Policies](https://support.google.com/admob/answer/6128877)
