import { navigate } from "gatsby";
import AuthLayout from "../../layouts/AuthLayout";
import { LoginForm } from "../../components/forms";
import { useUser } from "../../contexts/user";
import { Metadata } from "../../components/Metadata";
import useRedirectParam from "../../hooks/useRedirectParam";

const LoginPage = ({ location }) => {
  const { mutate: refreshUserState } = useUser();
  const { url, internal } = useRedirectParam(location);

  const onSuccess = async () => {
    // for internal redirect, wait for user state to be refreshed to avoid
    // authenticated user state being used before user state is refreshed
    if (!url || internal) {
      await refreshUserState();
    }

    navigate(url || "/");
  };

  return (
    <>
      <Metadata>
        <title>Sign In</title>
      </Metadata>
      <LoginForm onSuccess={onSuccess} />
    </>
  );
};

LoginPage.Layout = AuthLayout;

export default LoginPage;
