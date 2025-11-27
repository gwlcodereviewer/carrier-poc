# Carrier POC

## Set up

If this is your first time running react native app, please follow the [set up environment guide](https://reactnative.dev/docs/environment-setup)

## Install dependencies

```bash
yarn install

# the followings are for ios
bundle install
cd ios
pod install
```

## Run iOS

```bash
# manually build application in Xcode
yarn start
# then, open ./ios/Carrier.xcodeproj using Xcode, then build on simulator

# run ios using command with default simulator
yarn run ios
```

## Run android

```bash
# manually build application in Android studio
yarn start
# then, open ./android folder using Android studio, wait for build, then run using selected simulator

# run ios using command with default simulator
yarn run android
```

## Troubleshooting

If you get the following error when running `pod install`:

```bash
CocoaPods could not find compatible versions for pod "hermes-engine"```
```

Please remove the `ios/Podfile.lock` and run `pod install` again.
