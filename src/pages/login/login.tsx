import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorText, setErrorText] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!formData.email || !formData.password) {
      setErrorText('Email и пароль обязательны');
      return;
    }

    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/');
      } else if (resultAction.payload) {
        setErrorText(
          typeof resultAction.payload === 'string'
            ? resultAction.payload
            : 'Ошибка авторизации'
        );
      }
    } catch (error) {
      setErrorText('Произошла непредвиденная ошибка');
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={formData.email}
      setEmail={(e) =>
        handleChange({
          target: { name: 'email', value: e }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      password={formData.password}
      setPassword={(e) =>
        handleChange({
          target: { name: 'password', value: e }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      handleSubmit={handleSubmit}
    />
  );
};
