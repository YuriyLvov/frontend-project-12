import * as yup from 'yup';
import i18next from 'i18next';

const getSchema = (channelNames) => yup.object().shape({
  channelName: yup.string()
    .transform((currentValue) => currentValue.trim())
    .min(3, i18next.t('channelNameLengthValidationError'))
    .max(20, i18next.t('channelNameLengthValidationError'))
    .notOneOf(channelNames, i18next.t('shouldBeUnique'))
    .required(i18next.t('requiredField')),
});

export default getSchema;
