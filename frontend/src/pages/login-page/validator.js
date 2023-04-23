import * as yup from 'yup';

const schema = yup.object().shape({
  login: yup.string().required(),
  email: yup.string().email(),
});

export default schema;
