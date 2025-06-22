import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [formData, setFormData] = useState({
    name: '',
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

    if (!formData.email || !formData.password || !formData.name) {
      setErrorText('Все поля обязательны');
      return;
    }

    if (formData.password.length < 6) {
      setErrorText('Пароль должен быть не менее 6 символов');
      return;
    }

    try {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        navigate('/');
      } else if (resultAction.payload) {
        // Убедимся, что payload - строка
        setErrorText(
          typeof resultAction.payload === 'string'
            ? resultAction.payload
            : 'Ошибка регистрации'
        );
      }
    } catch (error) {
      setErrorText('Произошла непредвиденная ошибка');
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={formData.email}
      userName={formData.name}
      password={formData.password}
      setEmail={(e) =>
        handleChange({
          target: { name: 'email', value: e }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      setPassword={(e) =>
        handleChange({
          target: { name: 'password', value: e }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      setUserName={(e) =>
        handleChange({
          target: { name: 'name', value: e }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      handleSubmit={handleSubmit}
    />
  );
};
