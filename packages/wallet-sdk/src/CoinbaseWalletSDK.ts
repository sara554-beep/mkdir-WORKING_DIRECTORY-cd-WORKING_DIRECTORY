// Copyright (c) 2018-2024 Coinbase, Inc. <https://www.coinbase.com/>

import { LogoType, walletLogo } from './assets/wallet-logo';
import { CoinbaseWalletProvider } from './CoinbaseWalletProvider';
import { ScopedLocalStorage } from './core/storage/ScopedLocalStorage';
import { ProviderInterface } from './core/type/ProviderInterface';
import { getFavicon } from './core/util';
import { LIB_VERSION } from './version';

/** Coinbase Wallet SDK Constructor Options */
export interface CoinbaseWalletSDKOptions {
  /** Application name */
  appName: string;
  /** @optional Application logo image URL; favicon is used if unspecified */
  appLogoUrl?: string;
  /** @optional Array of chainIds your dapp supports */
  chainIds?: number[];
  /** @optional Pre-select the wallet connection method */
  smartWalletOnly?: boolean;
}

export class CoinbaseWalletSDK {
  private appName: string;
  private appLogoUrl: string | null;
  private smartWalletOnly: boolean;
  private chainIds: number[];

  /**
   * Constructor
   * @param options Coinbase Wallet SDK constructor options
   */
  constructor(options: Readonly<CoinbaseWalletSDKOptions>) {
    this.smartWalletOnly = options.smartWalletOnly || false;
    this.chainIds = options.chainIds ? options.chainIds.map(Number) : [];
    this.appName = options.appName || 'DApp';
    this.appLogoUrl = options.appLogoUrl || getFavicon();

    this.storeLatestVersion();
  }

  private storeLatestVersion() {
    const versionStorage = new ScopedLocalStorage('CBWSDK');
    versionStorage.setItem('VERSION', LIB_VERSION);
  }

  public makeWeb3Provider(): ProviderInterface {
    if (!this.smartWalletOnly) {
      const injectedCoinbaseProvider = this.grabInjectedProvider();
      if (injectedCoinbaseProvider) {
        return injectedCoinbaseProvider;
      }
    }

    return new CoinbaseWalletProvider({
      appName: this.appName,
      appLogoUrl: this.appLogoUrl,
      appChainIds: this.chainIds,
      smartWalletOnly: this.smartWalletOnly,
    });
  }

  /**
   * Official Coinbase Wallet logo for developers to use on their frontend
   * @param type Type of wallet logo: "standard" | "circle" | "text" | "textWithLogo" | "textLight" | "textWithLogoLight"
   * @param width Width of the logo (Optional)
   * @returns SVG Data URI
   */
  public getCoinbaseWalletLogo(type: LogoType, width = 240): string {
    return walletLogo(type, width);
  }

  private grabInjectedProvider(): ProviderInterface | undefined {
    const extension = window.coinbaseWalletExtension;

    if (extension) {
      if (extension?.shouldUseSigner) return undefined;

      extension.setAppInfo?.(this.appName, this.appLogoUrl);
      return extension;
    }

    const ethereum = window.ethereum ?? window.top?.ethereum;
    if ('isCoinbaseBrowser' in ethereum && ethereum.isCoinbaseBrowser) {
      return ethereum;
    }

    return undefined;
  }
}
