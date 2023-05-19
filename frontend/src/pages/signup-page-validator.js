import * as yup from 'yup';

const getSchema = (t) => yup.object().shape({
  login: yup.string()
    .min(3, t('usernameLengthValidationError'))
    .max(20, t('usernameLengthValidationError'))
    .required(t('requiredField')),
  password: yup.string()
    .min(6, t('passwordLengthValidationError'))
    .required(t('requiredField')),
});

export default getSchema;
