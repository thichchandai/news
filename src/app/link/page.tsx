"use server";
import Layout from "@/components/Layout";
import { getPath } from "@/services/path-service";
import Pathtable from "./components/table";

type Path = {
  id: number;
  domainId: number;
  userId: number;
  path: string;
  click: number;
  status: boolean;
  fake: boolean;
  createdAt: string;
  updatedAt: string;
  content: Content;
  domain: Domain;
};

type Content = {
  id: number;
  pathId: number;
  type: string;
  content: null;
  image: null;
  video: null;
  link: string;
  meta: string;
  autoOff: boolean;
  delay: number;
  createdAt: string;
  updatedAt: string;
};

type Domain = {
  name: string;
};

const getData = async (): Promise<Path[]> => {
  const response = await getPath();
  if (response.status) {
    return response.message as unknown as Path[];
  }
  return [];
};

export default async function Home() {
  const paths = await getData();
  return (
    <Layout>
      <div className="list-domain">
        <Pathtable paths={paths} />
      </div>
    </Layout>
  );
}
