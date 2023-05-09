import * as yup from 'yup';
import i18next from 'i18next';

const schema = yup.object().shape({
  login: yup.string().required(i18next.t('requiredField')),
});

export default schema;
