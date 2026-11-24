# CLAUDE.md

Guidance for Claude Code when working in this repository.
Keep this file short and current — update it whenever the stack, scripts or conventions change.

## Project overview

<!-- TODO: 1–3 sentences: what the app does, who it's for, target platforms. -->
- **App:** `<app-name>` — <short description>
- **Platforms:** Android, iOS (web: <yes/no>)
- **Package manager:** `<npm | pnpm | yarn | bun>` — never mix lockfiles.

## Tech stack (Expo SDK 58)

| Layer | Version / choice |
|---|---|
| Expo SDK | `expo@^58.0.0` |
| React Native | 0.88 (New Architecture only — Legacy Architecture is gone since SDK 55) |
| React | 19.2.x |
| Node.js | 22.13+, 24.3+ or 26+ (odd versions 23/25 are **not** supported) |
| Routing | Expo Router (file-based, `app/` directory) |
| Language | TypeScript, `strict: true` |
| Builds | EAS Build + development builds (not Expo Go) |
<!-- TODO: add state management, data fetching, styling, forms, testing libs, e.g.
| State | Zustand |
| Server state | TanStack Query |
| Styling | NativeWind / StyleSheet |
-->

## Commands

```bash
npx expo start                    # dev server (use with a development build)
npx expo run:android              # local native build + run
npx expo run:ios                  # local native build + run (macOS + Xcode 27)
npx expo install <pkg>            # ALWAYS use this to add Expo/RN packages
npx expo install --check          # verify package versions match SDK 58
npx expo-doctor@latest            # project health check — run after dependency changes
npx expo prebuild --clean         # regenerate android/ and ios/ (CNG)
npx tsc --noEmit                  # type check
npx expo lint                     # lint
eas build --profile development --platform android
eas build --profile production --platform all
```
<!-- TODO: add test command, e.g. `npm test` (jest-expo) -->

## Project structure

```
app/                  # Expo Router routes ONLY (screens, _layout.tsx, +not-found.tsx, api routes)
  (tabs)/             # route groups
  _layout.tsx         # root layout: providers, fonts, splash
src/
  components/         # reusable UI (no routing logic)
  features/<name>/    # feature modules: components, hooks, api, types
  hooks/
  lib/                # api client, storage, utils
  constants/          # theme, colors, config
assets/               # images, fonts
app.config.ts         # dynamic Expo config (reads env)
eas.json
```
- Do **not** put non-route files inside `app/` — every file there becomes a route.
- Use the `@/` path alias (configured in `tsconfig.json`) instead of deep relative imports.

## Native code: Continuous Native Generation

- `android/` and `ios/` are **generated** by `npx expo prebuild` and are git-ignored.
- Never edit native folders by hand. Change native config via `app.config.ts`, `expo-build-properties`, or a config plugin in `plugins/`.
- Any change to native deps or config plugins → rebuild the development build. JS-only changes don't need a rebuild.

## Coding conventions

- Functional components + hooks only. Named exports for components; default export only where Expo Router requires it (route files).
- Type everything; no `any`. Prefer `type` for props, `interface` for public object shapes.
- Styles: <!-- TODO: StyleSheet.create / NativeWind --> — no inline style objects in render-heavy lists.
- Lists: use `FlatList` / `FlashList` with stable `keyExtractor`, never `.map()` over large arrays inside `ScrollView`.
- Images: use `expo-image`, not RN `Image`, for remote images.
- Safe areas: use `react-native-safe-area-context` (`SafeAreaView` / `useSafeAreaInsets`), not RN's `SafeAreaView`.
- Secrets never go in `EXPO_PUBLIC_*` variables — those are inlined into the client bundle.

## SDK 58 rules & gotchas (important)

**React Native 0.87/0.88 (Strict TypeScript API is the default)**
- No deep imports from `react-native/Libraries/*` — they are type errors. Import from `react-native` only.
- Ref types use instance types: `useRef<ViewInstance>(null)`, `useRef<TextInputInstance>(null)`.
- Removed — do not use: `InteractionManager` (use `requestIdleCallback`), the `Touchable` root export, `Modal`'s `animated` prop, `StatusBar`'s `backgroundColor` / `translucent` / `networkActivityIndicatorVisible` props.
- `ImageBackground` is deprecated → use a `View` with an absolutely positioned `expo-image` `Image`.

**Expo Router**
- Never import from `@react-navigation/*` in app code (unsupported since SDK 56). Use the `expo-router` entry points.
- Native tabs: import from `expo-router/native-tabs` (not `unstable-native-tabs`).
- `screen`, `params`, `initial` are now ordinary params — navigate with a complete href instead (e.g. `router.push('/profile/123')`).
- Custom navigators: use `integrateWithRouter` / `createStandardRouterNavigator`; `withLayoutContext` is deprecated.
- iOS 26+: headers are transparent (Liquid Glass) by default and content scrolls under them — account for header height/insets.
- `Stack.Toolbar` requires `@expo/ui`; Android `md` icons in `NativeTabs` require `expo-symbols`.
- Web: if `web.output` is unset it defaults to `"server"`. <!-- TODO: set "static" or "server" explicitly in app.config.ts -->

**Platform / build**
- iOS uses the UIKit scene lifecycle (`SceneDelegate.swift` is generated by prebuild). Don't set `ios.enableSceneSupport` — it's built in.
- iPhone apps are resizable on iOS 27; `ScreenOrientation.lockAsync` may not take effect — design layouts to be responsive.
- Android release builds enable R8 minification by default. Reflection-based libraries may need keep rules via `expo-build-properties`.
- Expo CLI sets `NODE_ENV` based on the command, which decides which `.env.*` file loads — check this when env vars look wrong.
- macOS target is not supported on SDK 58.

**Library changes**
- `expo-file-system`: `File.write()` is async — always `await` it. `File.md5` is deprecated → `File.digest()`.
- `expo-notifications`: foreground notifications are shown by default — set a handler if you don't want that.
- `expo-sqlite`: libSQL support was removed.

## Workflow rules for Claude

1. **Check docs before using an Expo API** — SDK 58 is newer than your training data. Fetch versioned docs: `https://docs.expo.dev/versions/v58.0.0/sdk/<package>.md` (any docs URL + `.md`; index at `https://docs.expo.dev/llms.txt`).
2. Install packages with `npx expo install`, never plain `npm install`, so versions match SDK 58. Run `npx expo-doctor@latest` afterwards.
3. Before adding a library, confirm it supports the New Architecture and RN 0.88.
4. After changes, run `npx tsc --noEmit` and `npx expo lint`; fix errors before reporting done.
5. If a change needs a native rebuild (new native module, config plugin, `app.config.ts` native fields), say so explicitly.
6. Don't edit `android/`, `ios/`, lockfiles by hand, or `eas.json` build profiles without asking.
7. Keep changes small and scoped; don't refactor unrelated code.

## Environment variables

- Client-side: `EXPO_PUBLIC_*` in `.env` / `.env.local` (git-ignored). Access via `process.env.EXPO_PUBLIC_X` (static access only — no destructuring).
- Build-time / secrets: EAS environment variables (`eas env:create`), read in `app.config.ts`.
<!-- TODO: list required variables, e.g. EXPO_PUBLIC_API_URL -->
