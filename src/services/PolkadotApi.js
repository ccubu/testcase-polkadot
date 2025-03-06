const { ApiPromise, WsProvider } = require('@polkadot/api');

class PolkadotApi {
  constructor() {
    if (!PolkadotApi.instance) {
      this.wsProvider = new WsProvider('wss://rpc.polkadot.io');
      this.api = null;
      PolkadotApi.instance = this;
    }
    return PolkadotApi.instance;
  }

  async init() {
    if (!this.api) {
      try {
        this.api = await ApiPromise.create({ provider: this.wsProvider });
        await this.api.isReady;
        console.log("Connected to Polkadot API");
      } catch (error) {
        console.error("Error connecting to Polkadot API:", error);
        process.exit(1);
      }
    }
    return this.api;
  }

  getApi() {
    if (!this.api) {
      throw new Error("Polkadot API has not been initialized. Call init() first.");
    }
    return this.api;
  }

  async disconnect() {
    if (this.api) {
      console.log("Disconnecting from Polkadot API...");
      await this.api.disconnect();
      console.log("Disconnected.");
      this.api = null;
    }
  }
}

const instance = new PolkadotApi();

module.exports = instance;