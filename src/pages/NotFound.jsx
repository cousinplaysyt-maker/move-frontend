import { Page, Empty, Btn } from '../components/ui';

export default function NotFound() {
  return (
    <Page title="Page not found" back={false}>
      <Empty title="That page doesn't exist" action={<Btn to="/">Back to Discover</Btn>} />
    </Page>
  );
}
