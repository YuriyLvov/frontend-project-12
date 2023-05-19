import * as yup from 'yup';

const getSchema = (t) => yup.object().shape({
  login: yup.string().required(t('requiredField')),
});

export default getSchema;
