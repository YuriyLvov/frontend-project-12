import * as yup from 'yup';
import i18next from 'i18next';

const getSchema = () => yup.object().shape({
  login: yup.string()
    .min(3, i18next.t('usernameLengthValidationError'))
    .max(20, i18next.t('usernameLengthValidationError'))
    .required(),
  password: yup.string()
    .min(6, i18next.t('passwordLengthValidationError'))
    .required(),
});

export default getSchema;
