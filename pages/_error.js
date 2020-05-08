import ErrorView from '../components/error-view/error-view.component';

function Error({ statusCode }) {
  let error = { message: 'Oops something went wrong.' };
  if (statusCode === 404) {
    error.message = 'Hmm, can\'t find that page.';
  } else if (statusCode === 500) {
    error.message = 'Something really went wrong. If this continues to occur, please contact the site admin!';
  }

  return (
    <ErrorView error={error}></ErrorView>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
};

export default Error;