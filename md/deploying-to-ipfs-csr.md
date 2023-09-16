## Deploying to IPFS (CSR)

This method works only with **Client Side Rendering**

As this is intended to be a decentralized app, it's recommended that we deploy it using a decentralized source. To accomplish that, you can use IPFS. When the files are stored within IPFS, they can be deleted if not pinned. To pin the files, we need to use our own node or third service to do it for us. We recommend [**Thirdweb**](https://thirdweb.com/dashboard) and this is the service this session is going to use in order to teach how to deploy the app.

Don't worry about the Thirdweb pricing. You'll have up to 50GB of storage pinning using the STARTER (free) plan, which is pretty enough.

1 - Firstly, build your app. We're considering your app's build files are inside the **build** folder.

2 - Create a **MetaMask** wallet if you don't have one yet and create an account (e.g. Ethereum).

3 - If you have a Thirdweb API Key in place at this point, you can skip it. If not: <br>
3.1 - Go to https://thirdweb.com/dashboard, then click on **Connect Wallet**. Select **MetaMask**, it'll open up the MetaMask extension. All you need to do is proceed with the required transactions. <br>
3.2 - Now, go to **Settings** tab, then, on the left side, **API Keys**, then, **+ Create API Key**. <br>
3.3 - Follow the steps to create your API Key. When you reach the **Set Access Restrictions** step, mark the **Unrestricted access** checkbox or type the domains you want to allow: `localhost:3000, localhost:3001, near.org, alpha.near.org, test.near.org`. At the end of the process, you will receive a client ID and secret key. Copy and paste this data somewhere else, you may need them for other projects.

4 - In your terminal (from the root), type:

```sh
npx thirdweb@latest upload build
```

This command is used to upload a folder and its files to IPFS and pin them. If this is your first time on your machine using thirdweb, it's going to open up a tab in your browser asking to authorize your machine.

In case your machine is authorized already, it'll just upload the files.

You'll be provided with the IPFS URI and also a link to access your files using the thirdapp gateway, this is the one you're going to use inside the BOS. Copy and paste it somewhere else, you'll use it to feed the `externalAppUrl` later while [**preparing a new BOS Component**](#preparing-a-new-bos-component).

<p align="left">
  <img src="./examples/dapp-bos-tutorial/thirdweb.png" />
</p>

This provided link is going to open the index.html because this is the pattern, but you can navigate through every file like so: https://bafybeifoa44fxhb7k66bzd2txhzgju7xy2llvw7mnvial2wln7votokewe.ipfs.cf-ipfs.com/logo192.png

Every time you upload a file or folder, they are going to have a unique CID as well as a unique link
