import { JolocomLib } from 'jolocom-lib'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { EthereumLib, EthereumLibInterface } from 'src/lib/ethereum'
import { EncryptionLib, EncryptionLibInterface } from 'src/lib/crypto'
import { Storage } from 'src/lib/storage/storage'
import { KeyChain, KeyChainInterface } from 'src/lib/keychain'
import { ConnectionOptions } from 'typeorm/browser'
import { ILibConfig } from 'jolocom-lib/js/types';

// TODO Type config better
export interface BackendMiddlewareConfigInterface {
    defaultConfig?: ILibConfig,
    fuelingEndpoint: string, 
    typeOrmConfig: ConnectionOptions
}

export class BackendMiddleware {
  identityWallet!: IdentityWallet
  ethereumLib: EthereumLibInterface
  storageLib: Storage
  encryptionLib: EncryptionLibInterface
  keyChainLib: KeyChainInterface

  constructor(config: BackendMiddlewareConfigInterface) {
    this.ethereumLib = new EthereumLib(config.fuelingEndpoint)
    this.storageLib = new Storage(config.typeOrmConfig),
    this.encryptionLib = new EncryptionLib(),
    this.keyChainLib = new KeyChain()
  }

  async setIdentityWallet(privKey: Buffer): Promise<void> {
    const registry = JolocomLib.registry.jolocom.create()
    this.identityWallet = await registry.authenticate(privKey)
  }
}