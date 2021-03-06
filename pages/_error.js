import ErrorView from '../components/error-view/error-view.component';

function Error() {
  let error = { message: 'Oops something went wrong.' };
  return (
    <ErrorView error={error}></ErrorView>
  );
}

export default Error;