import * as yup from 'yup';

const schema = yup.object().shape({
  login: yup.string().required(),
});

export default schema;
