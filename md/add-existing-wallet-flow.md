# Add Existing Wallet Flow

Reference assets live in `../doc/add/`.

- `1.jpeg`: Add existing wallet method selection.
- `1_moder.jpeg`: Secret phrase safety confirmation bottom sheet.
- `2.jpeg`: Select network screen.
- `3.jpeg`: Multi-coin wallet restore screen.
- `IMG_0586.MP4`: Flow video reference.

## Implemented Flow

1. On the Wallets setup screen, tapping `Add existing wallet` opens the add-existing-wallet method screen.
2. Tapping `Secret phrase` opens the safety confirmation bottom sheet.
3. The user must check all three safety items before `Continue` becomes active.
4. `Continue` opens the select-network screen.
5. Tapping `Multi-coin wallet` or any listed network opens the restore screen.
6. The restore screen does not collect, store, or submit a real secret phrase. Tapping `Restore wallet` opens the local wallet dashboard at `/wallet`.
7. Tapping `What is a secret phrase?` opens the official Trust Wallet website.

## Safety Rule

Recovery phrases are wallet credentials. This project must not collect real secret phrases, private keys, or recovery words. Any production restore flow should hand users off to the official Trust Wallet app or website.
