"use server";
import Layout from "@/components/Layout";
import { DomainForm } from "./components/domain-form";
import DomainTable from "./components/table";
import { getDomain } from "@/services/domain-service";

type Domain = {
  id: number;
  name: string;
  status: string;
  createdAt: string;
};

const getData = async (): Promise<Domain[]> => {
  const response = await getDomain();
  if (response.status) {
    return response.message as unknown as Domain[];
  }
  return [];
};

export default async function Home() {
  const domains = await getData();
  return (
    <Layout>
      <div className="form-domain">
        <DomainForm />
      </div>
      <div className="list-domain">
        <DomainTable domains={domains} />
      </div>
    </Layout>
  );
}
