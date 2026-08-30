import { connection } from "next/server";
import StaffList from "../_components/StaffList";

export default async function Page() {
  await connection();

  return <>
    <StaffList />
  </>
    ;
}