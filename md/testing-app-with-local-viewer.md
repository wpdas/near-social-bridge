## Testing the Application Inside a Local Viewer

To test your app, you can install the [**NEAR Social Local Viewer CLI**](https://github.com/wpdas/near-social-local-viewer). It will allow you to execute and test your BOS Component locally using all the Discovery API resources without any problem.

1 - Install NEAR Social Local Viewer CLI using npm or yarn:

```sh
# npm
npm install near-social-local-viewer --save-dev

# yarn
yarn add near-social-local-viewer -D
```

2 - Now you can create a script within `package.json` file:

```json
{
  "scripts": {
    "start:widget": "npx init-viewer path/to/widgets/"
  }
}
```

3 - or just run:

```sh
npx init-viewer path/to/widgets/

# e.g: npx init-viewer widgets/
```

4 - Once your BOS Component is ready, you can deploy it to Near Social: <br/>
4.1 - You can deploy it by copying and pasting; <br/>
4.2 - Or using [near-social CLI](https://github.com/FroVolod/near-social).
