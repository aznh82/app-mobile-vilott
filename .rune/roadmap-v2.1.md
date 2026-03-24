# Roadmap v2.1 — Feature Candidates

Created: 2026-03-24 | Source: brainstorm session

## High Impact — Tăng retention + revenue

| # | Tính năng | Mô tả | Effort | Priority |
|---|-----------|-------|--------|----------|
| 1 | Push Notification kết quả | Thông báo ngay khi có kết quả mới cho game yêu thích | 3-4h | P0 |
| 2 | Dò số tự động | User nhập bộ số → app tự check trúng thưởng khi có kết quả | 2-3h | P0 |
| 3 | Lịch sử số đã chọn | Lưu lại bộ số user đã dùng, đánh dấu trúng/trượt | 2h | P1 |
| 4 | Widget màn hình chính | Hiển thị kết quả mới nhất ngay trên home screen | 4-5h | P2 |

## Medium Impact — Tăng engagement

| # | Tính năng | Mô tả | Effort | Priority |
|---|-----------|-------|--------|----------|
| 5 | So sánh tần suất giữa các khoảng thời gian | Chart overlay: 30d vs 3m vs 6m | 2h | P2 |
| 6 | Heatmap số | Grid 1-45 với màu theo tần suất (đỏ=nóng, xanh=lạnh) | 2h | P2 |
| 7 | Share kết quả | Chia sẻ kết quả/bộ số gợi ý qua Zalo/Facebook | 1-2h | P1 |
| 8 | Jackpot tracker | Biểu đồ Jackpot qua thời gian, alert khi vượt ngưỡng | 2h | P2 |
| 9 | Dark/Light theme toggle | Hiện tại chỉ có dark theme | 2-3h | P3 |

## Revenue focused

| # | Tính năng | Mô tả | Effort | Priority |
|---|-----------|-------|--------|----------|
| 10 | Premium tier 2 | Thêm gói "Pro" với dò số + notification + widget | 2h | P2 |
| 11 | Rewarded video ads | Xem video → unlock 1 bộ số premium miễn phí | 1h | P2 |
| 12 | Referral system | Mời bạn → cả hai được 7 ngày Premium | 3h | P3 |

## Quality of life

| # | Tính năng | Mô tả | Effort | Priority |
|---|-----------|-------|--------|----------|
| 13 | Onboarding flow | Chọn game yêu thích khi mở app lần đầu | 2h | P2 |
| 14 | Skeleton loading | Loading placeholders thay vì blank screen | 1h | P1 |
| 15 | Error boundary | Catch React errors, hiện fallback UI thay vì crash | 1h | P1 |

## Proposed Sprint 1 (~1 tuần)

| Priority | Tính năng | Lý do |
|----------|-----------|-------|
| P0 | Dò số tự động (#2) | Killer feature — lý do chính user quay lại app |
| P0 | Push Notification (#1) | Retention driver — nhắc user mở app mỗi kỳ quay |
| P1 | Share kết quả (#7) | Viral growth — miễn phí marketing |
| P1 | Skeleton loading (#14) | UX polish — first impression tốt hơn |
| P2 | Rewarded video (#11) | Revenue tăng mà không gây khó chịu user |
