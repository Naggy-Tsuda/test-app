import { connection } from "next/server";
import StaffPage from "../_components/StaffPage";

export default async function Page() {
  await connection();

  return <>
    <h1>Hello</h1>
    <StaffPage />
  </>
    ;
}