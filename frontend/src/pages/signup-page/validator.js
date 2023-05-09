import * as yup from 'yup';
import i18next from 'i18next';

const getSchema = () => yup.object().shape({
  login: yup.string()
    .min(3, i18next.t('usernameLengthValidationError'))
    .max(20, i18next.t('usernameLengthValidationError'))
    .required(i18next.t('requiredField')),
  password: yup.string()
    .min(6, i18next.t('passwordLengthValidationError'))
    .required(i18next.t('requiredField')),
});

export default getSchema;
