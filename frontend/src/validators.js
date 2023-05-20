import * as yup from 'yup';

export const getChannelChangeSchema = (t, channelNames) => yup.object().shape({
  channelName: yup.string()
    .transform((currentValue) => currentValue.trim())
    .min(3, t('channelNameLengthValidationError'))
    .max(20, t('channelNameLengthValidationError'))
    .notOneOf(channelNames, t('shouldBeUnique'))
    .required(t('requiredField')),
});

export const getLoginFormSchema = (t) => yup.object().shape({
  login: yup.string().required(t('requiredField')),
});

export const getSignupFormSchema = (t) => yup.object().shape({
  login: yup.string()
    .min(3, t('usernameLengthValidationError'))
    .max(20, t('usernameLengthValidationError'))
    .required(t('requiredField')),
  password: yup.string()
    .min(6, t('passwordLengthValidationError'))
    .required(t('requiredField')),
});
