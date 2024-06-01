import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.config.js';
import Disease from './diseaseModel.js';

const DiseaseArticle = sequelize.define('DiseaseArticle', {
    article_id: { 
        type: DataTypes.UUID, 
        defaultValue: uuidv4, 
        primaryKey: true 
    },
    disease_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    article_content: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    article_url: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    thumbnail: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    created_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    updated_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, {
    timestamps: true,
    underscored: true,
    freezeTableName: true
});

DiseaseArticle.belongsTo(Disease, { foreignKey: 'disease_id' });

export default DiseaseArticle;
