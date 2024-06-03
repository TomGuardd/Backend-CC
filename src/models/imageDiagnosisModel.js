import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.config.js';
import Image from './imageModel.js';
import Disease from './diseaseModel.js';

const ImageDiagnosis = sequelize.define('image_diagnosis', {
    diagnosis_id: { 
        type: DataTypes.UUID, 
        defaultValue: uuidv4, 
        primaryKey: true 
    },
    image_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    disease_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    confidence_level: { 
        type: DataTypes.FLOAT 
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

ImageDiagnosis.belongsTo(Image, { foreignKey: 'image_id' });
ImageDiagnosis.belongsTo(Disease, { foreignKey: 'disease_id' });

export default ImageDiagnosis;
