import ErrorView from '../components/error-view/error-view.component';

function Error404() {
  const error = { message: 'Hmm, can\'t find that page.' };
  return (
    <ErrorView error={error}></ErrorView>
  );
}

export default Error404;