const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const User = require('../models/user');

const importUsers = async () => {
  try {
    console.log('--- Starting User Import Process ---');

    // 1. Read the JSON file
    const filePath = path.join(__dirname, '..', 'data', 'signup.json');
    if (!fs.existsSync(filePath)) {
      console.error('Error: signup.json not found in the data directory.');
      return;
    }
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);
    const usersToImport = data['Form Responses 1'];

    if (!usersToImport || !Array.isArray(usersToImport)) {
      console.error('Error: Invalid JSON format. The file must contain a "Form Responses 1" key with an array.');
      return;
    }

    console.log(`Found ${usersToImport.length} users to import.`);
    let createdCount = 0;
    let skippedCount = 0;

    // 2. Iterate and create users
    for (const userData of usersToImport) {
      const email = userData['آدرس ایمیل']?.trim();
      const nationalId = String(userData['کد ملی'])?.trim();

      if (!email || !nationalId) {
        console.warn('Skipping record due to missing email or national ID:', userData);
        skippedCount++;
        continue;
      }

      // 3. Use national ID as the default password and hash it
      const defaultPassword = nationalId;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      const [user, created] = await User.findOrCreate({
        where: { email: email },
        defaults: {
          firstName: userData['نام']?.trim(),
          lastName: userData['نام خانوادگی']?.trim(),
          phoneNumber: String(userData['شماره تلفن همراه'])?.trim(),
          nationalId: nationalId,
          email: email,
          password: hashedPassword, // Hashed password
          isActive: false, // Set users as inactive by default
        }
      });

      if (created) {
        console.log(`Successfully created user with email: ${email}`);
        createdCount++;
      } else {
        console.log(`User with email ${email} already exists. Skipped.`);
        skippedCount++;
      }
    }

    console.log('--- Import Process Finished ---');
    console.log(`✅ New users created: ${createdCount}`);
    console.log(`⏩ Skipped (duplicate) users: ${skippedCount}`);

  } catch (error) {
    console.error('An unexpected error occurred:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

// Run the script
importUsers();