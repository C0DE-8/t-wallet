# Trust Wallet UI Flow

This project should build one mobile-first wallet page component that matches the supplied screenshots and video reference in `../doc/`. The page is not a multi-page app. It is a single dark wallet interface with scrollable dashboard content and modal/bottom-sheet states opened from the main page actions.

## Reference Assets

- `../doc/photo_2026-08-31 14.28.51.jpeg`: main wallet dashboard top state.
- `../doc/photo_2026-08-31 14.28.50.jpeg`: dashboard scrolled to token/perps list.
- `../doc/photo_2026-08-31 14.28.48.jpeg`: dashboard scrolled through predictions, earn, AI, watchlist.
- `../doc/photo_2026-08-31 14.28.46.jpeg`: dashboard lower state with watchlist and customize button.
- `../doc/photo_2026-08-31 14.28.44.jpeg`: customize bottom sheet.
- `../doc/photo_2026-08-31 14.32.05.jpeg`: wallets modal with create/add wallet options.
- `../doc/photo_2026-08-31 14.28.41.jpeg`: receive QR page.
- `../doc/photo_2026-08-31 14.28.43.jpeg`: token selector page.
- `../doc/photo_2026-08-31 14.28.39.jpeg`: swap page.
- `../doc/photo_2026-08-31 14.28.33.jpeg`: buy page with payment method bottom sheet.
- `../doc/telegram-cloud-document-4-5811964824577385614.mp4`: motion/scroll reference for the same one-page wallet experience.

## Product Shape

Build a Trust Wallet-style mobile dashboard centered in the browser viewport. The main page should feel like a native iOS app screen: dark background, rounded controls, high-contrast white text, muted secondary text, blue/purple action emphasis, floating bottom navigation, and modal sheets that slide over the same page.

The first visible page is the wallet dashboard. The user can scroll vertically through token balances, perps, prediction cards, earn cards, Trust Wallet AI, and watchlist. The four primary actions at the top open single-page states: Send, Receive, Swap, and Buy. Receive, Swap, Buy, Token selection, Customize, and Wallet management are presented as page-level overlays or sheets, not separate routes.

## Main Dashboard Flow

1. Show a mobile app frame with the status-like top area cropped out or implied by spacing.
2. Place a top row with the left wallet pill, history button, and scan button.
3. Add a thin promo banner for `Explore Hyperliquid: 200+ markets live`.
4. Show the portfolio balance with large `$120.58` and secondary `$0.00 (0.00%)`.
5. Show four primary action buttons: Send, Receive, Swap, Buy.
6. Show the `Tokens` section with Tether USD, Bitcoin, Ethereum, BNB, Tron, and a `View all` pill.
7. Continue the same scroll page with `Perps`, `Predictions`, `Earn`, `Trust Wallet AI`, and `Watchlist`.
8. Keep a floating bottom navigation fixed above the home indicator area.
9. Add a centered `Customize` button near the lower dashboard state.

Main dashboard content:

- Top wallet pill: wallet icon plus `$120.58` or `trader mode` depending on state.
- Header actions: circular history icon and circular scan icon.
- Promo: Hyperliquid icon/visual, `Explore Hyperliquid: 200+ markets live`, `Explore now`.
- Portfolio: `$120.58`, `$0.00 (0.00%)`.
- Actions: Send with arrow up-right, Receive with down arrow, Swap with rotate icon, Buy with plus icon.
- Tokens: `Tether USD 120.6 USDT $120.58`, `Bitcoin 0 BTC $0.00`, `Ethereum 0 ETH $0.00`, `BNB 0 BNB $0.00`, `Tron 0 TRX $0.00`.
- Perps cards: BTC `40x`, ETH `25x`, and next clipped card.
- Predictions cards: `Will the U.S. invade Iran before 2027?` and a second clipped card.
- Earn cards: `22.32% APY on JUNO`, `15.34% APY on KSM`, and next clipped card.
- Trust Wallet AI row: sparkle icon, `Trust Wallet AI`, `Ask anything`.
- Watchlist rows: Solana, BNB, Ethereum, Bitcoin with price and red/green percentage.
- Bottom nav: selected wallet/home icon, trend icon, infinity icon, compass icon, separate search button.

## Overlay And Sheet Flow

### Wallets Modal

Trigger: tap the wallet pill.

- Full-screen dimmed dark overlay.
- Header: close icon left, `Wallets` centered, settings icon right.
- Section label: `Multi-coin wallets`.
- Wallet card: `Main Wallet`, subtitle `Multi-coin wallet`, shield icon, vertical overflow menu.
- Link: `Back up manually`.
- Large rounded bottom modal over the wallet screen with close icon.
- Illustration centered near top of modal.
- Option row: `Create new wallet`, subtitle `Secret phrase or FaceID / fingerprint`, sparkle icon, chevron.
- Option row: `Add existing wallet`, subtitle `Secret phrase, iCloud or view-only`, download icon, chevron.

### Customize Bottom Sheet

Trigger: tap `Customize`.

- Sheet slides from bottom over the current dashboard scroll position.
- Grab handle at top.
- Toggle rows: `Hide NFTs` on, `Hide Predictions` off, `Hide Perps` off, `Hide Earn` off.
- Divider.
- Text action: `Manage crypto`.
- Text action: `Dust cleaner`, with subtext `Convert small assets to the native token`.
- Toggle row: `Hide assets <0.01 USD` on.
- Toggling Hide Predictions, Hide Perps, or Hide Earn should hide/show those dashboard sections behind the sheet.
- Closing the sheet returns to the same scroll position.

