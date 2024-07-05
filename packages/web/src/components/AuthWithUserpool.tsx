import { Amplify } from 'aws-amplify';
import { Authenticator, translations } from '@aws-amplify/ui-react';
import App from '../App.tsx';
import CustomSignIn from './CustomSignIn.tsx';
import { I18n } from 'aws-amplify/utils';

const selfSignUpEnabled: boolean =
  import.meta.env.VITE_APP_SELF_SIGN_UP_ENABLED === 'true';

const AuthWithUserpool: React.FC = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
        identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
      },
    },
  });

  I18n.putVocabularies(translations);
  I18n.setLanguage('en');
  // I18n.setLanguage('ja');

  return (
    <Authenticator
      hideSignUp={!selfSignUpEnabled}
      components={{
        Header: () => (
          <div className="text-aws-font-color mb-5 mt-10 flex justify-center text-3xl">
            Generative AI for Research on AWS
          </div>
        ),
        SignIn: CustomSignIn,  // 使用自定义的 SignIn 组件
      }}>
      <App />
    </Authenticator>
  );
  // return (
  //   <Authenticator
  //     hideSignUp={!selfSignUpEnabled}
  //     components={{
  //       Header: () => (
  //         <div className="text-aws-font-color mb-5 mt-10 flex justify-center text-3xl">
  //           Generative AI for Research on AWS
  //         </div>
  //       ),
  //     }}>
  //     <App />
  //   </Authenticator>
  // );
};

export default AuthWithUserpool;
