const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Function to generate wallets
async function generateWallets(count) {
    console.log(`Generating ${count} Ethereum wallets...`);
    
    const wallets = [];
    for (let i = 0; i < count; i++) {
        // Create a random wallet
        const wallet = ethers.Wallet.createRandom();
        
        wallets.push(wallet.privateKey);
        
        console.log(`Wallet ${i + 1}/${count} generated: ${wallet.address}`);
    }
    
    return wallets;
}

// Function to save wallets to text file, one private key per line
function saveWalletsToFile(wallets, filename) {
    const filePath = path.join(__dirname, filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
        // File exists, read existing content
        const existingContent = fs.readFileSync(filePath, 'utf8');
        // Append new wallets to existing content
        const updatedContent = existingContent.trim() ? 
            existingContent.trim() + '\n' + wallets.join('\n') : 
            wallets.join('\n');
        
        // Write to file
        fs.writeFileSync(filePath, updatedContent);
        console.log(`Appended ${wallets.length} wallets to ${filePath}`);
    } else {
        // File doesn't exist, create new
        fs.writeFileSync(filePath, wallets.join('\n'));
        console.log(`Created new file with ${wallets.length} wallets at ${filePath}`);
    }
    
    return filePath;
}

// Main function
async function main() {
    try {
        const count = 50; // Default to 10 if not specified
        const filename = 'wallet.txt'; // Default filename
        
        // Generate wallets
        const wallets = await generateWallets(count);
        
        // Save to text file
        const filePath = saveWalletsToFile(wallets, filename);
        
        console.log(`Successfully generated ${count} wallets and saved to ${filename}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the script
main();
