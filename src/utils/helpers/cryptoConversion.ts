// CoinGecko API utilities for cryptocurrency price conversion

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Map crypto types to CoinGecko IDs
const CRYPTO_ID_MAP: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'USDC': 'usd-coin',
    'BNB': 'binancecoin',
    'SOL': 'solana',
};

// Map currency codes to CoinGecko currency codes
const CURRENCY_MAP: { [key: string]: string } = {
    'USD': 'usd',
    'EUR': 'eur',
    'GBP': 'gbp',
    'NGN': 'ngn',
    'CAD': 'cad',
    'AUD': 'aud',
    'JPY': 'jpy',
};

export interface CryptoPrice {
    cryptoAmount: number;
    rate: number;
    lastUpdated: Date;
}

/**
 * Fetch the current price of a cryptocurrency in a specific fiat currency
 */
export const fetchCryptoPrice = async (
    cryptoType: string,
    fiatCurrency: string
): Promise<number | null> => {
    try {
        const cryptoId = CRYPTO_ID_MAP[cryptoType.toUpperCase()];
        const currency = CURRENCY_MAP[fiatCurrency.toUpperCase()] || fiatCurrency.toLowerCase();

        if (!cryptoId) {
            console.error(`Unsupported cryptocurrency: ${cryptoType}`);
            return null;
        }

        const response = await fetch(
            `${COINGECKO_API_BASE}/simple/price?ids=${cryptoId}&vs_currencies=${currency}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch crypto price');
        }

        const data = await response.json();
        
        if (data[cryptoId] && data[cryptoId][currency]) {
            return data[cryptoId][currency];
        }

        return null;
    } catch (error) {
        console.error('Error fetching crypto price:', error);
        return null;
    }
};

/**
 * Convert fiat amount to cryptocurrency amount
 */
export const convertToCrypto = async (
    fiatAmount: number,
    fiatCurrency: string,
    cryptoType: string
): Promise<CryptoPrice | null> => {
    try {
        const rate = await fetchCryptoPrice(cryptoType, fiatCurrency);
        
        if (!rate) {
            return null;
        }

        const cryptoAmount = fiatAmount / rate;

        return {
            cryptoAmount,
            rate,
            lastUpdated: new Date(),
        };
    } catch (error) {
        console.error('Error converting to crypto:', error);
        return null;
    }
};

/**
 * Format crypto amount with appropriate decimal places
 */
export const formatCryptoAmount = (amount: number, cryptoType: string): string => {
    // BTC and ETH typically show 8 decimal places
    // Stablecoins show 2 decimal places
    const decimals = ['USDT', 'USDC'].includes(cryptoType.toUpperCase()) ? 2 : 8;
    
    return amount.toFixed(decimals);
};

/**
 * Get crypto symbol for display
 */
export const getCryptoSymbol = (cryptoType: string): string => {
    const symbols: { [key: string]: string } = {
        'BTC': '₿',
        'ETH': 'Ξ',
        'USDT': 'USDT',
        'USDC': 'USDC',
        'BNB': 'BNB',
        'SOL': 'SOL',
    };
    
    return symbols[cryptoType.toUpperCase()] || cryptoType.toUpperCase();
};