### Receive Page

Trigger: tap `Receive`.

- Full-screen page-style overlay.
- Top left close button.
- Title: `Receive`.
- Network pill: `BNB Smart Chain` with BNB icon and dropdown chevron.
- Large white QR card with rounded corners and BNB logo centered in the QR.
- Address below QR, wrapped inside the card.
- Warning banner: `Only send BNB Smart Chain assets to this address. Other assets will be lost forever.`
- Two equal action buttons: Copy and Share.
- Bottom full-width pill button: `Deposit from Binance`.

### Token Selector

Trigger: tap a token chip inside Swap or Buy.

- Full-screen page-style overlay.
- Top left close button.
- Title: `Select token`.
- Search input with search icon and placeholder `Search for tokens`.
- Token row: USDT icon, `USDT`, `Tether USD`, `$120.59`, `120.6 USDT`.
- Selecting the visible USDT row closes the selector and applies USDT to the active field.
- Search can filter displayed token rows.

### Swap Page

Trigger: tap `Swap`.

- Full-screen page state.
- Header: back button, centered `Swap`, `Market` dropdown pill, settings/sliders button.
- First token amount panel: large `0`, USDT token chip, `$0.00`, refresh icon, wallet balance `120.6`.
- Middle circular down-arrow swap-direction button overlapping the two panels.
- Second token amount panel: large `0`, BTC token chip, `$0.00`, wallet balance `0`.
- Percentage slider: `Min`, `Max`, thumb at far left, markers `25%`, `50%`, `75%`.
- Custom numeric keypad: digits 1-9, bottom center `0`, bottom right backspace.
- Bottom slide control: left arrow handle and disabled text `Slide to Swap`.
- Numeric keypad updates the focused amount.
- Token chips open the token selector.
- Direction button swaps from/to token panels.
- Slider sets a proportional sell amount from available balance.

### Buy Page

Trigger: tap `Buy`.

- Full-screen page state with Buy/Sell segmented control near top.
- Back button at top left.
- Buy tab active, Sell inactive.
- Large fiat amount input: `40,170`.
- Right fiat currency chip: `NGN`.
- Smaller crypto estimate beneath: `0.01107238`.
- Right crypto token chip: `ETH`.
- Payment method row near bottom: `Pay with`, `Bank Transfer`, chevron.
- Payment bottom sheet with grab handle, title `Pay with`, provider/currency pill on the right.
- Payment methods: Bank Transfer selected with checkmark, Card, Google Pay.
- Buy/Sell segmented control switches the mode while preserving visual structure.
- Fiat and crypto chips open selectors.
- Payment row opens the payment sheet.
- Selecting a method updates the row and should close the sheet.

## Component Breakdown

- `WalletApp`: owns active overlay, selected action, token selections, and dashboard visibility toggles.
- `MobileShell`: constrains the app to a phone-like width and dark background.
- `Dashboard`: scrollable main page content.
- `TopWalletBar`: wallet pill, history button, scan button.
- `ActionGrid`: Send, Receive, Swap, Buy.
- `AssetList`: token rows and View all button.
- `HorizontalCardSection`: reused for Perps, Predictions, and Earn.
- `TrustAiRow`: AI call-to-action.
- `Watchlist`: market rows with price movement.
- `BottomNav`: fixed bottom wallet/trend/infinity/compass/search controls.
- `BottomSheet`: reusable bottom modal shell with dim backdrop, grab handle, and rounded top corners.
- `PageOverlay`: reusable full-screen overlay shell with dark background and close/back header controls.
- `WalletsModal`, `CustomizeSheet`, `ReceiveOverlay`, `TokenSelectorOverlay`, `SwapOverlay`, `BuyOverlay`, `PaymentSheet`.

## Visual Rules

- Use a near-black app background, roughly `#090b12`.
- Use dark card surfaces around `#1b1d2d` and `#202234`.
- Use purple/blue active controls around `#4b35ff` to `#5b4bff`.
- Primary text is white; secondary text is muted gray.
- Loss percentages use soft red; gain percentages use green.
- Use large rounded rectangles for native mobile controls, but keep repeated content cards at a restrained radius.
- Token icons should be circular and recognizable. If exact brand assets are unavailable, use colored circular placeholders with ticker letters for the first build.
- The dashboard must scroll under the fixed bottom nav.
- Bottom sheets should preserve the background page state and dim it slightly.
- Overlays should feel like native screens, not browser pages.

## Implementation Order

1. Replace the Vite starter UI with `WalletApp` and static mock data.
2. Build the main dashboard first, including scroll behavior and fixed bottom navigation.
3. Add top actions and wire them to local React state.
4. Build reusable `PageOverlay` and `BottomSheet` primitives.
5. Implement Receive, Swap, Buy, Token Selector, Customize, Wallets, and Payment states.
6. Add open/close behavior, payment selection, token selection, customize toggles, and swap keypad/slider behavior.
7. Verify mobile widths around 390px and 430px first, then center the phone UI on wider desktop screens.

## Acceptance Checklist

- The browser first screen matches the main wallet dashboard screenshot.
- The entire wallet dashboard is one vertically scrollable page.
- Primary actions open overlays or sheets without route changes.
- Buy payment sheet matches the screenshot structure.
- Swap screen includes token panels, keypad, slider, and disabled slide button.
- Receive screen includes the QR card, warning, Copy/Share, and Deposit from Binance.
- Customize sheet controls dashboard sections.
- Wallets modal includes the existing wallet card and create/add wallet options.
- UI remains dark, compact, and mobile-native at all visible states.
