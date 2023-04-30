import * as yup from 'yup';

const schema = yup.object().shape({
  login: yup.string().min(3).max(20).required(),
  password: yup.string().min(6).required(),
});

export default schema;
