# CMEX - Campus Marketplace Exchange

<img src="./assets/images/C-Mex_Logo.png" width="150" alt="CMEX Logo">

## Overview
CMEX (Campus Marketplace Exchange) is a mobile application built with React Native and Expo that allows college students to buy, sell, and exchange items within their campus community. The app provides a secure, user-friendly platform for students to connect and trade textbooks, furniture, electronics, and other goods.

## Features
- **User Authentication**: Secure login and registration with Supabase
- **Product Listings**: Browse, search, and filter items for sale
- **Sell Items**: Easily list your items with photos and descriptions
- **Chat System**: Built-in messaging to connect buyers and sellers
- **User Profiles**: Manage your listings and personal information
- **Barcode Scanner**: Quickly add products by scanning barcodes

## Tech Stack
- [React Native](https://reactnative.dev/) - Cross-platform mobile framework
- [Expo](https://expo.dev/) - React Native development platform
- [Supabase](https://supabase.com/) - Backend and authentication provider
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [React Navigation](https://reactnavigation.org/) - Navigation library

## Setup Instructions

### Prerequisites
- Node.js (v16 or newer)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cmex.git
   cd cmex
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

4. Run on a device or emulator
   - Press `a` for Android
   - Press `i` for iOS
   - Or scan the QR code with Expo Go app on your device

### Environment Setup
Create a `.env` file in the root directory with the following variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
Project Link: [https://github.com/addu10/cmex](https://github.com/addu10/cmex)

---

Built with ❤️ by the CMEX team
