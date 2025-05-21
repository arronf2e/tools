const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const { stringToPath } = require('@cosmjs/crypto');
const fs = require('fs');
const path = require('path');

// Function to generate Keplr wallets
async function generateWallets(count, prefix = 'cosmos') {
    console.log(`Generating ${count} Keplr wallets with prefix ${prefix}...`);
    
    const wallets = [];
    for (let i = 0; i < count; i++) {
        // Create a random wallet with 24-word mnemonic (Keplr default)
        const wallet = await DirectSecp256k1HdWallet.generate(24, {
            prefix: prefix,
            hdPaths: [stringToPath("m/44'/118'/0'/0/0")]  // Standard Cosmos HD path
        });
        
        // Get the mnemonic and first account
        const mnemonic = wallet.mnemonic;
        const [firstAccount] = await wallet.getAccounts();
        const address = firstAccount.address;
        
        wallets.push({
            mnemonic: mnemonic,
            address: address
        });
        
        console.log(`Wallet ${i + 1}/${count} generated: ${address}`);
    }
    
    return wallets;
}

// Function to save wallets to text file
function saveWalletsToFile(wallets, filename) {
    const filePath = path.join(__dirname, filename);
    
    // Format wallet data for saving
    const walletData = wallets.map(wallet => 
        `Address: ${wallet.address}\nMnemonic: ${wallet.mnemonic}\n`
    ).join('\n');
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
        // File exists, read existing content
        const existingContent = fs.readFileSync(filePath, 'utf8');
        // Append new wallets to existing content
        const updatedContent = existingContent.trim() ? 
            existingContent.trim() + '\n\n' + walletData : 
            walletData;
        
        // Write to file
        fs.writeFileSync(filePath, updatedContent);
        console.log(`Appended ${wallets.length} wallets to ${filePath}`);
    } else {
        // File doesn't exist, create new
        fs.writeFileSync(filePath, walletData);
        console.log(`Created new file with ${wallets.length} wallets at ${filePath}`);
    }
    
    return filePath;
}

// Main function
async function main() {
    try {
        const count = 10; // Number of wallets to generate
        const filename = 'keplr_wallets.txt'; // Filename to save wallets
        const prefix = 'cosmos'; // Address prefix, change as needed (e.g., 'osmo' for Osmosis)
        
        // Generate wallets
        const wallets = await generateWallets(count, prefix);
        
        // Save to text file
        const filePath = saveWalletsToFile(wallets, filename);
        
        console.log(`Successfully generated ${count} Keplr wallets and saved to ${filename}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the script
main();
