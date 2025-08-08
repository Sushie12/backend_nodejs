const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('./models/Vendor');

dotenv.config();

async function checkVendors() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if vendors exist
        const vendors = await Vendor.find();
        console.log(`Found ${vendors.length} vendors:`);
        
        if (vendors.length > 0) {
            vendors.forEach((vendor, index) => {
                console.log(`\nVendor ${index + 1}:`);
                console.log(`- Username: ${vendor.username}`);
                console.log(`- Email: ${vendor.email}`);
                console.log(`- ID: ${vendor._id}`);
                console.log(`- Firms: ${vendor.firm.length} firms associated`);
            });
        } else {
            console.log('No vendors found in database');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

checkVendors(); 