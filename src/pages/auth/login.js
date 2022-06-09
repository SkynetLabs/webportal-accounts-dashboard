import { navigate } from "gatsby";
import isUrl from "is-url";
import AuthLayout from "../../layouts/AuthLayout";
import { LoginForm } from "../../components/forms";
import { useUser } from "../../contexts/user";
import { Metadata } from "../../components/Metadata";

const LoginPage = ({ location }) => {
  const { mutate: refreshUserState } = useUser();
  const onSuccess = async () => {
    const query = new URLSearchParams(location.search);
    const redirectTo = query.get("return_to") || "/";

    // for internal redirect, wait for user state to be refreshed to avoid
    // authenticated user state being used before user state is refreshed
    if (!isUrl(redirectTo)) {
      await refreshUserState();
    }

    navigate(redirectTo);
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
