
import bcrypt from 'bcryptjs';
import { User, UserCredential } from '../models';
import { sequelize } from './database';

const MandatoryData = async () => {
  return sequelize.sync({ force: (process.env.FORCE_SYNC == 'true') })
    .then(() => {
      console.log('Database & tables created!');
    })
    .then(async () => {
      console.log('Create initial data...');

      if (process.env.FORCE_SYNC == 'true') {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const admin = await User.findOne({ where: { username: adminUsername } });
        if (!admin) {
          const encryptedPassword = await bcrypt.hash(adminPassword, 10);
          const newUser = await User.create({
            username: adminUsername
          });
          await UserCredential.create({
            userId: newUser.id,
            password: encryptedPassword
          });

        }
      }
    })
    .then(() => {
      console.log('Done!');
      return;
    });
};

export { MandatoryData };