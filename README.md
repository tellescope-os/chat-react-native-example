# Tellescope Chat Demo (React-Native)

## Setup

### `React Native`
If you haven't developed with React Native (or normally rely on Expo), \
please follow [the instructions](https://reactnative.dev/docs/environment-setup) \
for the React Native CLI Quickstart

### `npm install`
Install dependencies. Use Yarn if you prefer.

### `cd ios && pod install && cd ..`
Install ios dependencies before running

### `Environment Variables`
#### `Create a .env file in the root directory with your own values`
```
REACT_APP_TELLESCOPE_API_ENDPOINT=''
REACT_APP_TELLESCOPE_BUSINESS_ID='YOUR_BUSINESS_ID_HERE'
REACT_APP_TELLESCOPE_API_KEY ='YOUR_API_KEY_HERE'
REACT_APP_EXAMPLE_ENDUSER_EMAIL='email@email.com'
REACT_APP_EXAMPLE_ENDUSER_PASSWORD='test_password_goes_here!!!2310'
```
REACT_APP_TELLESCOPE_API_ENDPOINT Defaults to https://api.tellescope.com 
BUSINESS_ID and API_KEY can be found in your settings page
EXAMPLE_PASSWORD should satisfy length > 8, uppercase letter, number, special character

### `Accounts`

#### `User`
You must have an account registered with Tellescope as part of an organization.

#### `Enduser`
You will need a test enduser with a password. If you have set the email and password fields in the .env file, \
you can run the following script to create a sample enduser for testing.
```
npm run create-enduser
```
## Running

#### `Chat Room`
You will need a test chat room to send messages. 
You can run the following script to create a room with your sample enduser
```
npm run create-chat-room
```


### `npm start`
Launches Metro, run React Native code for app

### `npm run ios`
To launch iOS simulator

### `npm run android`
To launch Android simulator

## Acknowledgements
Built with react-native init