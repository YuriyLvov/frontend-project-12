import * as yup from 'yup';

const getSchema = (t, channelNames) => yup.object().shape({
  channelName: yup.string()
    .transform((currentValue) => currentValue.trim())
    .min(3, t('channelNameLengthValidationError'))
    .max(20, t('channelNameLengthValidationError'))
    .notOneOf(channelNames, t('shouldBeUnique'))
    .required(t('requiredField')),
});

export default getSchema;
