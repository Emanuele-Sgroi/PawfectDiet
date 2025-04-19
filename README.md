# Pawfect Diet

👉 [View The App Showcase Website](https://pawfect-diet-app-showcase.vercel.app/)

![Pawfect Diet Logo](app_preview.png)

## Introduction

Welcome to **Pawfect Diet**! This project is the culmination of my dissertation work for the BSc (Hons) Computer Science program at the University of West London. Pawfect Diet is an innovative mobile application designed to revolutionize canine nutrition management through AI-driven personalized solutions. 

Built using React Native Expo, Pawfect Diet leverages AI technologies for canine dietary recommendations and TensorFlow for breed recognition. This app aims to provide dog owners with precise, personalized dietary advice to enhance their pets' health and well-being.

Whether you're a new pet owner or a seasoned dog lover, Pawfect Diet offers a user-friendly experience enriched with features that adapt to your dog's unique needs.

**Note**: Pawfect Diet is currently in a test version, fully functional but still under active development. I am planning to continue enhancing the app by adding more features and improving the existing ones.

## Features

- **Create Multiple Dog Profiles**: Manage multiple dogs with individual profiles, including health conditions and food preferences.
- **Working Dog Support**: Special functionalities for working dogs such as service dogs or athletic dogs.
- **Calorie Tracker**: Comprehensive tracking of caloric intake to meet health and activity goals.
- **Daily Log Generation**: Generate daily logs using AI, manual control, or a combination of both.
- **AI Feedback**: Receive AI feedback at the closure of the daily log.
- **AI Tips**: Get valuable tips and suggestions from AI to enhance your dog's diet.
- **Health Goals**: Automatically generated health goals based on veterinary science.
- **Interactive Vet Care Chat**: Simulate veterinary consultations with AI tailored specifically for the logged-in dog.
- **Text Detection in Chat**: Edit dog details directly within the AI chat interface.
- **Breed Recognition**: Utilise machine learning to identify dog breeds and refine dietary recommendations.
- **Profile Personalization**: Customize profiles with pictures and tags.
- **User-Friendly Design**: An intuitive design based on user research for ease of use.
- **More Features Coming Soon**: Continuous development to introduce new functionalities.

## Installation

To get started with Pawfect Diet, follow these steps:

1. **Clone the repository:**
   ```
   git clone https://github.com/Emanuele-Sgroi/PawfectDiet.git
   ```
2. Navigate to the project directory:
   ```
   cd PawfectDiet
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up Firebase and OpenAI APIs:
   - Create a Firebase project (for web) and obtain your configuration details.
   - Sign up for OpenAI and get your API key.
   - Create a .env file in the root directory and add your API keys:
   ```
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   ```

## Usage
To run the application, use the following command:
```
npx expo start
```
Ensure you have an emulator set up with the Expo Go app to run the application. You can use either an Android or iOS emulator:

1. Android Emulator:
   - Install Android Studio and set up an Android Virtual Device (AVD).
   - Download and install the Expo Go app from the Google Play Store on the emulator.

2. iOS Emulator:
   - Install Xcode and set up an iOS Simulator.
   - Download and install the Expo Go app from the Apple App Store on the simulator.

After starting the app with npx expo start, you can scan the QR code provided by the Expo CLI with the Expo Go app on your emulator or physical device to run the application.

## Contributing

Contributions is very appreciated to enhance Pawfect Diet's features and functionality. To contribute, follow these steps:

1. **Fork the repository**: Click the "Fork" button at the top right of the repository page on GitHub.

2. **Clone your forked repository**:
   ```
   git clone https://github.com/Emanuele-Sgroi/PawfectDiet.git
   ```
3. Create a new branch for your feature or bug fix:
   ```
   git checkout -b feature-name
   ```
4. **Make your changes**: Implement your feature or fix the bug
5. Commit yout changes:
   ```
   git commit -m "Add new feature"
   ```
6. Push to the branch:
   ```
   git push origin feature-name
   ```
7. **Open a pull request**: Go to the original repository on GitHub and click the "New pull request" button. Provide a detailed description of your changes and why they are beneficial.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.


**THANK YOU**
