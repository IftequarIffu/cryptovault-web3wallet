
export const LAMPORTS = 9;
export const ETH_DECIMAL_PLACES = 18;

export const ETHEREUM_MAINNET_RPC_URL = 'https://ethereum-rpc.publicnode.com/'
export const ETHEREUM_SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com/'

export const SOLANA_DEVNET_EXPLORER_RPC_URL = 'https://explorer-api.devnet.solana.com'
export const SOLANA_MAINNET_EXPLORER_RPC_URL = 'https://api.mainnet-beta.solana.com'

export const SOLANA_EXPLORER_URL = 'https://explorer.solana.com'

export const ETHERSCAN_API_KEY = '9HNRWZ3XIEF8RDH46UVFHVXFHFXW7BPA93'

export const SEPOLIA_ETHERSCAN_API_URL = 'https://api-sepolia.etherscan.io'
export const MAINNET_ETHERSCAN_API_URL = 'https://api.etherscan.io'

export const SEPOLIA_ETHERSCAN_EXPLORER_URL = 'https://sepolia.etherscan.io'
export const MAINNET_ETHERSCAN_EXPLORER_URL = 'https://etherscan.io'

export const supportedNetworks = {
  Ethereum: { name: "Ethereum", symbol: "ETH", color: "bg-blue-500", type: "mainnet",  networkRpcUrl: ETHEREUM_MAINNET_RPC_URL },
  Solana: { name: "Solana", symbol: "SOL", color: "bg-purple-500", type: "mainnet", networkRpcUrl: SOLANA_MAINNET_EXPLORER_RPC_URL },
  "ETH Sepolia": { name: "ETH Sepolia", symbol: "SepoliaETH", color: "bg-yellow-500", type: "testnet", networkRpcUrl: ETHEREUM_SEPOLIA_RPC_URL},
  "SOL Devnet": { name: "SOL Devnet", symbol: "SOL", color: "bg-green-500", type: "devnet", networkRpcUrl: SOLANA_DEVNET_EXPLORER_RPC_URL}
};