import { useAuthenticator, CheckboxField, Text } from '@aws-amplify/ui-react';
import { useState } from 'react';

const CustomSignIn = () => {
  const { signIn } = useAuthenticator();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreed) {
      setError('You must agree to the Terms of Service');
      return;
    }
    const formData = new FormData(event.currentTarget);
    signIn({
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 用户名和密码字段 */}
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />

      {/* 用户协议勾选框 */}
      <div>
        <CheckboxField
          label="I agree to the "
          name="agree"
          value="yes"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>
      </div>
      {error && <Text variation="error">{error}</Text>}

      <button type="submit">Sign In</button>
    </form>
  );
};