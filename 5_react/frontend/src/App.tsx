import Products from "./Products";
import type { ApiClient } from "./apiClient";
import { Payments } from "./Payments";

export default function App({ api }: { api: ApiClient }) {

  return (
    <>
      <Products api={api} />
      <Payments api={api} />
    </>
  )
}
