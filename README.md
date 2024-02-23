# <div style="display: flex; align-items: center; gap: 8px;"><img src='./md/near-social-bridge-logo.png' height='27' alt='NEAR Social Bridge Logo' /> NEAR Social Bridge</div>

[![Build Status](https://img.shields.io/github/actions/workflow/status/wpdas/near-social-bridge/publish.yml?style=for-the-badge&colorB=000000)](https://github.com/wpdas/near-social-bridge/actions?query=workflow%3Apublish)
[![Build Size](https://img.shields.io/bundlephobia/minzip/near-social-bridge/1.0.1?label=bundle%20size&style=for-the-badge&colorB=000000)](https://bundlephobia.com/package/near-social-bridge)
[![Version](https://img.shields.io/npm/v/near-social-bridge?style=for-the-badge&colorB=000000)](https://www.npmjs.com/package/near-social-bridge)
[![Downloads](https://img.shields.io/npm/dt/near-social-bridge.svg?style=for-the-badge&colorB=000000)](https://www.npmjs.com/package/near-social-bridge)
![Tests](https://near-social-bridge-tests.vercel.app/api/tests-passing)

This library allows you to create a common application using ReactJS and use it inside a BOS Component. Therefore, the BOS Component talks to the React application and vice versa, making it possible to consume the [Blockchain Operating System](https://docs.near.org/bos/overview#) resources within the React application.

Check out some apps using Near Social Bridge:

- [NEAR Query API](https://github.com/near/queryapi/tree/main/frontend)
- [Chat App](https://github.com/wpdas/chatv2-near-widget-app)

Tutorials:
- [Greeting App](https://github.com/wpdas/near-social-bridge/tree/main/examples/greeting-app)
- [Todo App](https://github.com/wpdas/near-social-bridge/tree/main/examples/todo-app)
- [SSR NextJS Test App](https://github.com/wpdas/nextjs-near-widget-app)
- [Decentralized App - Tutorial](./examples/dapp-bos-tutorial/TUTORIAL.md)

## Install

Install it using npm or yarn:

```sh
# npm
npm install near-social-bridge

# yarn
yarn add near-social-bridge
```

## How to Use

Here's a complete guide where you can go over all features provided by Near Social Bridge.

### Main Features

- [Setup](./md/setup.md)
- [BOS API](./md/bos-api.md)
  - [Near API](./md/bos-api.md#near-api)
  - [Social API](./md/bos-api.md#social-api)
  - [Storage API](./md/bos-api.md#storage-api)
  - [Fetch API](./md/bos-api.md#fetch-api)
- [Requests](./md/requests.md)
  - [Simple Request](./md/requests.md#simple-request)
  - [Handling requests inside the BOS Component](./md/requests.md#handling-requests-inside-the-bos-component)
  - [Using request Utils inside the BOS Component](./md/requests.md#using-request-utils-inside-the-bos-component)
  - [Requests - Concurrency](./md/requests.md#requests---concurrency)
- [Components](./md/components.md)
- [Hooks](./md/hooks.md)
  - [useNearSocialBridge](./md/hooks.md#usenearsocialbridge)
  - [useConnectionStatus](./md/hooks.md#useconnectionstatus)
  - [useInitialPayload](./md/hooks.md#useinitialpayload)
  - [useAuth](./md/hooks.md#useauth)
  - [useWidgetView](./md/hooks.md#usewidgetview)
  - [useSyncContentHeight](./md/hooks.md#usesynccontentheight)
- [Preparing a new BOS Component](./md/preparing-new-bos-component.md)
- [Testing the Application with Local Viewer](./md/testing-app-with-local-viewer.md)

### Extra Features

- [Database](./md/database.md)
- [Mock](./md/mock.md)
  - [Setup Mocks](./md/mock.md#setup-mocks)
  - [Mock Authenticated User](./md/mock.md#mock-authenticated-user)
  - [Mock Initial Payload](./md/mock.md#mock-initial-payload)
  - [Create Requests Mocks](./md/mock.md#create-requests-mocks)
- [Navigation](./md/navigation.md)
  - [Implementing routes](./md/navigation.md#implementing-routes)
- [Session Storage](./md/session-storage.md)
- [Persist Storage](./md/persist-storage.md)
- [BOSComponent - experimental](./md/experimental.md#boscomponent)
- [Hooks](./md/hooks.md)
  - [useBOSComponent - experimental](./md/experimental.md#useboscomponent)
  - [useNavigation](./md/hooks.md#usenavigation)
  - [useSessionStorage](./md/hooks.md#usesessionstorage)
- [Utils](./md/utils.md)
  - [initRefreshService](./md/utils.md#initrefreshservice)
  - [overrideLocalStorage](./md/utils.md#overridelocalstorage)

## React / Next App Deployment

You can deploy your app in two ways: decentralized or centralized.

- [Deploying to IPFS (CSR) - Decentralized](./md/deploying-to-ipfs-csr.md)
- [Deploying to Vercel (SSR)](./md/deploying-to-vercel-ssr.md)

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md).
