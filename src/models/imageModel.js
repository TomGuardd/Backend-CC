import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.config.js';
import User from './userModel.js';
import Disease from './diseaseModel.js';

const Image = sequelize.define('Image', {
    image_id: { 
        type: DataTypes.UUID, 
        defaultValue: uuidv4, 
        primaryKey: true 
    },
    user_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    disease_id: { 
        type: DataTypes.UUID 
    },
    image_url: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    upload_date: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

Image.belongsTo(User, { foreignKey: 'user_id' });
Image.belongsTo(Disease, { foreignKey: 'disease_id' });

export default Image;
