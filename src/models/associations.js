import User from './userModel.js';
import PasswordReset from './passwordResetModel.js';
import Profile from './profileModel.js';
import Disease from './diseaseModel.js';
import DiseaseArticle from './diseaseArticleModel.js';
import Image from './imageModel.js';
import ImageDiagnosis from './imageDiagnosisModel.js';
import Recommendation from './recommendationModel.js';

User.hasOne(Profile, { foreignKey: 'user_id' });
Profile.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(PasswordReset, { foreignKey: 'user_id' });
PasswordReset.belongsTo(User, { foreignKey: 'user_id' });

Image.belongsTo(User, { foreignKey: 'user_id' });
Image.belongsTo(Disease, { foreignKey: 'disease_id' });

ImageDiagnosis.belongsTo(Image, { foreignKey: 'image_id' });
ImageDiagnosis.belongsTo(Disease, { foreignKey: 'disease_id' });

DiseaseArticle.belongsTo(Disease, { foreignKey: 'disease_id' });

Recommendation.belongsTo(Disease, { foreignKey: 'disease_id' });

export {
    User,
    PasswordReset,
    Profile,
    Disease,
    DiseaseArticle,
    Image,
    ImageDiagnosis,
    Recommendation
};
